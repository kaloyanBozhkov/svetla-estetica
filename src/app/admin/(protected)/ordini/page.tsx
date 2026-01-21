import { db } from '@/lib/db';
import { OrdersTable } from './OrdersTable';
import { type order_status, type payment_status } from '@prisma/client';
import { Pagination } from '@/components/atoms/Pagination';

const ITEMS_PER_PAGE = 30;

const statusLabels: Record<order_status, string> = {
  pending: 'In Attesa',
  confirmed: 'Confermato',
  shipped: 'Spedito',
  delivered: 'Consegnato',
  cancelled: 'Annullato',
};

const paymentLabels: Record<payment_status, string> = {
  pending: 'In Attesa',
  paid: 'Pagato',
  failed: 'Fallito',
  refunded: 'Rimborsato',
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1');
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const [orders, totalCount] = await Promise.all([
    db.order.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        user: true,
        items: { include: { product: true } },
      },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    db.order.count(),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const ordersWithLabels = orders.map((o) => ({
    id: o.id,
    uuid: o.uuid,
    total: o.total,
    status: o.status,
    statusLabel: statusLabels[o.status],
    paymentStatus: o.payment_status,
    paymentLabel: paymentLabels[o.payment_status],
    createdAt: o.created_at,
    userName: o.user?.name ?? o.user?.email ?? 'Ospite',
    userEmail: o.user?.email ?? '-',
    itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
  }));

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
          Gestione Ordini
        </h1>
        <p className="mt-1 text-gray-500">{totalCount} ordini totali</p>
      </div>

      <OrdersTable orders={ordersWithLabels} />

      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/admin/ordini" />
    </div>
  );
}
