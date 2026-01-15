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

