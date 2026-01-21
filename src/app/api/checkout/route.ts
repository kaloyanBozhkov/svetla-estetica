import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { env } from '@/env';
import { SHIPPING_COST } from '@/lib/constants';
import { calculateDiscountedPrice } from '@/lib/utils';
import { z } from 'zod';

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number().min(1),
    })
  ),
});

export async function POST(req: Request) {
  try {
    // Session is optional - guests can checkout too
    const session = await getSession();

    const body = await req.json();
    const { items } = checkoutSchema.parse(body);

    const productIds = items.map((i) => i.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds }, active: true, deleted_at: null },
    });

    if (products.length !== items.length) {
      return NextResponse.json({ error: 'Alcuni prodotti non sono disponibili' }, { status: 400 });
    }

    const lineItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const finalPrice =
        product.discount_percent > 0
          ? calculateDiscountedPrice(product.price, product.discount_percent)
          : product.price;
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name:
              product.discount_percent > 0
                ? `${product.name} (-${product.discount_percent}%)`
                : product.name,
            ...(product.image_url && { images: [product.image_url] }),
          },
          unit_amount: finalPrice,
        },
        quantity: item.quantity,
      };
    });

    // Add shipping as a line item
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Spedizione',
        },
        unit_amount: SHIPPING_COST,
      },
      quantity: 1,
    });

    const subtotal = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const finalPrice =
        product.discount_percent > 0
          ? calculateDiscountedPrice(product.price, product.discount_percent)
          : product.price;
      return sum + finalPrice * item.quantity;
    }, 0);

    const total = subtotal + SHIPPING_COST;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderCreateData: any = {
      subtotal,
      shipping_cost: SHIPPING_COST,
      total,
      status: 'pending',
      payment_status: 'pending',
      items: {
        create: items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          const finalPrice =
            product.discount_percent > 0
              ? calculateDiscountedPrice(product.price, product.discount_percent)
              : product.price;
          return {
            product_id: item.productId,
            quantity: item.quantity,
            price: finalPrice,
            original_price: product.price,
            discount_percent: product.discount_percent,
          };
        }),
      },
    };

    // Connect user if logged in, otherwise guest checkout (user_id will be null)
    if (session?.id) {
      orderCreateData.user = { connect: { id: session.id } };
    }

    const order = await db.order.create({ data: orderCreateData });

    revalidatePath('/admin/ordini');

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${env.NEXT_PUBLIC_BASE_URL}/ordini/${order.uuid}?success=true`,
      cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/carrello?cancelled=true`,
      metadata: {
        order_uuid: order.uuid,
        user_id: session?.id?.toString() ?? '',
        is_guest: session ? 'false' : 'true',
      },
      // If logged in, use their email; otherwise Stripe will collect it
      ...(session?.email ? { customer_email: session.email } : {}),
      shipping_address_collection: {
        allowed_countries: [
          // European Union
          'AT', // Austria
          'BE', // Belgium
          'BG', // Bulgaria
          'HR', // Croatia
          'CY', // Cyprus
          'CZ', // Czech Republic
          'DK', // Denmark
          'EE', // Estonia
          'FI', // Finland
          'FR', // France
          'DE', // Germany
          'GR', // Greece
          'HU', // Hungary
          'IE', // Ireland
          'IT', // Italy
          'LV', // Latvia
          'LT', // Lithuania
          'LU', // Luxembourg
          'MT', // Malta
          'NL', // Netherlands
          'PL', // Poland
          'PT', // Portugal
          'RO', // Romania
          'SK', // Slovakia
          'SI', // Slovenia
          'ES', // Spain
          'SE', // Sweden
          // Other European countries
          'AL', // Albania
          'AD', // Andorra
          'BA', // Bosnia and Herzegovina
          'CH', // Switzerland
          'GB', // United Kingdom
          'IS', // Iceland
          'LI', // Liechtenstein
          'MC', // Monaco
          'ME', // Montenegro
          'MK', // North Macedonia
          'NO', // Norway
          'RS', // Serbia
          'SM', // San Marino
          'UA', // Ukraine
          'VA', // Vatican City
          'XK', // Kosovo
        ],
      },
      phone_number_collection: {
        enabled: true,
      },
    });

    await db.order.update({
      where: { id: order.id },
      data: { external_stripe_payment_intent_id: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
