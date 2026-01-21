'use client';

import { useState, useMemo } from 'react';
import { Card, Badge } from '@/components/atoms';
import { SearchInput } from '@/components/molecules';
import Link from 'next/link';
import { type user_role } from '@prisma/client';

interface User {
  id: number;
  uuid: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: user_role;
  emailVerified: boolean;
  createdAt: Date;
  ordersCount: number;
  bookingsCount: number;
}

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-4">
      <SearchInput
        placeholder="Cerca per email, nome o telefono..."
        initialValue=""
        onSearch={setSearch}
        debounceMs={300}
        className="max-w-md"
      />

      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">Nessun utente trovato</p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Utente
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Telefono
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ruolo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Ordini
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Prenotazioni
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Registrato
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name || '—'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '—'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === 'admin' ? 'warning' : 'default'}>
                        {user.role === 'admin' ? 'Admin' : 'Cliente'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.ordersCount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.bookingsCount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/utenti/${user.uuid}`}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Dettagli
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
