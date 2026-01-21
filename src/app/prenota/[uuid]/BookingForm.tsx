'use client';

import { type FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardTitle, Button, Input } from '@/components/atoms';
import { CheckIcon } from '@/components/atoms/icons';
import { formatPrice } from '@/lib/utils';
import { OPENING_HOUR, CLOSING_HOUR_WEEKDAY } from '@/lib/constants';
import { z } from 'zod';

interface BookingFormProps {
  service: {
    id: number;
    uuid: string;
    name: string;
    price: number;
    durationMin: number;
  };
  user: {
    name: string;
    phone: string;
  };
}

const bookingSchema = z.object({
  name: z.string().min(2, 'Nome richiesto'),
  date: z.string().min(1, 'Data richiesta'),
  time: z.string().min(1, 'Ora richiesta'),
  phone: z.string().min(6, 'Numero di telefono richiesto'),
  notes: z.string().optional(),
});

export function BookingForm({ service, user }: BookingFormProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [date, setDate] = useState('');
  const [time, setTime] = useState(OPENING_HOUR);
  const [phone, setPhone] = useState(user.phone);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      bookingSchema.parse({ name, date, time, phone, notes });

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceUuid: service.uuid,
          name,
          date,
          time,
          phone,
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Errore');
      }

      setSuccess(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(z.prettifyError(err));
      } else if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckIcon className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle>Prenotazione Inviata!</CardTitle>
        <p className="mt-4 text-gray-600">
          La tua richiesta di prenotazione per <strong>{service.name}</strong> è stata inviata. Ti
          contatteremo per confermare l&apos;appuntamento.
        </p>
        <Button className="mt-6" onClick={() => router.push('/account')}>
          Vai al tuo Account
        </Button>
      </Card>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <CardTitle className="mb-6">Prenota: {service.name}</CardTitle>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between">
          <span className="text-gray-600">Durata</span>
          <span className="font-medium">{service.durationMin} min</span>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-gray-600">Prezzo</span>
          <span className="font-medium text-primary-600">{formatPrice(service.price)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Il tuo nome"
          required
        />

        <Input
          type="tel"
          label="Numero di telefono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+39 333 1234567"
          required
        />

        <Input
          type="date"
          label="Data"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={today}
          required
        />

        <Input
          type="time"
          label="Ora preferita"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          min={OPENING_HOUR}
          max={CLOSING_HOUR_WEEKDAY}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Note (opzionale)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            placeholder="Eventuali richieste o informazioni..."
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" loading={loading}>
          Invia Richiesta di Prenotazione
        </Button>

        <p className="text-xs text-center text-gray-500">
          La prenotazione è soggetta a conferma. Ti contatteremo per confermare l&apos;appuntamento.
        </p>
      </form>
    </Card>
  );
}
