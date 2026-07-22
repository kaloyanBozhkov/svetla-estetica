/**
 * Backfill script: populate `order.shipping_address` for orders paid before the
 * Stripe webhook started persisting the shipping details collected at checkout.
 *
 * The address was never stored locally, but it still lives on Stripe: first on
 * the PaymentIntent (`shipping`), and otherwise on the Checkout Session
 * (`shipping_details` / `customer_details`).
 *
 * Dry run: pnpm tsx scripts/backfill-shipping-addresses.ts
 * Write:   pnpm tsx scripts/backfill-shipping-addresses.ts --apply
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { formatShippingAddress } from '../src/lib/utils/format';

const db = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const APPLY = process.argv.includes('--apply');

async function resolveAddress(stripeId: string) {
  // `external_stripe_payment_intent_id` holds the Checkout Session id until the
  // webhook overwrites it with the real PaymentIntent id, so both shapes occur.
  if (!stripeId.startsWith('cs_')) {
    const paymentIntent = await stripe.paymentIntents.retrieve(stripeId);

    if (paymentIntent.shipping?.address) {
      return formatShippingAddress({
        name: paymentIntent.shipping.name,
        phone: paymentIntent.shipping.phone,
        line1: paymentIntent.shipping.address.line1,
        line2: paymentIntent.shipping.address.line2,
        postalCode: paymentIntent.shipping.address.postal_code,
        city: paymentIntent.shipping.address.city,
        state: paymentIntent.shipping.address.state,
        country: paymentIntent.shipping.address.country,
      });
    }
  }

  const session = stripeId.startsWith('cs_')
    ? await stripe.checkout.sessions.retrieve(stripeId)
    : (await stripe.checkout.sessions.list({ payment_intent: stripeId, limit: 1 })).data[0];

  if (!session) return null;

  return formatShippingAddress({
    name: session.shipping_details?.name || session.customer_details?.name,
    phone: session.shipping_details?.phone || session.customer_details?.phone,
    line1: session.shipping_details?.address?.line1,
    line2: session.shipping_details?.address?.line2,
    postalCode: session.shipping_details?.address?.postal_code,
    city: session.shipping_details?.address?.city,
    state: session.shipping_details?.address?.state,
    country: session.shipping_details?.address?.country,
  });
}

async function main() {
  const orders = await db.order.findMany({
    where: {
      shipping_address: null,
      external_stripe_payment_intent_id: { not: null },
    },
    select: {
      id: true,
      uuid: true,
      external_stripe_payment_intent_id: true,
      payment_status: true,
    },
    orderBy: { id: 'asc' },
  });

  console.log(
    `${orders.length} ordini senza indirizzo${APPLY ? '' : ' (dry run — usa --apply per scrivere)'}\n`
  );

  let filled = 0;
  for (const order of orders) {
    let address: string | null = null;
    try {
      address = await resolveAddress(order.external_stripe_payment_intent_id!);
    } catch (error) {
      console.error(`Ordine #${order.id}: errore Stripe —`, error);
      continue;
    }

    if (!address) {
      console.log(`Ordine #${order.id}: nessun indirizzo su Stripe, saltato\n`);
      continue;
    }

    console.log(
      `Ordine #${order.id} (${order.payment_status}):\n${address.replace(/^/gm, '  ')}\n`
    );

    if (APPLY) {
      await db.order.update({ where: { id: order.id }, data: { shipping_address: address } });
      filled++;
    }
  }

  console.log(APPLY ? `Aggiornati ${filled} ordini.` : 'Dry run completato, nessuna modifica.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
