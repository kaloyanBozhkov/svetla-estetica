import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { Resend } from 'resend';
import { env } from '@/env';
import CartReminderEmail from '@/components/emails/CartReminderEmail';

const resend = new Resend(env.RESEND_API_KEY);

const emailSchema = z.object({
  subject: z.string().min(1).max(200),
  customMessage: z.string().min(1).max(2000),
});

export async function POST(req: Request, { params }: { params: Promise<{ userUuid: string }> }) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userUuid } = await params;

  try {
    const body = await req.json();
    const { subject, customMessage } = emailSchema.parse(body);

    const user = await db.user.findUnique({
      where: { uuid: userUuid },
      select: {
        email: true,
        name: true,
        cart_items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                image_url: true,
                active: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.cart_items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Filter out inactive products
    const activeItems = user.cart_items.filter((item) => item.product.active);

    if (activeItems.length === 0) {
      return NextResponse.json({ error: 'No active products in cart' }, { status: 400 });
    }

    const items = activeItems.map((item) => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      imageUrl: item.product.image_url || undefined,
    }));

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await resend.emails.send({
      from: 'Svetla Estetica <noreply@svetlaestetica.com>',
      to: user.email,
      subject,
      react: CartReminderEmail({
        userName: user.name || undefined,
        items,
        total,
        customMessage,
      }),
    });

    // Update last contacted timestamp
    await db.user.update({
      where: { uuid: userUuid },
      data: { last_cart_reminder_at: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: z.prettifyError(error) },
        { status: 400 }
      );
    }
    console.error('Send cart reminder error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
