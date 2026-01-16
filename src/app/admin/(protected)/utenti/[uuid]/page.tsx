import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, Badge } from "@/components/atoms";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface Props {
  params: Promise<{ uuid: string }>;
}

export default async function UserDetailPage({ params }: Props) {
  const { uuid } = await params;

  const user = await db.user.findUnique({
    where: { uuid },
    include: {
      orders: {
        orderBy: { created_at: "desc" },
        include: {
          items: {
            include: { product: true },
          },
        },
      },
      bookings: {
        orderBy: { created_at: "desc" },
        include: { service: true },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/utenti"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Torna agli utenti
        </Link>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-2">
          Dettagli Utente
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* User Info */}
        <Card>
          <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
            Informazioni
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-500">Nome</dt>
              <dd className="text-gray-900 font-medium">{user.name || "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Telefono</dt>
              <dd className="text-gray-900">{user.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Ruolo</dt>
              <dd>
                <Badge variant={user.role === "admin" ? "warning" : "default"}>
                  {user.role === "admin" ? "Admin" : "Cliente"}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Email verificata</dt>
              <dd>
                <Badge variant={user.email_verified ? "success" : "default"}>
                  {user.email_verified ? "Sì" : "No"}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Registrato il</dt>
              <dd className="text-gray-900">{formatDate(user.created_at)}</dd>
            </div>
          </dl>
        </Card>

        {/* Orders */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
              Ordini ({user.orders.length})
            </h2>
            {user.orders.length === 0 ? (
              <p className="text-gray-500">Nessun ordine</p>
            ) : (
              <div className="space-y-4">
                {user.orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          Ordine #{order.id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600">
                          {formatPrice(order.total)}
                        </p>
                        <span
                          className={`inline-block mt-1 text-xs px-2 py-1 rounded ${
                            statusColors[order.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <span>
                            {item.quantity}x {item.product.name}
                          </span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
              Prenotazioni ({user.bookings.length})
            </h2>
            {user.bookings.length === 0 ? (
              <p className="text-gray-500">Nessuna prenotazione</p>
            ) : (
              <div className="space-y-4">
                {user.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.service.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(booking.date)} • {booking.duration_min} min
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600">
                          {formatPrice(booking.price)}
                        </p>
                        <span
                          className={`inline-block mt-1 text-xs px-2 py-1 rounded ${
                            statusColors[booking.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

