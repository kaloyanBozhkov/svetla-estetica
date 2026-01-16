"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/stores";
import { Card, Badge, Button } from "@/components/atoms";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { CheckIcon } from "@/components/atoms/icons";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string | null;
  };
}

interface OrderSuccessProps {
  order: {
    uuid: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    items: OrderItem[];
  };
  isNewOrder: boolean;
}

export function OrderSuccess({ order, isNewOrder }: OrderSuccessProps) {
  const clearCart = useCartStore((s) => s.clearCart);
  const hasCleared = useRef(false);

  useEffect(() => {
    // Clear cart only once when it's a new order
    if (isNewOrder && !hasCleared.current) {
      hasCleared.current = true;
      clearCart();
    }
  }, [isNewOrder, clearCart]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="success">Confermato</Badge>;
      case "processing":
        return <Badge variant="warning">In elaborazione</Badge>;
      case "shipped":
        return <Badge variant="default">Spedito</Badge>;
      case "delivered":
        return <Badge variant="success">Consegnato</Badge>;
      case "cancelled":
        return <Badge variant="danger">Annullato</Badge>;
      default:
        return <Badge variant="default">In attesa</Badge>;
    }
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {isNewOrder && (
          <div className="mb-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900">
              Ordine Completato!
            </h1>
            <p className="mt-2 text-gray-600">
              Grazie per il tuo acquisto. Riceverai una email di conferma.
            </p>
          </div>
        )}

        {!isNewOrder && (
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">
            Dettagli Ordine
          </h1>
        )}

        <Card className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Numero ordine</p>
              <p className="font-mono text-sm">{order.uuid}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data</p>
              <p className="font-medium">{formatDateTime(new Date(order.createdAt))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Stato</p>
              {getStatusBadge(order.status)}
            </div>
          </div>

          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">
            Prodotti
          </h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0"
              >
                <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.imageUrl ? (
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      unoptimized
                      className="object-contain p-1"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <span className="text-2xl">📦</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantità: {item.quantity}
                  </p>
                </div>
                <p className="font-medium text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
            <div className="flex justify-between items-center text-gray-600">
              <span>Subtotale</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>Spedizione</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-100">
              <span>Totale</span>
              <span className="text-primary-600">{formatPrice(order.total)}</span>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 sm:justify-center">
          <Link href="/prodotti" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">Continua lo Shopping</Button>
          </Link>
          <Link href="/account" className="w-full sm:w-auto">
            <Button className="w-full">I Miei Ordini</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

