import { create } from 'zustand';
import { PROMO_CODES } from '../lib/pricing';
import type { CartItem } from '../types';

const STORAGE_KEY = 'vela-cart';
const CART_VERSION = 2;

export interface ToastMessage {
  id: number;
  message: string;
  tone: 'success' | 'info';
}

type NewCartItem = Omit<CartItem, 'quantity'> & { quantity?: number };

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  promoError: string | null;
  isOpen: boolean;
  checkoutOpen: boolean;
  toast: ToastMessage | null;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  addItem: (item: NewCartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => void;
  clearPromo: () => void;
  dismissToast: () => void;
}

interface StoredCart {
  items: CartItem[];
  promoCode: string | null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') return null;
  return value as Record<string, unknown>;
}

function isCartItem(value: unknown): value is CartItem {
  const item = asRecord(value);
  if (!item) return false;
  return (
    typeof item.variantId === 'string' &&
    typeof item.productId === 'string' &&
    typeof item.name === 'string' &&
    typeof item.sku === 'string' &&
    typeof item.color === 'string' &&
    typeof item.colorHex === 'string' &&
    typeof item.model === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    typeof item.quantity === 'number' &&
    Number.isFinite(item.quantity) &&
    typeof item.image === 'string' &&
    typeof item.imageAlt === 'string' &&
    typeof item.maxStock === 'number' &&
    Number.isFinite(item.maxStock)
  );
}

function readCart(): StoredCart {
  if (typeof localStorage === 'undefined') return { items: [], promoCode: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], promoCode: null };
    const parsed = asRecord(JSON.parse(raw));
    if (!parsed || parsed.version !== CART_VERSION || !Array.isArray(parsed.items)) {
      return { items: [], promoCode: null };
    }
    const items = parsed.items.filter(isCartItem).flatMap((item) => {
      const maxStock = Math.floor(item.maxStock);
      if (maxStock < 1) return [];
      return [
        {
          ...item,
          maxStock,
          quantity: Math.min(Math.max(1, Math.floor(item.quantity)), maxStock),
          price: Math.max(0, Math.round(item.price)),
        },
      ];
    });
    const promoCode = typeof parsed.promoCode === 'string' && PROMO_CODES[parsed.promoCode] ? parsed.promoCode : null;
    return { items, promoCode };
  } catch {
    return { items: [], promoCode: null };
  }
}

function writeCart(cart: StoredCart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: CART_VERSION, ...cart }));
  } catch {
    // Ignore quota and private-mode failures. The in-memory cart still works.
  }
}

let toastSequence = 0;

function nextToast(message: string, tone: ToastMessage['tone']): ToastMessage {
  toastSequence += 1;
  return { id: toastSequence, message, tone };
}

const stored = readCart();

export const useCartStore = create<CartState>()((set, get) => {
  const setAndStore = (partial: Partial<CartState>) => {
    set(partial);
    if ('items' in partial || 'promoCode' in partial) {
      const next = get();
      writeCart({ items: next.items, promoCode: next.promoCode });
    }
  };

  return {
    items: stored.items,
    promoCode: stored.promoCode,
    promoError: null,
    isOpen: false,
    checkoutOpen: false,
    toast: null,
    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
    openCheckout: () => {
      if (get().items.length === 0) return;
      set({ isOpen: false, checkoutOpen: true });
    },
    closeCheckout: () => set({ checkoutOpen: false }),
    addItem: (incoming) => {
      const quantityToAdd = Math.max(1, Math.floor(incoming.quantity ?? 1));
      const items = get().items;
      const existing = items.find((item) => item.variantId === incoming.variantId);
      const currentQty = existing?.quantity ?? 0;
      const maxStock = incoming.maxStock;
      if (maxStock < 1 || currentQty >= maxStock) {
        set({ toast: nextToast(`Only ${maxStock} available for this model`, 'info') });
        return;
      }
      const nextQty = Math.min(maxStock, currentQty + quantityToAdd);
      const nextItem: CartItem = {
        variantId: incoming.variantId,
        productId: incoming.productId,
        name: incoming.name,
        sku: incoming.sku,
        color: incoming.color,
        colorHex: incoming.colorHex,
        model: incoming.model,
        price: incoming.price,
        quantity: nextQty,
        image: incoming.image,
        imageAlt: incoming.imageAlt,
        maxStock,
      };
      const nextItems = existing
        ? items.map((item) => (item.variantId === incoming.variantId ? nextItem : item))
        : [...items, nextItem];
      const capped = nextQty < currentQty + quantityToAdd;
      setAndStore({
        items: nextItems,
        toast: nextToast(
          capped ? `Only ${maxStock} of ${incoming.name} can be added` : `${incoming.name} added to cart`,
          capped ? 'info' : 'success',
        ),
      });
    },
    updateQuantity: (variantId, quantity) => {
      const items = get().items;
      if (quantity <= 0) {
        setAndStore({ items: items.filter((item) => item.variantId !== variantId) });
        return;
      }
      setAndStore({
        items: items.map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: Math.min(item.maxStock, Math.max(1, Math.floor(quantity))) }
            : item,
        ),
      });
    },
    removeItem: (variantId) => {
      setAndStore({ items: get().items.filter((item) => item.variantId !== variantId) });
    },
    clearCart: () => setAndStore({ items: [], promoCode: null, promoError: null }),
    applyPromo: (code) => {
      const normalized = code.trim().toUpperCase();
      if (!PROMO_CODES[normalized]) {
        set({ promoError: normalized ? 'That code is not recognized.' : 'Enter a promo code.' });
        return;
      }
      setAndStore({ promoCode: normalized, promoError: null });
    },
    clearPromo: () => setAndStore({ promoCode: null, promoError: null }),
    dismissToast: () => set({ toast: null }),
  };
});

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    const next = readCart();
    useCartStore.setState({ items: next.items, promoCode: next.promoCode, promoError: null });
  });
}
