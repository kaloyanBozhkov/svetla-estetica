import { NextResponse } from "next/server";
import { z } from "zod";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3/s3";
import { BUCKET_NAME, S3Service } from "@/lib/s3/service";
import { requireAdmin } from "@/lib/auth";

const bodySchema = z.object({
  imageUrl: z.string().url(),
});

export async function DELETE(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { imageUrl } = bodySchema.parse(body);

    const fileName = S3Service.extractFileName(imageUrl);
    const imageType = S3Service.extractImageType(imageUrl);

    if (!fileName || !imageType) {
      return NextResponse.json(
        { error: "URL immagine non valido" },
        { status: 400 }
      );
    }

    const key = S3Service.getImageKey(imageType, fileName);

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );

    return new NextResponse(null, { status: 204 });
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
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Errore nella cancellazione" },
      { status: 500 }
    );
  }
}
