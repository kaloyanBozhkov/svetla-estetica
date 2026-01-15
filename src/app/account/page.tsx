import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardTitle, Badge } from "@/components/atoms";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { LogoutButton } from "./LogoutButton";

export default async function AccountPage() {
  const user = await getSession();

  if (!user) {
    redirect("/accedi");
  }

  const [orders, bookings] = await Promise.all([
    db.order.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: "desc" },
      take: 5,
    }),
    db.booking.findMany({
      where: { user_id: user.id },
      orderBy: { date: "desc" },
      include: { service: true },
      take: 5,
    }),
  ]);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Il Mio Account
          </h1>
          <LogoutButton />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardTitle className="mb-4">Informazioni</CardTitle>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">Email</dt>
                <dd className="font-medium">{user.email}</dd>
              </div>
              {user.name && (
                <div>
                  <dt className="text-sm text-gray-500">Nome</dt>
                  <dd className="font-medium">{user.name}</dd>
                </div>
              )}
              {user.phone && (
                <div>
                  <dt className="text-sm text-gray-500">Telefono</dt>
                  <dd className="font-medium">{user.phone}</dd>
                </div>
              )}
            </dl>
          </Card>

          <Card>
            <CardTitle className="mb-4">I Miei Ordini</CardTitle>
            {orders.length === 0 ? (
              <p className="text-gray-500">Nessun ordine</p>
            ) : (
              <ul className="space-y-3">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{formatPrice(order.total)}</p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(order.created_at)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        order.status === "delivered"
                          ? "success"
                          : order.status === "cancelled"
                          ? "danger"
                          : "default"
                      }
                    >
                      {order.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="lg:col-span-2">
            <CardTitle className="mb-4">Le Mie Prenotazioni</CardTitle>
            {bookings.length === 0 ? (
              <p className="text-gray-500">Nessuna prenotazione</p>
            ) : (
              <ul className="space-y-3">
                {bookings.map((booking) => (
                  <li
                    key={booking.id}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{booking.service.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(booking.date)} - {booking.duration_min} min
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary-600">
                        {formatPrice(booking.price)}
                      </p>
                      <Badge
                        variant={
                          booking.status === "approved"
                            ? "success"
                            : booking.status === "rejected"
                            ? "danger"
                            : booking.status === "pending"
                            ? "warning"
                            : "default"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

