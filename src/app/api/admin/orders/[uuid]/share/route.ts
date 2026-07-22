import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { env } from '@/env';

function shareUrl(token: string): string {
  return `${env.NEXT_PUBLIC_BASE_URL}/ordini/condivisi/${token}`;
}

/** Creates (or returns the existing) public share link for an order. */
export async function POST(_request: Request, { params }: { params: Promise<{ uuid: string }> }) {
  try {
    await requireAdmin();
    const { uuid } = await params;

    const order = await db.order.findUnique({
      where: { uuid },
      select: { share_token: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });
    }

    if (order.share_token) {
      return NextResponse.json({ url: shareUrl(order.share_token) });
    }

    const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, '');

    await db.order.update({
      where: { uuid },
      data: { share_token: token, share_token_created_at: new Date() },
    });

    revalidatePath(`/admin/ordini/${uuid}`);

    return NextResponse.json({ url: shareUrl(token) });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }
    console.error('Create share link error:', error);
    return NextResponse.json({ error: 'Errore durante la creazione del link' }, { status: 500 });
  }
}

/** Revokes the share link — any previously copied URL stops working immediately. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ uuid: string }> }) {
  try {
    await requireAdmin();
    const { uuid } = await params;

    await db.order.update({
      where: { uuid },
      data: { share_token: null, share_token_created_at: null },
    });

    revalidatePath(`/admin/ordini/${uuid}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }
    console.error('Revoke share link error:', error);
    return NextResponse.json({ error: 'Errore durante la revoca del link' }, { status: 500 });
  }
}
