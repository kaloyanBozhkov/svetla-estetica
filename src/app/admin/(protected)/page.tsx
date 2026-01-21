import { db } from '@/lib/db';
import { Card, CardTitle, CardContent } from '@/components/atoms';
import {
  CartIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyIcon,
  PackageIcon,
  SparkleIcon,
} from '@/components/atoms/icons';
import { formatPrice } from '@/lib/utils';
import { type ComponentType } from 'react';

export default async function AdminDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    ordersToday,
    bookingsToday,
    pendingBookings,
    monthlyRevenue,
    totalProducts,
    totalServices,
  ] = await Promise.all([
    db.order.count({
      where: { created_at: { gte: today } },
    }),
    db.booking.count({
      where: { created_at: { gte: today } },
    }),
    db.booking.count({
      where: { status: 'pending' },
    }),
    db.order.aggregate({
      _sum: { total: true },
      where: {
        payment_status: 'paid',
        created_at: {
          gte: new Date(today.getFullYear(), today.getMonth(), 1),
        },
      },
    }),
    db.product.count({ where: { active: true } }),
    db.service.count({ where: { active: true } }),
  ]);

  const stats: {
    label: string;
    value: string | number;
    Icon: ComponentType<{ className?: string }>;
  }[] = [
    { label: 'Ordini Oggi', value: ordersToday, Icon: CartIcon },
    { label: 'Prenotazioni Oggi', value: bookingsToday, Icon: CalendarIcon },
    { label: 'Prenotazioni in Attesa', value: pendingBookings, Icon: ClockIcon },
    {
      label: 'Ricavo Mensile',
      value: formatPrice(monthlyRevenue._sum.total ?? 0),
      Icon: CurrencyIcon,
    },
    { label: 'Prodotti Attivi', value: totalProducts, Icon: PackageIcon },
    { label: 'Servizi Attivi', value: totalServices, Icon: SparkleIcon },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
                <stat.Icon className="w-6 h-6" />
              </div>
              <div>
                <CardContent className="text-sm text-gray-500">{stat.label}</CardContent>
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardTitle className="mb-4">Ultime Prenotazioni</CardTitle>
          <RecentBookings />
        </Card>

        <Card>
          <CardTitle className="mb-4">Ultimi Ordini</CardTitle>
          <RecentOrders />
        </Card>
      </div>
    </div>
  );
}

async function RecentBookings() {
  const bookings = await db.booking.findMany({
    take: 5,
    orderBy: { created_at: 'desc' },
    include: { user: true, service: true },
  });

  if (bookings.length === 0) {
    return <p className="text-gray-500">Nessuna prenotazione</p>;
  }

  return (
    <ul className="space-y-3">
      {bookings.map((booking) => (
        <li
          key={booking.id}
          className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
        >
          <div>
            <p className="font-medium">{booking.service.name}</p>
            <p className="text-sm text-gray-500">{booking.user.email}</p>
          </div>
          <span
            className={`text-sm px-2 py-1 rounded ${
              booking.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : booking.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
            }`}
          >
            {booking.status}
          </span>
        </li>
      ))}
    </ul>
  );
}

async function RecentOrders() {
  const orders = await db.order.findMany({
    take: 5,
    orderBy: { created_at: 'desc' },
    include: { user: true },
  });

  if (orders.length === 0) {
    return <p className="text-gray-500">Nessun ordine</p>;
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <li
          key={order.id}
          className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
        >
          <div>
            <p className="font-medium">{formatPrice(order.total)}</p>
            <p className="text-sm text-gray-500">{order.user?.email ?? 'Ospite'}</p>
          </div>
          <span
            className={`text-sm px-2 py-1 rounded ${
              order.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : order.status === 'confirmed'
                  ? 'bg-blue-100 text-blue-800'
                  : order.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
            }`}
          >
            {order.status}
          </span>
        </li>
      ))}
    </ul>
  );
}
