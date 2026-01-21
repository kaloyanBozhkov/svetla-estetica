import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyMagicLink, createSessionToken, setSessionCookie } from '@/lib/auth';

const verifySchema = z.object({
  token: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = verifySchema.parse(body);

    const userId = await verifyMagicLink(token);

    if (!userId) {
      return NextResponse.json({ error: 'Link non valido o scaduto' }, { status: 400 });
    }

    const sessionToken = await createSessionToken(userId);
    await setSessionCookie(sessionToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Token non valido' }, { status: 400 });
    }
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Errore durante la verifica' }, { status: 500 });
  }
}
