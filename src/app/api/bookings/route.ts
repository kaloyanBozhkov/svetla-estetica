import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { resend } from '@/lib/email';
import { sendCelebration, sendErrorLog } from '@/lib/alerts';
import { CONTACTS_EMAIL } from '@/lib/constants';

const createBookingSchema = z.object({
  serviceUuid: z.string().uuid(),
  name: z.string().min(2),
  date: z.string(),
  time: z.string(),
  phone: z.string().min(6),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { serviceUuid, name, date, time, phone, notes } = createBookingSchema.parse(body);

    const service = await db.service.findUnique({
      where: { uuid: serviceUuid, active: true },
    });

    if (!service) {
      return NextResponse.json({ error: 'Servizio non trovato' }, { status: 404 });
    }

    const bookingDate = new Date(`${date}T${time}`);

    // Update user name and phone if not already set
    const updates: { name?: string; phone?: string } = {};
    if (name && !user.name) {
      updates.name = name;
    }
    if (phone && !user.phone) {
      updates.phone = phone;
    }
    if (Object.keys(updates).length > 0) {
      await db.user.update({
        where: { id: user.id },
        data: updates,
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

    revalidatePath('/admin/prenotazioni');

    // Celebrate new booking
    await sendCelebration({
      event: 'Nuovo Appuntamento',
      servizio: service.name,
      data: `${date} ${time}`,
      cliente: user.email,
    });

    // Send email notification to admin
    try {
      const customerName = name || user.name || 'Cliente';

      await resend.emails.send({
        from: 'Svetla Estetica <noreply@svetlaestetica.com>',
        to: CONTACTS_EMAIL,
        subject: 'Appuntamento | SvetlaEstetica',
        html: `
          <h2>Nuova Richiesta di Appuntamento!</h2>
          <p><strong>Servizio:</strong> ${service.name}</p>
          <p><strong>Data:</strong> ${date} alle ${time}</p>
          <p><strong>Cliente:</strong> ${customerName} (${user.email})</p>
          <p><strong>Telefono:</strong> ${phone}</p>
          ${notes ? `<p><strong>Note:</strong> ${notes}</p>` : ''}
          <p><a href="https://svetlaestetica.com/admin/prenotazioni">Gestisci prenotazioni nel pannello admin</a></p>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send admin booking notification:', emailError);
    }

    return NextResponse.json({ booking });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }
    console.error('Create booking error:', error);
    await sendErrorLog({
      event: 'Booking Creation Failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json({ error: 'Errore durante la creazione' }, { status: 500 });
  }
}
