import type { CartItem, DeliveryMethod } from '../types';

/** South African VAT. Catalog prices already include this rate. */
export const VAT_RATE = 0.15;
export const VAT_LABEL = 'VAT (15%) included';

export const FREE_SHIPPING_THRESHOLD = 100_000;
export const STANDARD_SHIPPING_CENTS = 10_000;
export const EXPRESS_SHIPPING_CENTS = 18_000;
export const LOCKER_SHIPPING_CENTS = 8_000;

export const PROMO_CODES: Record<string, number> = {
  SAVE10: 0.1,
};

export interface PriceBreakdown {
  subtotal: number;
  discount: number;
  promoCode: string | null;
  discountedSubtotal: number;
  /** VAT already included in the merchandise total. */
  tax: number;
  shipping: number;
  total: number;
  amountUntilFreeShipping: number;
  freeShipping: boolean;
}

export function vatIncludedCents(inclusiveAmount: number) {
  return Math.round((inclusiveAmount * VAT_RATE) / (1 + VAT_RATE));
}

export function shippingCents(subtotal: number, method: DeliveryMethod) {
  if (method === 'express') return EXPRESS_SHIPPING_CENTS;
  if (method === 'locker') return LOCKER_SHIPPING_CENTS;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_CENTS;
}

export function priceCart(
  items: CartItem[],
  promoCode: string | null,
  delivery: DeliveryMethod = 'standard',
): PriceBreakdown {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const rate = promoCode && PROMO_CODES[promoCode] ? PROMO_CODES[promoCode] : 0;
  const discount = Math.round(subtotal * rate);
  const discountedSubtotal = subtotal - discount;
  const tax = vatIncludedCents(discountedSubtotal);
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = shippingCents(subtotal, delivery);
  return {
    subtotal,
    discount,
    promoCode: rate > 0 ? promoCode : null,
    discountedSubtotal,
    tax,
    shipping,
    total: discountedSubtotal + shipping,
    amountUntilFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
    freeShipping,
  };
}
