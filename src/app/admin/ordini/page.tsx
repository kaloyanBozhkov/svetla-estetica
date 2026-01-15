import { db } from "@/lib/db";
import { OrdersTable } from "./OrdersTable";
import { type order_status, type payment_status } from "@prisma/client";

const statusLabels: Record<order_status, string> = {
  pending: "In Attesa",
  confirmed: "Confermato",
  shipped: "Spedito",
  delivered: "Consegnato",
  cancelled: "Annullato",
};

const paymentLabels: Record<payment_status, string> = {
  pending: "In Attesa",
  paid: "Pagato",
  failed: "Fallito",
  refunded: "Rimborsato",
};

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { created_at: "desc" },
    include: {
      user: true,
      items: { include: { product: true } },
    },
  });

  const ordersWithLabels = orders.map((o) => ({
    id: o.id,
    uuid: o.uuid,
    total: o.total,
    status: o.status,
    statusLabel: statusLabels[o.status],
    paymentStatus: o.payment_status,
    paymentLabel: paymentLabels[o.payment_status],
    createdAt: o.created_at,
    userName: o.user.name ?? o.user.email,
    userEmail: o.user.email,
    itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
  }));

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">
        Gestione Ordini
      </h1>

      <OrdersTable orders={ordersWithLabels} />
    </div>
  );
}

