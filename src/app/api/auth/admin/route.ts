import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { verifyAdminCredentials, createSessionToken, setSessionCookie } from '@/lib/auth';
import { db } from '@/lib/db';
import { env } from '@/env';

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = adminLoginSchema.parse(body);

    if (!verifyAdminCredentials(email, password)) {
      return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
    }

    let admin = await db.user.findUnique({ where: { email } });

    if (!admin) {
      admin = await db.user.create({
        data: {
          email: env.ADMIN_EMAIL,
          role: 'admin',
          email_verified: true,
        },
      });
      revalidatePath('/admin/utenti');
    }

    const sessionToken = await createSessionToken(admin.id);
    await setSessionCookie(sessionToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
    }
    console.error('Admin login error:', error);
    return NextResponse.json({ error: "Errore durante l'accesso" }, { status: 500 });
  }
}
