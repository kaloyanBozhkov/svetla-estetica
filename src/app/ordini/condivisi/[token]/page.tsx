import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Card, Badge } from '@/components/atoms';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { ORDER_STATUS_LABELS } from '@/lib/constants';
import { db } from '@/lib/db';

// Shared links carry customer data — never let them into a search index.
export const metadata: Metadata = {
  title: 'Dettagli ordine',
  robots: { index: false, follow: false, nocache: true },
};

export default async function SharedOrderPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const order = await db.order.findUnique({
    where: { share_token: token },
    include: {
      items: { include: { product: { include: { brand: true } } } },
    },
  });

  if (!order) notFound();

  const statusLabels = ORDER_STATUS_LABELS as Record<string, string>;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
              Ordine #{order.id}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {formatDateTime(order.created_at)}
            </p>
          </div>
          <Badge variant="default" className="text-base px-3 py-1 self-start">
            {statusLabels[order.status] ?? order.status}
          </Badge>
        </div>

        <Card>
          <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
            Prodotti ({order.items.length})
          </h2>
          <div className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  {item.product.image_url ? (
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 line-clamp-2">{item.product.name}</p>
                  <p className="text-sm text-gray-500">{item.product.brand.name}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Qtà: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between items-center text-gray-600">
              <span>Subtotale</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>Spedizione</span>
              <span>{formatPrice(order.shipping_cost)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Totale</span>
              <span className="text-xl font-bold text-primary-600">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </Card>

        {order.shipping_address && (
          <Card>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
              Indirizzo di Spedizione
            </h2>
            <p className="text-gray-600 whitespace-pre-line">{order.shipping_address}</p>
          </Card>
        )}

        {order.notes && (
          <Card>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">Note</h2>
            <p className="text-gray-600">{order.notes}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
