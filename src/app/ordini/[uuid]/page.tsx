import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderSuccess } from "./OrderSuccess";

interface Props {
  params: Promise<{ uuid: string }>;
  searchParams: Promise<{ success?: string }>;
}

export default async function OrderPage({ params, searchParams }: Props) {
  const { uuid } = await params;
  const { success } = await searchParams;
  const user = await getSession();

  if (!user) {
    redirect("/accedi");
  }

  const order = await db.order.findUnique({
    where: { uuid, user_id: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
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
      isNewOrder={success === "true"}
    />
  );
}

