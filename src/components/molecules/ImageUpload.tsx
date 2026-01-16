"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/atoms";
import { S3Service, type ImageType } from "@/lib/s3/service";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  imageType: ImageType;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  imageType,
  label = "Immagine",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Seleziona un file immagine valido");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("L'immagine deve essere inferiore a 5MB");
      return;
    }

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
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: value }),
      });
    } catch {
      // Ignore delete errors, still remove from form
    }

    onChange(null);
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
              className="object-contain"
              sizes="400px"
            />
          </div>
          <div className="mt-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
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
          onClick={() => !uploading && inputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center w-full max-w-sm aspect-video
            border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${uploading ? "border-primary-400 bg-primary-50" : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"}
          `}
        >
          {uploading ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2">
                <svg className="animate-spin h-full w-full text-primary-600" viewBox="0 0 24 24">
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
                className="w-10 h-10 text-gray-400 mb-2"
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
              <p className="text-sm text-gray-600">Clicca per caricare</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (max 5MB)</p>
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
    </div>
  );
}

