import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

const createBookingSchema = z.object({
  serviceUuid: z.string().uuid(),
  date: z.string(),
  time: z.string(),
  phone: z.string().min(6),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { serviceUuid, date, time, phone, notes } = createBookingSchema.parse(body);

    const service = await db.service.findUnique({
      where: { uuid: serviceUuid, active: true },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Servizio non trovato" },
        { status: 404 }
      );
    }

    const bookingDate = new Date(`${date}T${time}`);

    // Update user phone only if not already set
    if (phone && !user.phone) {
      await db.user.update({
        where: { id: user.id },
        data: { phone },
      });
    }

    const booking = await db.booking.create({
      data: {
        user_id: user.id,
        service_id: service.id,
        date: bookingDate,
        duration_min: service.duration_min,
        price: service.price,
        phone,
        notes,
      },
    });

    return NextResponse.json({ booking });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dati non validi" },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      );
    }
    console.error("Create booking error:", error);
    return NextResponse.json(
      { error: "Errore durante la creazione" },
      { status: 500 }
    );
  }
}

