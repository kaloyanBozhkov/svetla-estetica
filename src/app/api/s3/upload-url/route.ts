import { NextResponse } from "next/server";
import { z } from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3/s3";
import { BUCKET_NAME, S3Service, type ImageType } from "@/lib/s3/service";
import { requireAdmin } from "@/lib/auth";

const querySchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  imageType: z.enum(["prodotti", "trattamenti"]),
});

export async function GET(request: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const { fileName, fileType, imageType } = querySchema.parse({
      fileName: searchParams.get("fileName"),
      fileType: searchParams.get("fileType"),
      imageType: searchParams.get("imageType"),
    });

    const uniqueFileName = S3Service.generateFileName(fileName);
    const key = S3Service.getImageKey(imageType as ImageType, uniqueFileName);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
      signableHeaders: new Set(["content-type"]),
    });
    const publicUrl = S3Service.getImageUrl(
      imageType as ImageType,
      uniqueFileName
    );

    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Parametri non validi", details: error.errors },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
    }
    console.error("Error generating pre-signed URL:", error);
    return NextResponse.json(
      { error: "Errore nella generazione URL" },
      { status: 500 }
    );
  }
}
