'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, Button, Input, Textarea, ActionButton, Badge } from '@/components/atoms';
import { ArrowLeftIcon, MailIcon } from '@/components/atoms/icons';
import { formatPrice } from '@/lib/utils';

interface CartItem {
  id: number;
  quantity: number;
  updatedAt: Date;
  product: {
    uuid: string;
    name: string;
    price: number;
    stock: number;
    imageUrl: string | null;
    active: boolean;
  };
}

interface CartDetailData {
  user: {
    uuid: string;
    email: string;
    name: string | null;
    phone: string | null;
    createdAt: Date;
    lastContactedAt: Date | null;
  };
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartDetailProps {
  data: CartDetailData;
}

const DEFAULT_SUBJECT = 'Il tuo carrello ti aspetta - Svetla Estetica';
const DEFAULT_MESSAGE = `Hai lasciato alcuni prodotti nel tuo carrello. Non lasciarli scappare!

Completa il tuo ordine oggi stesso e goditi i nostri prodotti di alta qualità.`;

export function CartDetail({ data }: CartDetailProps) {
  const router = useRouter();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [customMessage, setCustomMessage] = useState(DEFAULT_MESSAGE);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const handleSendEmail = async () => {
    setSending(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch(`/api/admin/carts/${data.user.uuid}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          customMessage,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Errore invio email');
      }

      setSuccess(true);
      router.refresh(); // Refresh to update "Ultimo contatto"
      setTimeout(() => {
        setShowEmailModal(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore invio email');
    } finally {
      setSending(false);
    }
  };

  const activeItems = data.items.filter((item) => item.product.active);
  const inactiveItems = data.items.filter((item) => !item.product.active);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Torna ai carrelli
        </button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
              Carrello di {data.user.email}
            </h1>
            <p className="mt-1 text-gray-500">
              {data.itemCount} prodotti · {formatPrice(data.total)}
            </p>
          </div>
          <Button onClick={() => setShowEmailModal(true)}>
            <MailIcon className="w-4 h-4 mr-2" />
            Invia promemoria
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Info */}
        <Card className="lg:col-span-1">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Informazioni utente</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-900">{data.user.email}</dd>
            </div>
            {data.user.name && (
              <div>
                <dt className="text-gray-500">Nome</dt>
                <dd className="font-medium text-gray-900">{data.user.name}</dd>
              </div>
            )}
            {data.user.phone && (
              <div>
                <dt className="text-gray-500">Telefono</dt>
                <dd className="font-medium text-gray-900">{data.user.phone}</dd>
              </div>
            )}
            <div>
              <dt className="text-gray-500">Registrato il</dt>
              <dd className="font-medium text-gray-900">{formatDate(data.user.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Ultimo contatto</dt>
              <dd className="font-medium text-gray-900">
                {data.user.lastContactedAt ? (
                  formatDate(data.user.lastContactedAt)
                ) : (
                  <span className="text-gray-400">Mai contattato</span>
                )}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Cart Items */}
        <Card className="lg:col-span-2">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">
            Prodotti nel carrello
          </h2>

          {activeItems.length === 0 ? (
            <p className="text-gray-500">Nessun prodotto attivo nel carrello</p>
          ) : (
            <div className="space-y-4">
              {activeItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-lg bg-gray-50">
                  <div className="relative h-16 w-16 flex-shrink-0 rounded-lg bg-white overflow-hidden">
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        unoptimized
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400 text-lg font-bold">
                        {item.product.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/prodotti/${item.product.uuid}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                      <span className="text-gray-500">Qtà: {item.quantity}</span>
                      <span className="text-gray-300">·</span>
                      <span className="font-semibold text-primary-600">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      {item.product.stock <= 0 && (
                        <Badge variant="danger" className="text-xs">
                          Esaurito
                        </Badge>
                      )}
                      {item.product.stock > 0 && item.product.stock < item.quantity && (
                        <Badge variant="warning" className="text-xs">
                          Solo {item.product.stock} disponibili
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {inactiveItems.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Prodotti non più disponibili ({inactiveItems.length})
              </h3>
              <div className="space-y-2">
                {inactiveItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded bg-red-50 text-sm text-red-700"
                  >
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-red-500">× {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Totale carrello</span>
            <span className="text-xl font-bold text-primary-600">{formatPrice(data.total)}</span>
          </div>
        </Card>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowEmailModal(false)} />
          <Card className="relative z-10 w-full max-w-lg">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
              Invia email promemoria
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Invia un&apos;email a <strong>{data.user.email}</strong> per ricordare i prodotti nel
              carrello.
            </p>

            <div className="space-y-4">
              <Input
                label="Oggetto email"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={DEFAULT_SUBJECT}
              />

              <Textarea
                label="Messaggio"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Scrivi il messaggio per il cliente..."
                rows={5}
              />

              <p className="text-xs text-gray-500">
                L&apos;email includerà automaticamente l&apos;elenco dei prodotti nel carrello e un
                pulsante per completare l&apos;ordine.
              </p>

              {error && <p className="text-sm text-red-600">{error}</p>}

              {success && <p className="text-sm text-green-600">Email inviata con successo!</p>}

              <div className="flex gap-3 justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEmailModal(false)}
                  disabled={sending}
                >
                  Annulla
                </Button>
                <ActionButton
                  onClick={handleSendEmail}
                  loading={sending}
                  disabled={!subject.trim() || !customMessage.trim()}
                >
                  <MailIcon className="w-4 h-4 mr-2" />
                  Invia email
                </ActionButton>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
