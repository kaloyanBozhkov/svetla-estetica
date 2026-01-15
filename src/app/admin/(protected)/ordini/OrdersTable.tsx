"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Badge, Button } from "@/components/atoms";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { type order_status, type payment_status } from "@prisma/client";

interface Order {
  id: number;
  uuid: string;
  total: number;
  status: order_status;
  statusLabel: string;
  paymentStatus: payment_status;
  paymentLabel: string;
  createdAt: Date;
  userName: string;
  userEmail: string;
  itemCount: number;
}

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleStatusChange = async (uuid: string, newStatus: order_status) => {
    setLoading(uuid);
    try {
      await fetch(`/api/admin/orders/${uuid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  const getStatusVariant = (status: order_status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "shipped":
        return "info";
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  const getPaymentVariant = (status: payment_status) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "danger";
      default:
        return "default";
    }
  };

  if (orders.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-gray-500">Nessun ordine trovato</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Totale
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Prodotti
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Stato
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Pagamento
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Data
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-mono text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div>{order.userName}</div>
                  <div className="text-xs text-gray-400">{order.userEmail}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {formatPrice(order.total)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.itemCount}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.statusLabel}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getPaymentVariant(order.paymentStatus)}>
                    {order.paymentLabel}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDateTime(new Date(order.createdAt))}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {order.status === "confirmed" && (
                    <Button
                      variant="primary"
                      size="sm"
                      loading={loading === order.uuid}
                      onClick={() => handleStatusChange(order.uuid, "shipped")}
                    >
                      Spedisci
                    </Button>
                  )}
                  {order.status === "shipped" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      loading={loading === order.uuid}
                      onClick={() => handleStatusChange(order.uuid, "delivered")}
                    >
                      Consegnato
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

