import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { db } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { s3Client } from '@/lib/s3/s3';
import { BUCKET_NAME, S3Service } from '@/lib/s3/service';
import { z } from 'zod';

const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  price: z.number().int().min(0),
  duration_min: z.number().int().min(5),
  priority: z.number().int().min(0).default(0),
  category: z.enum([
    'viso',
    'corpo',
    'make_up',
    'ceretta',
    'solarium',
    'pedicure',
    'manicure',
    'luce_pulsata',
    'appuntamento',
    'grotta_di_sale',
  ]),
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { uuid } = await params;
    const body = await req.json();
    const data = serviceSchema.parse(body);

    const service = await db.service.update({
      where: { uuid },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration_min: data.duration_min,
        priority: data.priority,
        category: data.category,
        image_url: data.image_url,
        active: data.active,
      },
    });

    // Revalidate service pages cache
    revalidatePath('/trattamenti');
    revalidatePath(`/trattamenti/${uuid}`);
    revalidatePath('/');
    revalidatePath('/admin/servizi');
    revalidatePath(`/admin/servizi/${uuid}`);

    return NextResponse.json({ uuid: service.uuid });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: z.prettifyError(error) }, { status: 400 });
    }
    console.error('Update service error:', error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { uuid } = await params;

    // Get service to check if it has booking references
    const service = await db.service.findUnique({
      where: { uuid },
      select: { image_url: true, bookings: { take: 1 } },
    });

    if (!service) {
      return NextResponse.json({ error: 'Servizio non trovato' }, { status: 404 });
    }

    // If service has booking references, soft delete instead
    if (service.bookings.length > 0) {
      await db.service.update({
        where: { uuid },
        data: { deleted_at: new Date(), active: false },
      });
    } else {
      // No booking references, safe to hard delete
      await db.service.delete({ where: { uuid } });

      // Delete image from S3 if exists (only on hard delete)
      if (service.image_url) {
        try {
          const fileName = S3Service.extractFileName(service.image_url);
          const imageType = S3Service.extractImageType(service.image_url);

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
          console.error('Failed to delete service image from S3:', s3Error);
        }
      }
    }

    // Revalidate service pages cache
    revalidatePath('/trattamenti');
    revalidatePath(`/trattamenti/${uuid}`);
    revalidatePath('/');
    revalidatePath('/admin/servizi');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
