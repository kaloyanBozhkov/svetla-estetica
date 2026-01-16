import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { resend } from "@/lib/email";
import OrderStatusEmail from "@/components/emails/OrderStatusEmail";

const updateOrderSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
});

const statusMessages: Record<string, string> = {
  pending: "In Attesa",
  confirmed: "Ordine Confermato",
  shipped: "Ordine Spedito",
  delivered: "Ordine Consegnato",
  cancelled: "Ordine Annullato",
};

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    await requireAdmin();
    const { uuid } = await params;
    const body = await request.json();
    const { status } = updateOrderSchema.parse(body);

    // Get order with user info before updating
    const existingOrder = await db.order.findUnique({
      where: { uuid },
      include: { user: true },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Ordine non trovato" },
        { status: 404 }
      );
    }

    const previousStatus = existingOrder.status;

    // Update order
    const order = await db.order.update({
      where: { uuid },
      data: { status },
    });

    // Send email if status changed
    if (status !== previousStatus && existingOrder.user.email) {
      const customerName = existingOrder.user.name || "Cliente";

      try {
        await resend.emails.send({
          from: "Svetla Estetica <noreply@svetlaestetica.com>",
          to: existingOrder.user.email,
          subject: `${statusMessages[status]} - Svetla Estetica`,
          react: OrderStatusEmail({
            customerName,
            orderUuid: existingOrder.uuid,
            orderTotal: formatPrice(existingOrder.total),
            newStatus: status,
            statusMessage: statusMessages[status],
          }),
        });
      } catch (emailError) {
        console.error("Failed to send order status email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dati non validi" },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 403 }
      );
    }
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Errore durante l'aggiornamento" },
      { status: 500 }
    );
  }
}
