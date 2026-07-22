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

const REGION_NAMES = new Intl.DisplayNames(['it'], { type: 'region' });

interface ShippingDetails {
  name?: string | null;
  phone?: string | null;
  line1?: string | null;
  line2?: string | null;
  postalCode?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}

/**
 * Formats the shipping details collected at checkout into a multi-line block,
 * ready to be stored in `order.shipping_address` and rendered as-is.
 */
export function formatShippingAddress(details: ShippingDetails): string | null {
  const { name, phone, line1, line2, postalCode, city, state, country } = details;

  // Country codes come from Stripe as ISO 3166-1 alpha-2 ("IT"), show the italian name.
  let countryName = country || null;
  if (country) {
    try {
      countryName = REGION_NAMES.of(country) || country;
    } catch {
      countryName = country;
    }
  }

  const cityLine = [postalCode, city, state && `(${state})`].filter(Boolean).join(' ');

  const lines = [name, line1, line2, cityLine, countryName, phone && `Tel: ${phone}`]
    .map((line) => line?.trim())
    .filter((line): line is string => Boolean(line));

  return lines.length > 0 ? lines.join('\n') : null;
}
