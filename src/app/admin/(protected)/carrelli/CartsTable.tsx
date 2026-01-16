"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Button } from "@/components/atoms";
import { EyeIcon } from "@/components/atoms/icons";
import { formatPrice } from "@/lib/utils";

interface Cart {
  userUuid: string;
  email: string;
  name: string | null;
  itemCount: number;
  total: number;
  updatedAt: Date;
  lastContactedAt: Date | null;
}

interface CartsTableProps {
  carts: Cart[];
  currentPage: number;
  totalPages: number;
}

export function CartsTable({ carts, currentPage, totalPages }: CartsTableProps) {
  const router = useRouter();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}g fa`;
    if (hours > 0) return `${hours}h fa`;
    return "Recente";
  };

  if (carts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">Nessun carrello con prodotti</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prodotti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Totale
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ultimo aggiornamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ultimo contatto
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {carts.map((cart) => (
                <tr
                  key={cart.userUuid}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/admin/carrelli/${cart.userUuid}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {cart.email}
                      </div>
                      {cart.name && (
                        <div className="text-sm text-gray-500">{cart.name}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {cart.itemCount} {cart.itemCount === 1 ? "prodotto" : "prodotti"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatPrice(cart.total)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(cart.updatedAt)}</div>
                    <div className="text-xs text-gray-500">{getTimeAgo(cart.updatedAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {cart.lastContactedAt ? (
                      <>
                        <div className="text-sm text-gray-900">{formatDate(cart.lastContactedAt)}</div>
                        <div className="text-xs text-gray-500">{getTimeAgo(cart.lastContactedAt)}</div>
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">Mai contattato</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link
                      href={`/admin/carrelli/${cart.userUuid}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button size="sm" variant="outline">
                        <EyeIcon className="w-4 h-4 mr-1" />
                        Dettagli
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Pagina {currentPage} di {totalPages}
          </p>
          <div className="flex gap-2">
            <Link href={`/admin/carrelli?page=${currentPage - 1}`}>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
              >
                Precedente
              </Button>
            </Link>
            <Link href={`/admin/carrelli?page=${currentPage + 1}`}>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
              >
                Successivo
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

