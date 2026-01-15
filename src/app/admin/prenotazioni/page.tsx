import { db } from "@/lib/db";
import { BookingsTable } from "./BookingsTable";
import { type booking_status } from "@prisma/client";

const statusLabels: Record<booking_status, string> = {
  pending: "In Attesa",
  approved: "Approvato",
  rejected: "Rifiutato",
  completed: "Completato",
  cancelled: "Annullato",
};

export default async function AdminBookingsPage() {
  const bookings = await db.booking.findMany({
    orderBy: { created_at: "desc" },
    include: { user: true, service: true },
  });

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
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">
        Gestione Prenotazioni
      </h1>

      <BookingsTable bookings={bookingsWithLabels} />
    </div>
  );
}

