import { db } from '@/lib/db';
import { CartsTable } from './CartsTable';

const ITEMS_PER_PAGE = 20;

async function getCarts(page: number) {
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const usersWithCarts = await db.user.findMany({
    where: {
      cart_items: {
        some: {},
      },
    },
    select: {
      id: true,
      uuid: true,
      email: true,
      name: true,
      last_cart_reminder_at: true,
      cart_items: {
        include: {
          product: {
            select: {
              price: true,
            },
          },
        },
        orderBy: {
          updated_at: 'desc',
        },
      },
    },
    orderBy: {
      updated_at: 'desc',
    },
    skip,
    take: ITEMS_PER_PAGE,
  });

  const totalCount = await db.user.count({
    where: {
      cart_items: {
        some: {},
      },
    },
  });

  const carts = usersWithCarts.map((user) => {
    const itemCount = user.cart_items.reduce((sum, item) => sum + item.quantity, 0);
    const total = user.cart_items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const latestUpdate = user.cart_items.length > 0 ? user.cart_items[0].updated_at : new Date();

    return {
      userUuid: user.uuid,
      email: user.email,
      name: user.name,
      itemCount,
      total,
      updatedAt: latestUpdate,
      lastContactedAt: user.last_cart_reminder_at,
    };
  });

  // Sort by latest cart item update
  carts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return {
    carts,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    totalCount,
  };
}

export default async function AdminCartsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1');
  const { carts, totalPages, totalCount } = await getCarts(page);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">Carrelli</h1>
          <p className="mt-1 text-gray-500">{totalCount} carrelli con prodotti</p>
        </div>
      </div>

      <CartsTable carts={carts} currentPage={page} totalPages={totalPages} />
    </div>
  );
}
