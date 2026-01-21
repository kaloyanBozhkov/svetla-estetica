import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
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

export async function POST(req: Request) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = serviceSchema.parse(body);

    const service = await db.service.create({
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
    revalidatePath('/');
    revalidatePath('/admin/servizi');

    return NextResponse.json({ uuid: service.uuid });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: z.prettifyError(error) }, { status: 400 });
    }
    console.error('Create service error:', error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
