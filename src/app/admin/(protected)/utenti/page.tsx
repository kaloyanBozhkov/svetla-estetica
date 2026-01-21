import { db } from '@/lib/db';
import { UsersTable } from './UsersTable';
import { Pagination } from '@/components/atoms/Pagination';

const ITEMS_PER_PAGE = 30;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1');
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const [users, totalCount] = await Promise.all([
    db.user.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: {
            orders: true,
            bookings: true,
          },
        },
      },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    db.user.count(),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const usersData = users.map((u) => ({
    id: u.id,
    uuid: u.uuid,
    email: u.email,
    name: u.name,
    phone: u.phone,
    role: u.role,
    emailVerified: u.email_verified,
    createdAt: u.created_at,
    ordersCount: u._count.orders,
    bookingsCount: u._count.bookings,
  }));

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
          Gestione Utenti
        </h1>
        <p className="mt-1 text-gray-500">{totalCount} utenti registrati</p>
      </div>

      <UsersTable users={usersData} />

      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/admin/utenti" />
    </div>
  );
}
