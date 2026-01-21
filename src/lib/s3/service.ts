export type ImageType = "prodotti" | "trattamenti";

export const BUCKET_NAME = "svetla-estetica";
export const BUCKET_REGION = "eu-west-1";

export class S3Service {
  /**
   * Get a pre-signed URL from the API route
   */
  static async getPresignedUrl(
    fileName: string,
    fileType: string,
    imageType: ImageType
  ): Promise<string> {
    const params = new URLSearchParams({ fileName, fileType, imageType });
    const response = await fetch(`/api/s3/upload-url?${params}`);

    if (!response.ok) {
      throw new Error("Failed to get pre-signed URL");
    }

    const data = await response.json();
    return data.uploadUrl;
  }

  /**
   * Upload the file to S3 using the pre-signed URL
   */
  static async uploadFileToS3({
    uploadUrl,
    file,
    fileType,
    onUploadProgress,
  }: {
    uploadUrl: string;
    file: File;
    fileType: string;
    onUploadProgress?: (progress: number) => void;
  }): Promise<void> {
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          onUploadProgress?.(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(new Error("Failed to upload file to S3"));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Failed to upload file to S3"));
      });

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", fileType);
      xhr.send(file);
    });
  }

  /**
   * Generate a unique filename
   */
  static generateFileName(originalName: string): string {
    const ext = originalName.split(".").pop() || "jpg";
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${randomStr}.${ext}`;
  }

  /**
   * Get the S3 key for an image
   */
  static getImageKey(imageType: ImageType, fileName: string): string {
    return `images/${imageType}/${fileName}`;
  }

  /**
   * Get the full public URL for an image
   */
  static getImageUrl(imageType: ImageType, fileName: string): string {
    return `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/images/${imageType}/${fileName}`;
  }

  /**
   * Extract filename from a full S3 URL
   */
  static extractFileName(url: string): string | null {
    const match = url.match(/images\/(prodotti|trattamenti)\/([^?]+)/);
    return match ? match[2] : null;
  }

  /**
   * Extract image type from a full S3 URL
   */
  static extractImageType(url: string): ImageType | null {
    const match = url.match(/images\/(prodotti|trattamenti)\//);
    return match ? (match[1] as ImageType) : null;
  }

  /**
   * Upload a file to S3 and return the public URL
   */
  static async uploadFile(
    file: File,
    imageType: ImageType,
    onProgress?: (progress: number) => void
  ): Promise<string> {
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

    await S3Service.uploadFileToS3({
      uploadUrl,
      file,
      fileType: file.type,
      onUploadProgress: onProgress,
    });

    return publicUrl;
  }
}
