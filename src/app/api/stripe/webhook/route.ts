import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { env } from "@/env";
import { resend } from "@/lib/email";
import { sendCelebration, sendErrorLog } from "@/lib/alerts";
import type Stripe from "stripe";

const ADMIN_EMAIL = "rosacosmetica@gmail.com";

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
      const eventSession = event.data.object as Stripe.Checkout.Session;

      // Retrieve full session with expanded fields
      const session = await stripe.checkout.sessions.retrieve(eventSession.id, {
        expand: ["customer_details", "shipping_details"],
      });

      const orderUuid = session.metadata?.order_uuid;
      const userId = session.metadata?.user_id;

      // Update order with payment intent ID and mark as paid
      if (orderUuid && session.payment_intent) {
        const order = await db.order.findUnique({
          where: { uuid: orderUuid },
          include: { items: true },
        });

        await db.order.updateMany({
          where: { uuid: orderUuid },
          data: {
            external_stripe_payment_intent_id: session.payment_intent as string,
            payment_status: "paid",
            status: "confirmed",
          },
        });

        // Celebrate the sale and notify admin
        if (order) {
          const totalFormatted = new Intl.NumberFormat("it-IT", {
            style: "currency",
            currency: "EUR",
          }).format(order.total / 100);

          await sendCelebration({
            event: "Nuovo Ordine",
            total: totalFormatted,
            items: `${order.items.length} prodotti`,
            customer: session.customer_details?.email || "N/A",
          });

          // Send email notification to admin
          try {
            const customerName = session.shipping_details?.name || session.customer_details?.name || "Cliente";
            const customerEmail = session.customer_details?.email || "N/A";
            
            await resend.emails.send({
              from: "Svetla Estetica <noreply@svetlaestetica.com>",
              to: ADMIN_EMAIL,
              subject: "Ordine | SvetlaEstetica",
              html: `
                <h2>Nuovo Ordine Ricevuto!</h2>
                <p><strong>Ordine #${order.id}</strong></p>
                <p><strong>Cliente:</strong> ${customerName} (${customerEmail})</p>
                <p><strong>Totale:</strong> ${totalFormatted}</p>
                <p><strong>Prodotti:</strong> ${order.items.length}</p>
                <p><a href="https://svetlaestetica.com/admin/ordini/${orderUuid}">Visualizza ordine nel pannello admin</a></p>
              `,
            });
          } catch (emailError) {
            console.error("Failed to send admin order notification:", emailError);
          }
        }
      }

      // Update user name and phone if they are empty
      if (userId) {
        const user = await db.user.findUnique({
          where: { id: parseInt(userId) },
          select: { name: true, phone: true },
        });

        if (user) {
          const updates: { name?: string; phone?: string } = {};

          // Get name from shipping or customer details
          if (!user.name) {
            const name =
              session.shipping_details?.name || session.customer_details?.name;
            if (name) updates.name = name;
          }

          // Get phone from shipping or customer details
          if (!user.phone) {
            const phone =
              session.shipping_details?.phone ||
              session.customer_details?.phone;
            if (phone) updates.phone = phone;
          }

          if (Object.keys(updates).length > 0) {
            console.log("Updating user with:", updates);
            await db.user.update({
              where: { id: parseInt(userId) },
              data: updates,
            });
          }
        }

        // Clear cart reminder timestamp on order completion
        await db.user.update({
          where: { id: parseInt(userId) },
          data: { last_cart_reminder_at: null },
        });
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

      // Alert about payment failure
      await sendErrorLog({
        event: "Payment Failed",
        payment_intent: paymentIntent.id,
        reason: paymentIntent.last_payment_error?.message || "Unknown",
      });

      break;
    }
  }

  return NextResponse.json({ received: true });
}
