import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

const updateOrderSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    await requireAdmin();
    const { uuid } = await params;
    const body = await request.json();
    const { status } = updateOrderSchema.parse(body);

    const order = await db.order.update({
      where: { uuid },
      data: { status },
    });

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

