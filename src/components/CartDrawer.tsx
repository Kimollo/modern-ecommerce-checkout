import { useEffect, useRef } from 'react';
import { Trash2, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatMoney } from '../lib/format';
import { EXPRESS_SHIPPING_CENTS, LOCKER_SHIPPING_CENTS, VAT_LABEL, priceCart } from '../lib/pricing';
import { cx, focusRing, primaryButtonClass, quietButtonClass } from '../lib/styles';
import { useBodyLock } from '../hooks/useBodyLock';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { ProductImage } from './ProductImage';
import { QuantityStepper } from './QuantityStepper';
import { FreeShippingMeter } from './FreeShippingMeter';
import { PriceBreakdownList } from './PriceBreakdownList';
import { PromoCodeField } from './PromoCodeField';

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const items = useCartStore((state) => state.items);
  const promoCode = useCartStore((state) => state.promoCode);
  const closeCart = useCartStore((state) => state.closeCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const openCheckout = useCartStore((state) => state.openCheckout);
  const panelRef = useRef<HTMLElement | null>(null);
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const breakdown = priceCart(items, promoCode, 'standard');

  useBodyLock(isOpen);
  useFocusTrap(isOpen, panelRef);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeCart]);

  return (
    <div className={cx('fixed inset-0 z-50', isOpen ? '' : 'pointer-events-none')} aria-hidden={!isOpen}>
      <button
        type="button"
        className={cx('absolute inset-0 bg-stone-950/40 transition-opacity duration-300', isOpen ? 'opacity-100' : 'opacity-0')}
        aria-label="Close cart"
        tabIndex={-1}
        onClick={closeCart}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        inert={!isOpen ? true : undefined}
        className={cx(
          'absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-white shadow-2xl outline-none transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Cart</h2>
            <p className="text-xs text-stone-500">{count === 0 ? 'Nothing here yet' : `${count} ${count === 1 ? 'item' : 'items'}`}</p>
          </div>
          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button type="button" className={quietButtonClass} onClick={clearCart}>
                Empty cart
              </button>
            )}
            <button
              type="button"
              className={cx('flex size-10 items-center justify-center rounded-full hover:bg-stone-100', focusRing)}
              onClick={closeCart}
              aria-label="Close cart"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="text-lg font-medium text-stone-900">Your cart is empty</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone-500">
              Add a pair of headphones, a speaker, or an amplifier. It will stay here after you reload.
            </p>
            <button type="button" className={cx(primaryButtonClass, 'mt-6')} onClick={closeCart}>
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-4">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-stone-100">
                    <ProductImage src={item.image} alt={item.imageAlt} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-stone-950">{item.name}</p>
                        <p className="mt-0.5 text-xs text-stone-500">
                          {item.color} · {item.model}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] tracking-wide text-stone-400">{item.sku}</p>
                      </div>
                      <p className="text-sm font-medium tabular-nums">{formatMoney(item.price * item.quantity)}</p>
                    </div>
                    {item.quantity > 1 && (
                      <p className="mt-1 text-xs text-stone-500">{formatMoney(item.price)} each</p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <QuantityStepper
                        value={item.quantity}
                        max={item.maxStock}
                        label={`${item.name} ${item.color} ${item.model}`}
                        onChange={(next) => updateQuantity(item.variantId, next)}
                      />
                      <button
                        type="button"
                        className={cx('flex size-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900', focusRing)}
                        onClick={() => removeItem(item.variantId)}
                        aria-label={`Remove ${item.name} ${item.color} ${item.model}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-4 border-t border-stone-200 px-5 py-5">
              <PromoCodeField />
              <FreeShippingMeter subtotal={breakdown.subtotal} />
              <PriceBreakdownList breakdown={breakdown} shippingLabel="Door-to-door" />
              <p className="text-xs text-stone-500">
                {VAT_LABEL}. Express courier is {formatMoney(EXPRESS_SHIPPING_CENTS)}. Pargo locker pick-up is{' '}
                {formatMoney(LOCKER_SHIPPING_CENTS)}.
              </p>
              <button type="button" className={cx(primaryButtonClass, 'w-full')} onClick={openCheckout}>
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
