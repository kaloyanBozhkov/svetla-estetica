import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { OrderDetail } from "./OrderDetail";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  const order = await db.order.findUnique({
    where: { uuid },
    include: {
      user: true,
      items: {
        include: {
          product: {
            include: { brand: true },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <OrderDetail
      order={{
        id: order.id,
        uuid: order.uuid,
        subtotal: order.subtotal,
        shippingCost: order.shipping_cost,
        total: order.total,
        status: order.status,
        paymentStatus: order.payment_status,
        shippingAddress: order.shipping_address,
        notes: order.notes,
        createdAt: order.created_at.toISOString(),
        updatedAt: order.updated_at.toISOString(),
        user: {
          name: order.user.name,
          email: order.user.email,
          phone: order.user.phone,
        },
        items: order.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          product: {
            uuid: item.product.uuid,
            name: item.product.name,
            imageUrl: item.product.image_url,
            brand: item.product.brand.name,
          },
        })),
      }}
    />
  );
}

