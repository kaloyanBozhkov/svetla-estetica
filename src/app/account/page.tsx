import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardTitle, Badge } from "@/components/atoms";
import { formatPrice, formatDateTime, translateOrderStatus, translateBookingStatus } from "@/lib/utils";
import { LogoutButton } from "./LogoutButton";
import { ProfileForm } from "./ProfileForm";

export default async function AccountPage() {
  const user = await getSession();

  if (!user) {
    redirect("/accedi");
  }

  const [orders, bookings] = await Promise.all([
    db.order.findMany({
      where: {
        user_id: user.id,
      },
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
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900">
              {user.name ? `Ciao, ${user.name}!` : "Il Mio Account"}
            </h1>
            {user.name && <p className="text-gray-500 mt-1">{user.email}</p>}
          </div>
          <LogoutButton />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardTitle className="mb-4">Informazioni</CardTitle>
            <div className="space-y-3 mb-6">
              {user.name && (
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <p className="text-sm text-gray-500">Telefono</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              )}
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-500 mb-3">
                Modifica informazioni
              </p>
              <ProfileForm initialPhone={user.phone} initialName={user.name} />
            </div>
          </Card>

          <Card>
            <CardTitle className="mb-4">I Miei Ordini</CardTitle>
            {orders.length === 0 ? (
              <p className="text-gray-500">Nessun ordine</p>
            ) : (
              <ul className="space-y-3">
                {orders.map((order) => (
                  <li key={order.id}>
                    <Link
                      href={`/ordini/${order.uuid}`}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                    >
                      <div>
                        <p className="font-medium">{formatPrice(order.total)}</p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "success"
                              : order.status === "cancelled"
                              ? "danger"
                              : "default"
                          }
                        >
                          {translateOrderStatus(order.status)}
                        </Badge>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
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
                        {formatDateTime(booking.date)} - {booking.duration_min}{" "}
                        min
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
                        {translateBookingStatus(booking.status)}
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
