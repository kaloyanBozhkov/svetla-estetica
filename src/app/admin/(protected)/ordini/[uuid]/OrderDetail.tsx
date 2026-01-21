"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Badge, Button, Select } from "@/components/atoms";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { type order_status, type payment_status } from "@prisma/client";
import { ArrowLeftIcon, MailIcon } from "@/components/atoms/icons";

interface OrderDetailProps {
  order: {
    id: number;
    uuid: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    status: order_status;
    paymentStatus: payment_status;
    shippingAddress: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
      name: string | null;
      email: string;
      phone: string | null;
    } | null;
    items: {
      id: number;
      quantity: number;
      price: number;
      originalPrice?: number;
      discountPercent?: number;
      product: {
        uuid: string;
        name: string;
        imageUrl: string | null;
        brand: string;
      };
    }[];
  };
}

const statusOptions = [
  { value: "pending", label: "In Attesa" },
  { value: "confirmed", label: "Confermato" },
  { value: "shipped", label: "Spedito" },
  { value: "delivered", label: "Consegnato" },
  { value: "cancelled", label: "Annullato" },
];

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

export function OrderDetail({ order }: OrderDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState<order_status>(order.status);
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (status === order.status) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.uuid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setUpdating(false);
    }
  };

  const getStatusVariant = (s: order_status) => {
    switch (s) {
      case "pending":
        return "warning";
      case "confirmed":
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

  const getPaymentVariant = (s: payment_status) => {
    switch (s) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/ordini">
          <Button variant="ghost" size="sm">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Torna agli ordini
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Ordine #{order.id}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            UUID: {order.uuid}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(order.status)} className="text-base px-3 py-1">
            {statusLabels[order.status]}
          </Badge>
          <Badge variant={getPaymentVariant(order.paymentStatus)} className="text-base px-3 py-1">
            {paymentLabels[order.paymentStatus]}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <Card>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
              Prodotti ({order.items.length})
            </h2>
            <div className="divide-y divide-gray-200">
              {order.items.map((item) => {
                const hasDiscount = Boolean(item.discountPercent && item.discountPercent > 0 && item.originalPrice);
                return (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-contain p-2"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/prodotti/${item.product.uuid}`}
                        className="font-medium text-gray-900 hover:text-primary-600 line-clamp-2"
                        target="_blank"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500">{item.product.brand}</p>
                      <div className="mt-1 flex items-center gap-4 text-sm">
                        <span className="text-gray-600">Qtà: {item.quantity}</span>
                        {hasDiscount && item.originalPrice ? (
                          <span className="flex items-center gap-2">
                            <span className="text-gray-400 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
                              -{item.discountPercent}%
                            </span>
                            <span className="font-medium text-red-600">
                              {formatPrice(item.price)} cad.
                            </span>
                          </span>
                        ) : (
                          <span className="font-medium text-gray-900">
                            {formatPrice(item.price)} cad.
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${hasDiscount ? "text-red-600" : "text-gray-900"}`}>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between items-center text-gray-600">
                <span>Subtotale</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Spedizione</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Totale</span>
                <span className="text-xl font-bold text-primary-600">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </Card>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                Indirizzo di Spedizione
              </h2>
              <p className="text-gray-600 whitespace-pre-line">{order.shippingAddress}</p>
            </Card>
          )}

          {/* Notes */}
          {order.notes && (
            <Card>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                Note
              </h2>
              <p className="text-gray-600">{order.notes}</p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
              Cliente
            </h2>
            {order.user ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="font-medium text-gray-900">{order.user.name || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${order.user.email}`} className="font-medium text-primary-600 hover:underline">
                    {order.user.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefono</p>
                  <p className="font-medium text-gray-900">{order.user.phone || "—"}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">Ordine ospite (utente non registrato)</p>
            )}
          </Card>

          {/* Order Info */}
          <Card>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
              Dettagli Ordine
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Data Creazione</p>
                <p className="font-medium text-gray-900">{formatDateTime(new Date(order.createdAt))}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ultimo Aggiornamento</p>
                <p className="font-medium text-gray-900">{formatDateTime(new Date(order.updatedAt))}</p>
              </div>
            </div>
          </Card>

          {/* Status Update */}
          <Card>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
              Aggiorna Stato
            </h2>
            <div className="space-y-4">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as order_status)}
                options={statusOptions}
              />
              <Button
                variant="primary"
                onClick={handleStatusUpdate}
                loading={updating}
                disabled={status === order.status || updating}
                className="w-full"
              >
                Salva
              </Button>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MailIcon className="w-3 h-3" />
                Email inviata automaticamente al cliente
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
