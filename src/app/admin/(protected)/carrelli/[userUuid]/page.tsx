import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { CartDetail } from './CartDetail';

async function getCartDetails(userUuid: string) {
  const user = await db.user.findUnique({
    where: { uuid: userUuid },
    select: {
      id: true,
      uuid: true,
      email: true,
      name: true,
      phone: true,
      created_at: true,
      last_cart_reminder_at: true,
      cart_items: {
        include: {
          product: {
            select: {
              id: true,
              uuid: true,
              name: true,
              price: true,
              stock: true,
              image_url: true,
              active: true,
            },
          },
        },
        orderBy: {
          updated_at: 'desc',
        },
      },
    },
  });

  if (!user) return null;

  return {
    user: {
      uuid: user.uuid,
      email: user.email,
      name: user.name,
      phone: user.phone,
      createdAt: user.created_at,
      lastContactedAt: user.last_cart_reminder_at,
    },
    items: user.cart_items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      updatedAt: item.updated_at,
      product: {
        uuid: item.product.uuid,
        name: item.product.name,
        price: item.product.price,
        stock: item.product.stock,
        imageUrl: item.product.image_url,
        active: item.product.active,
      },
    })),
    total: user.cart_items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    itemCount: user.cart_items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export default async function AdminCartDetailPage({
  params,
}: {
  params: Promise<{ userUuid: string }>;
}) {
  const { userUuid } = await params;
  const data = await getCartDetails(userUuid);

  if (!data) {
    notFound();
  }

  return <CartDetail data={data} />;
}
