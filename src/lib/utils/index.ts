export { formatPrice, formatDate, formatDateTime, formatTime } from './format';
export { toSnakeCase, toCamelCase } from './transform';
import { ORDER_STATUS_LABELS, BOOKING_STATUS_LABELS } from '@/lib/constants';

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Order status translations
export function translateOrderStatus(status: string): string {
  return ORDER_STATUS_LABELS[status] || status;
}

// Booking status translations
export function translateBookingStatus(status: string): string {
  return BOOKING_STATUS_LABELS[status] || status;
}

// Calculate discounted price in cents
export function calculateDiscountedPrice(priceInCents: number, discountPercent: number): number {
  if (discountPercent <= 0 || discountPercent > 100) return priceInCents;
  return Math.round(priceInCents * (1 - discountPercent / 100));
}

// Get savings amount in cents
export function calculateSavings(priceInCents: number, discountPercent: number): number {
  if (discountPercent <= 0 || discountPercent > 100) return 0;
  return priceInCents - calculateDiscountedPrice(priceInCents, discountPercent);
}
