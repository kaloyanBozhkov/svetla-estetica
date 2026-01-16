import { db } from "@/lib/db";
import { UsersTable } from "./UsersTable";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { created_at: "desc" },
    include: {
      _count: {
        select: {
          orders: true,
          bookings: true,
        },
      },
    },
  });

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
        <p className="mt-2 text-gray-600">
          {users.length} utenti registrati
        </p>
      </div>

      <UsersTable users={usersData} />
    </div>
  );
}

