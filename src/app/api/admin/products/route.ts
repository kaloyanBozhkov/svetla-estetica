import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  price: z.number().int().min(0),
  discount_percent: z.number().int().min(0).max(100).default(0),
  stock: z.number().int().min(0),
  priority: z.number().int().min(0).default(0),
  category: z.enum(['viso', 'corpo', 'solari', 'tisane', 'make_up', 'profumi', 'mani_e_piedi']),
  brand_id: z.number().int(),
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
    const data = productSchema.parse(body);

    const product = await db.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        discount_percent: data.discount_percent,
        stock: data.stock,
        priority: data.priority,
        category: data.category,
        brand_id: data.brand_id,
        image_url: data.image_url,
        active: data.active,
      },
    });

    // Revalidate product pages cache
    revalidatePath('/prodotti');
    revalidatePath('/');
    revalidatePath('/admin/prodotti');

    return NextResponse.json({ uuid: product.uuid });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: z.prettifyError(error) }, { status: 400 });
    }
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
