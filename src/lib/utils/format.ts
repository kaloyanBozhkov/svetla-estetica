export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'long',
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    timeStyle: 'short',
  }).format(date);
}
