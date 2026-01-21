import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { calculateDiscountedPrice } from '@/lib/utils';

const validateCartSchema = z.object({
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number(),
    })
  ),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = validateCartSchema.parse(body);

    if (items.length === 0) {
      return NextResponse.json({ items: [], removed: [] });
    }

    const productIds = items.map((i) => i.productId);

    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        uuid: true,
        name: true,
        price: true,
        discount_percent: true,
        stock: true,
        active: true,
        image_url: true,
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    const validatedItems = [];
    const removedItems = [];

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product || !product.active) {
        // Product no longer exists or is inactive
        removedItems.push({
          product_id: item.productId,
          reason: 'deleted',
        });
        continue;
      }

      // Cap quantity to available stock
      const quantity = product.stock > 0 ? Math.min(item.quantity, product.stock) : item.quantity;

      // Calculate final price with discount
      const finalPrice =
        product.discount_percent > 0
          ? calculateDiscountedPrice(product.price, product.discount_percent)
          : product.price;

      validatedItems.push({
        product_id: product.id,
        product_uuid: product.uuid,
        name: product.name,
        price: finalPrice,
        original_price: product.price,
        discount_percent: product.discount_percent,
        stock: product.stock,
        image_url: product.image_url,
        quantity,
        quantity_adjusted: quantity !== item.quantity,
        out_of_stock: product.stock <= 0,
      });
    }

    return NextResponse.json({
      items: validatedItems,
      removed: removedItems,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
    console.error('Cart validation error:', error);
    return NextResponse.json({ error: 'Failed to validate cart' }, { status: 500 });
  }
}
