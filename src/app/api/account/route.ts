import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

const updateProfileSchema = z.object({
  phone: z.string().min(6).optional().nullable(),
  name: z.string().min(2).optional().nullable(),
});

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const data = updateProfileSchema.parse(body);

    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.name !== undefined && { name: data.name }),
      },
    });

    return NextResponse.json({
      user: {
        email: updated.email,
        name: updated.name,
        phone: updated.phone,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }
    console.error('Update profile error:', error);
    return NextResponse.json({ error: "Errore durante l'aggiornamento" }, { status: 500 });
  }
}
