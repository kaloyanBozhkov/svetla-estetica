import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { env } from "@/env";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderUuid = session.metadata?.order_uuid;
      const userId = session.metadata?.user_id;

      // Update order with payment intent ID and mark as paid
      if (orderUuid && session.payment_intent) {
        await db.order.updateMany({
          where: { uuid: orderUuid },
          data: {
            external_stripe_payment_intent_id: session.payment_intent as string,
            payment_status: "paid",
            status: "confirmed",
          },
        });
      }

      // Update user name and phone if they are empty
      if (userId) {
        const user = await db.user.findUnique({
          where: { id: parseInt(userId) },
          select: { name: true, phone: true },
        });

        if (user) {
          const updates: { name?: string; phone?: string } = {};

          // Get name from shipping details
          if (!user.name && session.shipping_details?.name) {
            updates.name = session.shipping_details.name;
          }

          // Get phone from customer details
          if (!user.phone && session.customer_details?.phone) {
            updates.phone = session.customer_details.phone;
          }

          if (Object.keys(updates).length > 0) {
            await db.user.update({
              where: { id: parseInt(userId) },
              data: updates,
            });
          }
        }
      }

      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      await db.order.updateMany({
        where: { external_stripe_payment_intent_id: paymentIntent.id },
        data: { payment_status: "paid", status: "confirmed" },
      });

      await db.booking.updateMany({
        where: { external_stripe_payment_intent_id: paymentIntent.id },
        data: { payment_status: "paid" },
      });

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      await db.order.updateMany({
        where: { external_stripe_payment_intent_id: paymentIntent.id },
        data: { payment_status: "failed" },
      });

      await db.booking.updateMany({
        where: { external_stripe_payment_intent_id: paymentIntent.id },
        data: { payment_status: "failed" },
      });

      break;
    }
  }

  return NextResponse.json({ received: true });
}

