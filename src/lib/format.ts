export function formatMoney(cents: number) {
  const negative = cents < 0;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(cents) / 100);
  return `${negative ? '-' : ''}R ${formatted}`;
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('en-ZA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

export function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function formatCvv(raw: string) {
  return raw.replace(/\D/g, '').slice(0, 4);
}

export function formatPostalCode(raw: string) {
  return raw.replace(/\D/g, '').slice(0, 4);
}

export function cardBrand(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'Amex';
  return 'Card';
}

export function createOrderId() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let id = 'VL-';
  for (const byte of bytes) {
    id += alphabet[byte % alphabet.length];
  }
  return id;
}
