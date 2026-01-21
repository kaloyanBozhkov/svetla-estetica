import { db } from '@/lib/db';
import { BookingsTable } from './BookingsTable';
import { type booking_status } from '@prisma/client';
import { Pagination } from '@/components/atoms/Pagination';
import { BOOKING_STATUS_LABELS } from '@/lib/constants';

const ITEMS_PER_PAGE = 30;

const statusLabels = BOOKING_STATUS_LABELS as Record<booking_status, string>;

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1');
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const [bookings, totalCount] = await Promise.all([
    db.booking.findMany({
      orderBy: { created_at: 'desc' },
      include: { user: true, service: true },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    db.booking.count(),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const bookingsWithLabels = bookings.map((b) => ({
    id: b.id,
    uuid: b.uuid,
    date: b.date,
    durationMin: b.duration_min,
    price: b.price,
    status: b.status,
    statusLabel: statusLabels[b.status],
    userName: b.user.name ?? b.user.email,
    userEmail: b.user.email,
    serviceName: b.service.name,
  }));

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
          Gestione Prenotazioni
        </h1>
        <p className="mt-1 text-gray-500">{totalCount} prenotazioni totali</p>
      </div>

      <BookingsTable bookings={bookingsWithLabels} />

      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/admin/prenotazioni" />
    </div>
  );
}
