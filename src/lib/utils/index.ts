export { formatPrice, formatDate, formatDateTime, formatTime } from "./format";
export { toSnakeCase, toCamelCase } from "./transform";

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Order status translations
const orderStatusMap: Record<string, string> = {
  pending: "In attesa",
  confirmed: "Confermato",
  processing: "In elaborazione",
  shipped: "Spedito",
  delivered: "Consegnato",
  cancelled: "Annullato",
};

export function translateOrderStatus(status: string): string {
  return orderStatusMap[status] || status;
}

// Booking status translations
const bookingStatusMap: Record<string, string> = {
  pending: "In attesa",
  approved: "Approvato",
  rejected: "Rifiutato",
  completed: "Completato",
  cancelled: "Annullato",
};

export function translateBookingStatus(status: string): string {
  return bookingStatusMap[status] || status;
}

