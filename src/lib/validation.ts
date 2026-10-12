import { SA_PROVINCES } from '../data/provinces';
import type { PaymentDetails, ShippingDetails } from '../types';

export type ShippingErrors = Partial<
  Record<'email' | 'firstName' | 'lastName' | 'address' | 'city' | 'state' | 'postalCode' | 'phone', string>
>;

export type PaymentErrors = Partial<Record<'cardName' | 'cardNumber' | 'expiry' | 'cvv', string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const POSTAL_PATTERN = /^\d{4}$/;
const PHONE_PATTERN = /^[0-9+().\-\s]{7,20}$/;

export const SUCCESS_CARD = '4242424242424242';
export const DECLINE_CARD = '4000000000000002';

export function validateShipping(details: ShippingDetails): ShippingErrors {
  const errors: ShippingErrors = {};
  if (!EMAIL_PATTERN.test(details.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (details.firstName.trim().length < 1) errors.firstName = 'Enter a first name.';
  if (details.lastName.trim().length < 1) errors.lastName = 'Enter a last name.';
  if (details.address.trim().length < 5) errors.address = 'Enter a street address.';
  if (details.city.trim().length < 2) errors.city = 'Enter a city.';
  if (!SA_PROVINCES.some((province) => province === details.state)) {
    errors.state = 'Select a province.';
  }
  if (!POSTAL_PATTERN.test(details.postalCode.trim())) {
    errors.postalCode = 'Enter a 4-digit postal code (for example 2000).';
  }
  if (details.phone.trim() && !PHONE_PATTERN.test(details.phone.trim())) {
    errors.phone = 'Enter a valid phone number.';
  }
  return errors;
}

export function luhnCheck(digits: string) {
  let sum = 0;
  let alternate = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number.parseInt(digits[index] ?? '', 10);
    if (Number.isNaN(digit)) return false;
    if (alternate) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    alternate = !alternate;
  }
  return sum % 10 === 0 && digits.length > 0;
}

export function validateExpiry(value: string) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return 'Use MM/YY.';
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return 'Enter a valid month.';
  const now = new Date();
  const currentIndex = now.getFullYear() * 12 + now.getMonth();
  const expiryIndex = year * 12 + (month - 1);
  if (expiryIndex < currentIndex) return 'This card has expired.';
  return undefined;
}

export function validatePayment(payment: PaymentDetails): PaymentErrors {
  const errors: PaymentErrors = {};
  const digits = payment.cardNumber.replace(/\D/g, '');
  if (payment.cardName.trim().length < 2) errors.cardName = 'Enter the name on the card.';
  if (digits.length !== 16) errors.cardNumber = 'Enter a 16-digit card number.';
  else if (!luhnCheck(digits)) errors.cardNumber = 'That card number looks incorrect.';
  const expiryError = validateExpiry(payment.expiry);
  if (expiryError) errors.expiry = expiryError;
  if (!/^\d{3,4}$/.test(payment.cvv)) errors.cvv = 'Enter the 3-digit CVV.';
  return errors;
}

export function isDeclineCard(cardNumber: string) {
  return cardNumber.replace(/\D/g, '') === DECLINE_CARD;
}

export function hasFieldErrors(errors: object) {
  return Object.values(errors).some(Boolean);
}
