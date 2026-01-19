import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { s3Client } from "@/lib/s3/s3";
import { BUCKET_NAME, S3Service } from "@/lib/s3/service";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  price: z.number().int().min(0),
  stock: z.number().int().min(0),
  priority: z.number().int().min(0).default(0),
  category: z.enum([
    "viso",
    "corpo",
    "solari",
    "tisane",
    "make_up",
    "profumi",
    "mani_e_piedi",
  ]),
  brand_id: z.number().int(),
  image_url: z.string().nullable(),
  active: z.boolean(),
});

interface Params {
  params: Promise<{ uuid: string }>;
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { uuid } = await params;
    const body = await req.json();
    const data = productSchema.parse(body);

    const product = await db.product.update({
      where: { uuid },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        priority: data.priority,
        category: data.category,
        brand_id: data.brand_id,
        image_url: data.image_url,
        active: data.active,
      },
    });

    // Revalidate product pages cache
    revalidatePath("/prodotti");
    revalidatePath(`/prodotti/${uuid}`);
    revalidatePath("/");
    revalidatePath("/admin/prodotti");
    revalidatePath(`/admin/prodotti/${uuid}`);

    return NextResponse.json({ uuid: product.uuid });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: z.prettifyError(error) },
        { status: 400 }
      );
    }
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { uuid } = await params;

    // Get product to retrieve image URL before deleting
    const product = await db.product.findUnique({
      where: { uuid },
      select: { image_url: true },
    });

    // Delete product from database
    await db.product.delete({ where: { uuid } });

    // Delete image from S3 if exists
    if (product?.image_url) {
      try {
        const fileName = S3Service.extractFileName(product.image_url);
        const imageType = S3Service.extractImageType(product.image_url);

        if (fileName && imageType) {
          const key = S3Service.getImageKey(imageType, fileName);
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: BUCKET_NAME,
              Key: key,
            })
          );
        }
      } catch (s3Error) {
        console.error("Failed to delete product image from S3:", s3Error);
        // Continue even if S3 delete fails
      }
    }

    // Revalidate product pages cache
    revalidatePath("/prodotti");
    revalidatePath(`/prodotti/${uuid}`);
    revalidatePath("/");
    revalidatePath("/admin/prodotti");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
