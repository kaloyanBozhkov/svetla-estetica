import { env } from '@/env';

export const BASE_URL = env.NEXT_PUBLIC_BASE_URL;

// Shipping cost in cents
export const SHIPPING_COST = 1500; // 15.00 EUR

export const OPENING_HOUR = '09:00';
export const CLOSING_HOUR_WEEKDAY = '20:00';
export const CLOSING_HOUR_SATURDAY = '18:00';

export const businessHours = [
  { day: 'Lunedì', hours: '09.00 - 20.00' },
  { day: 'Martedì', hours: '09.00 - 20.00' },
  { day: 'Mercoledì', hours: '09.00 - 20.00' },
  { day: 'Giovedì', hours: '09.00 - 20.00' },
  { day: 'Venerdì', hours: '09.00 - 20.00' },
  { day: 'Sabato', hours: '09.00 - 18.00' },
];

export const openingHoursSchema = ['Mo-Fr 09:00-20:00', 'Sa 09:00-18:00'];

export const CONTACTS_EMAIL = 'rosacosmetica@gmail.com'; // email to contact for notifications and alerts (admin owner)

// Category labels for products
export const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  viso: 'Viso',
  corpo: 'Corpo',
  solari: 'Solari',
  tisane: 'Tisane',
  make_up: 'Make Up',
  profumi: 'Profumi',
  mani_e_piedi: 'Mani e Piedi',
};

// Category labels for services/treatments
export const SERVICE_CATEGORY_LABELS: Record<string, string> = {
  viso: 'Viso',
  corpo: 'Corpo',
  make_up: 'Make Up',
  ceretta: 'Ceretta',
  solarium: 'Solarium',
  pedicure: 'Pedicure',
  manicure: 'Manicure',
  luce_pulsata: 'Luce Pulsata',
  appuntamento: 'Appuntamento',
  grotta_di_sale: 'Grotta di Sale',
};

// Status labels for orders
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'In Attesa',
  confirmed: 'Confermato',
  shipped: 'Spedito',
  delivered: 'Consegnato',
  cancelled: 'Annullato',
};

// Status labels for bookings
export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: 'In Attesa',
  approved: 'Approvato',
  rejected: 'Rifiutato',
  completed: 'Completato',
  cancelled: 'Annullato',
};

// Status labels for payments
export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'In Attesa',
  paid: 'Pagato',
  failed: 'Fallito',
  refunded: 'Rimborsato',
};
