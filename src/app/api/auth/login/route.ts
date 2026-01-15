import { NextResponse } from "next/server";
import { z } from "zod";
import { createMagicLink, sendMagicLinkEmail } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = loginSchema.parse(body);

    const token = await createMagicLink(email);
    await sendMagicLinkEmail(email, token);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Email non valida" },
        { status: 400 }
      );
    }
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Errore durante l'invio dell'email" },
      { status: 500 }
    );
  }
}

