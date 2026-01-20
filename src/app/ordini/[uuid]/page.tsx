import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderSuccess } from "./OrderSuccess";
import { env } from "@/env";

interface Props {
  params: Promise<{ uuid: string }>;
  searchParams: Promise<{ success?: string }>;
}

// Helper to wait for webhook to process and create user
async function getOrderWithRetry(uuid: string, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    const order = await db.order.findUnique({
      where: { uuid },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    // If order has user or it's not a new order, return it
    if (order?.user || order?.payment_status === "paid") {
      return order;
    }

    // Wait before retrying (increasing delay)
    if (order && i < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    } else {
      return order;
    }
  }
  return null;
}

export default async function OrderPage({ params, searchParams }: Props) {
  const { uuid } = await params;
  const { success } = await searchParams;
  const isNewOrder = success === "true";
  const user = await getSession();

  // Find the order by UUID, with retry for webhook processing
  const order = isNewOrder
    ? await getOrderWithRetry(uuid)
    : await db.order.findUnique({
        where: { uuid },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

  if (!order) {
    notFound();
  }

  // If this is a new order (just completed checkout) and user is not logged in
  // but the order has a user, redirect to auto-sign-in API route
  if (isNewOrder && !user && order.user) {
    const token = Buffer.from(`${order.uuid}:${order.user.id}`).toString(
      "base64"
    );
    redirect(
      `${env.NEXT_PUBLIC_BASE_URL}/api/auth/auto-sign-in?order=${order.uuid}&token=${token}`
    );
  }

  // Security check: only the order owner can view the order
  // For new orders (from checkout redirect), we allow viewing even without user
  if (!isNewOrder && (!user || order.user_id !== user.id)) {
    redirect("/accedi");
  }

  return (
    <OrderSuccess
      order={{
        uuid: order.uuid,
        subtotal: order.subtotal,
        shippingCost: order.shipping_cost,
        total: order.total,
        status: order.status,
        paymentStatus: order.payment_status,
        createdAt: order.created_at.toISOString(),
        items: order.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          originalPrice: item.original_price,
          discountPercent: item.discount_percent,
          product: {
            name: item.product.name,
            imageUrl: item.product.image_url,
          },
        })),
      }}
      isNewOrder={isNewOrder}
    />
  );
}
