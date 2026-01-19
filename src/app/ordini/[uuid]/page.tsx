import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderSuccess } from "./OrderSuccess";
import { createSessionForUser } from "@/lib/auth/session";

interface Props {
  params: Promise<{ uuid: string }>;
  searchParams: Promise<{ success?: string }>;
}

export default async function OrderPage({ params, searchParams }: Props) {
  const { uuid } = await params;
  const { success } = await searchParams;
  const isNewOrder = success === "true";

  let user = await getSession();

  // First, find the order by UUID
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

  if (!order) {
    notFound();
  }

  // If this is a new order (just completed checkout) and user is not logged in
  // but the order has a user, auto-sign them in
  if (isNewOrder && !user && order.user) {
    const cookieStore = await cookies();
    const sessionCookie = await createSessionForUser(order.user.id);
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
    user = order.user;
  }

  // Security check: only the order owner can view the order
  // For new orders (from checkout redirect), we allow viewing
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

