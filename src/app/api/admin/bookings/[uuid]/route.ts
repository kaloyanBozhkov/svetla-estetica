import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { resend } from "@/lib/email";
import { sendCelebration } from "@/lib/alerts";
import BookingApprovedEmail from "@/components/emails/BookingApprovedEmail";
import BookingRejectedEmail from "@/components/emails/BookingRejectedEmail";

const updateBookingSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "completed", "cancelled"]),
});

function formatDate(date: Date): string {
  return date.toLocaleDateString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    await requireAdmin();
    const { uuid } = await params;
    const body = await request.json();
    const { status } = updateBookingSchema.parse(body);

    // Get booking with user and service info before updating
    const existingBooking = await db.booking.findUnique({
      where: { uuid },
      include: {
        user: true,
        service: true,
      },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Prenotazione non trovata" },
        { status: 404 }
      );
    }

    const previousStatus = existingBooking.status;

    // Update booking
    const booking = await db.booking.update({
      where: { uuid },
      data: { status },
    });

    // Send email if status changed to approved or rejected
    if (status !== previousStatus && existingBooking.user.email) {
      const customerName = existingBooking.user.name || "Cliente";
      const serviceName = existingBooking.service.name;
      const bookingDate = formatDate(existingBooking.date);
      const bookingTime = formatTime(existingBooking.date);

      try {
        if (status === "approved") {
          await resend.emails.send({
            from: "Svetla Estetica <noreply@svetlaestetica.com>",
            to: existingBooking.user.email,
            subject: "Appuntamento Confermato - Svetla Estetica",
            react: BookingApprovedEmail({
              customerName,
              serviceName,
              bookingDate,
              bookingTime,
              duration: existingBooking.duration_min,
            }),
          });

          // Celebrate confirmed appointment
          await sendCelebration({
            event: "Appuntamento Confermato",
            servizio: serviceName,
            data: `${bookingDate} ${bookingTime}`,
            cliente: existingBooking.user.email,
          });
        } else if (status === "rejected") {
          await resend.emails.send({
            from: "Svetla Estetica <noreply@svetlaestetica.com>",
            to: existingBooking.user.email,
            subject: "Aggiornamento Appuntamento - Svetla Estetica",
            react: BookingRejectedEmail({
              customerName,
              serviceName,
              serviceUuid: existingBooking.service.uuid,
              bookingDate,
              bookingTime,
            }),
          });
        }
      } catch (emailError) {
        console.error("Failed to send booking status email:", emailError);
        // Don't fail the request if email fails
      }
    }

    // Revalidate admin pages
    revalidatePath("/admin/prenotazioni");

    return NextResponse.json({ booking });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
    }
    console.error("Update booking error:", error);
    return NextResponse.json(
      { error: "Errore durante l'aggiornamento" },
      { status: 500 }
    );
  }
}
