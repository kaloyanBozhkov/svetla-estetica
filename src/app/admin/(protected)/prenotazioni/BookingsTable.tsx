'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Badge, Button } from '@/components/atoms';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { type booking_status } from '@prisma/client';

interface Booking {
  id: number;
  uuid: string;
  date: Date;
  durationMin: number;
  price: number;
  status: booking_status;
  statusLabel: string;
  userName: string;
  userEmail: string;
  serviceName: string;
}

interface BookingsTableProps {
  bookings: Booking[];
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleStatusChange = async (uuid: string, newStatus: booking_status) => {
    setLoading(uuid);
    try {
      await fetch(`/api/admin/bookings/${uuid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  const getStatusVariant = (status: booking_status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  if (bookings.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-gray-500">Nessuna prenotazione trovata</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Servizio</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cliente</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data/Ora</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Durata</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Prezzo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stato</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {booking.serviceName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div>{booking.userName}</div>
                  <div className="text-xs text-gray-400">{booking.userEmail}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDateTime(new Date(booking.date))}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{booking.durationMin} min</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatPrice(booking.price)}</td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusVariant(booking.status)}>{booking.statusLabel}</Badge>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {booking.status === 'pending' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        loading={loading === booking.uuid}
                        onClick={() => handleStatusChange(booking.uuid, 'approved')}
                      >
                        Approva
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        loading={loading === booking.uuid}
                        onClick={() => handleStatusChange(booking.uuid, 'rejected')}
                      >
                        Rifiuta
                      </Button>
                    </>
                  )}
                  {booking.status === 'approved' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      loading={loading === booking.uuid}
                      onClick={() => handleStatusChange(booking.uuid, 'completed')}
                    >
                      Completa
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
