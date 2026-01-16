import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { env } from "@/env";
import { z } from "zod";

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
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const body = await req.json();
    const { items } = checkoutSchema.parse(body);

    const productIds = items.map((i) => i.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds }, active: true },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "Alcuni prodotti non sono disponibili" },
        { status: 400 }
      );
    }

    const lineItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            ...(product.image_url && { images: [product.image_url] }),
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      };
    });

    const total = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);

    const order = await db.order.create({
      data: {
        user_id: session.userId,
        total,
        status: "pending",
        payment_status: "pending",
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              product_id: item.productId,
              quantity: item.quantity,
              price: product.price,
            };
          }),
        },
      },
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${env.BASE_URL}/ordini/${order.uuid}?success=true`,
      cancel_url: `${env.BASE_URL}/carrello?cancelled=true`,
      metadata: {
        order_uuid: order.uuid,
      },
      customer_email: session.email,
    });

    await db.order.update({
      where: { id: order.id },
      data: { external_stripe_payment_intent_id: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}

