"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button, Modal } from "@/components/atoms";
import { S3Service, type ImageType } from "@/lib/s3/service";

const TARGET_SIZE_KB = 150;
const MAX_DIMENSION = 1200; // Max width/height for product images

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  imageType: ImageType;
  label?: string;
  /** Defer upload until parent triggers it - exposes pending file via onPendingFileChange */
  deferUpload?: boolean;
  /** Called when a file is ready for deferred upload */
  onPendingFileChange?: (file: File | null) => void;
}

// Compress image to target size
async function compressImage(
  canvas: HTMLCanvasElement,
  targetSizeKB: number
): Promise<Blob> {
  let quality = 0.92;
  let blob: Blob | null = null;

  // Try WebP first (best compression), fallback to JPEG
  const formats = ["image/webp", "image/jpeg"];

  for (const format of formats) {
    quality = 0.92;

    while (quality > 0.1) {
      blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, format, quality);
      });

      if (blob && blob.size <= targetSizeKB * 1024) {
        return blob;
      }

      quality -= 0.05;
    }

    // If we got a blob but it's still too big, return best effort
    if (blob) {
      return blob;
    }
  }

  // Fallback: return whatever we got
  return (
    blob ||
    (await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.5);
    }))
  );
}

// Create cropped and compressed image from crop data
async function getCroppedImage(
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<File> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Calculate scale to fit within max dimensions
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  // Scale down if larger than max dimension
  let outputWidth = cropWidth;
  let outputHeight = cropHeight;

  if (outputWidth > MAX_DIMENSION || outputHeight > MAX_DIMENSION) {
    const scale = Math.min(
      MAX_DIMENSION / outputWidth,
      MAX_DIMENSION / outputHeight
    );
    outputWidth *= scale;
    outputHeight *= scale;
  }

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  // Draw cropped and scaled image
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    cropWidth,
    cropHeight,
    0,
    0,
    outputWidth,
    outputHeight
  );

  // Compress to target size
  const blob = await compressImage(canvas, TARGET_SIZE_KB);

  // Create file from blob
  const extension = blob.type === "image/webp" ? "webp" : "jpg";
  return new File([blob], `cropped-image.${extension}`, { type: blob.type });
}

export function ImageUpload({
  value,
  onChange,
  imageType,
  label = "Immagine",
  deferUpload = false,
  onPendingFileChange,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imageRef = useRef<HTMLImageElement>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);
      setProgress(0);

      try {
        // Get presigned URL
        const response = await fetch(
          `/api/s3/upload-url?${new URLSearchParams({
            fileName: file.name,
            fileType: file.type,
            imageType,
          })}`
        );

        if (!response.ok) {
          throw new Error("Errore nel caricamento");
        }

        const { uploadUrl, publicUrl } = await response.json();

        // Upload to S3
        await S3Service.uploadFileToS3({
          uploadUrl,
          file,
          fileType: file.type,
          onUploadProgress: setProgress,
        });

        onChange(publicUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore nel caricamento");
      } finally {
        setUploading(false);
        setProgress(0);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    },
    [imageType, onChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      openCropModal(file);
    }
  };

  const openCropModal = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Seleziona un file immagine valido");
      return;
    }

    // Validate file size (max 10MB for source, will be compressed)
    if (file.size > 10 * 1024 * 1024) {
      setError("L'immagine deve essere inferiore a 10MB");
      return;
    }

    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async () => {
    if (!imageRef.current || !completedCrop || !originalFile) {
      return;
    }

    try {
      const croppedFile = await getCroppedImage(imageRef.current, completedCrop);
      setCropModalOpen(false);
      setImageSrc(null);
      setCrop(undefined);
      setCompletedCrop(undefined);
      setOriginalFile(null);

      if (deferUpload) {
        // Create object URL for preview and expose file to parent
        const previewUrl = URL.createObjectURL(croppedFile);
        onChange(previewUrl);
        onPendingFileChange?.(croppedFile);
      } else {
        await uploadFile(croppedFile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel ritaglio");
    }
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setImageSrc(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setOriginalFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (uploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      openCropModal(file);
    }
  };

  const handleClick = () => {
    if (!uploading) {
      inputRef.current?.click();
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    // Only delete from S3 if it's an actual S3 URL (not a blob URL)
    if (!value.startsWith("blob:")) {
      try {
        await fetch("/api/s3/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: value }),
        });
      } catch {
        // Ignore delete errors, still remove from form
      }
    } else {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(value);
    }

    onChange(null);
    onPendingFileChange?.(null);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    // Default to center crop with 80% of smallest dimension
    const minDim = Math.min(width, height);
    const cropSize = minDim * 0.8;
    const x = (width - cropSize) / 2;
    const y = (height - cropSize) / 2;

    setCrop({
      unit: "px",
      x,
      y,
      width: cropSize,
      height: cropSize,
    });
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {value ? (
        <div className="relative">
          <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            <Image
              src={value}
              alt="Preview"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
          <div className="mt-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClick}
              disabled={uploading}
            >
              Sostituisci
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={uploading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Rimuovi
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center w-full max-w-sm aspect-video
            border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${
              uploading
                ? "border-primary-400 bg-primary-50"
                : isDragging
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
            }
          `}
        >
          {uploading ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2">
                <svg
                  className="animate-spin h-full w-full text-primary-600"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <p className="text-sm text-primary-600 font-medium">
                Caricamento... {progress}%
              </p>
            </div>
          ) : (
            <>
              <svg
                className={`w-10 h-10 mb-2 ${isDragging ? "text-primary-500" : "text-gray-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-600">
                {isDragging ? "Rilascia per caricare" : "Clicca o trascina"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, WEBP (max 10MB)
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Crop Modal */}
      <Modal
        open={cropModalOpen}
        onClose={handleCropCancel}
      >
        <h3 className="font-display text-xl font-bold text-gray-900 mb-4">
          Ritaglia immagine
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Seleziona l&apos;area da mantenere. L&apos;immagine verrà ottimizzata
          automaticamente.
        </p>

        {imageSrc && (
          <div className="max-h-[60vh] overflow-auto mb-4">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              className="max-w-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                onLoad={onImageLoad}
                style={{ maxWidth: "100%", maxHeight: "50vh" }}
              />
            </ReactCrop>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={handleCropCancel}>
            Annulla
          </Button>
          <Button type="button" onClick={handleCropComplete} disabled={!completedCrop}>
            Conferma
          </Button>
        </div>
      </Modal>
    </div>
  );
}
