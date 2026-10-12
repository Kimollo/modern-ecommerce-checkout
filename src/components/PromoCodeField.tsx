import { useId, useState } from 'react';
import { PROMO_CODES } from '../lib/pricing';
import { cx, focusRing, quietButtonClass, secondaryButtonClass } from '../lib/styles';
import { useCartStore } from '../store/cartStore';

export function PromoCodeField() {
  const promoCode = useCartStore((state) => state.promoCode);
  const promoError = useCartStore((state) => state.promoError);
  const applyPromo = useCartStore((state) => state.applyPromo);
  const clearPromo = useCartStore((state) => state.clearPromo);
  const inputId = useId();
  const errorId = useId();
  const [code, setCode] = useState('');
  const [dirty, setDirty] = useState(true);
  const showError = Boolean(promoError) && !dirty;

  if (promoCode) {
    const percent = Math.round((PROMO_CODES[promoCode] ?? 0) * 100);
    return (
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-800">
          {promoCode} applied (-{percent}%)
        </p>
        <button type="button" className={quietButtonClass} onClick={clearPromo}>
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setDirty(false);
          applyPromo(code);
        }}
        className="flex gap-2"
      >
        <label htmlFor={inputId} className="sr-only">
          Promo code
        </label>
        <input
          id={inputId}
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setDirty(true);
          }}
          placeholder="Promo code"
          autoComplete="off"
          aria-invalid={showError || undefined}
          aria-describedby={showError ? errorId : undefined}
          className={cx(
            'w-full rounded-full border bg-white px-4 py-2.5 text-sm outline-none transition',
            showError ? 'border-red-400' : 'border-stone-300',
            focusRing,
          )}
        />
        <button type="submit" className={cx(secondaryButtonClass, 'shrink-0 px-4 py-2.5')}>
          Apply
        </button>
      </form>
      {showError ? (
        <p id={errorId} role="alert" className="mt-2 text-xs font-medium text-red-600">
          {promoError}
        </p>
      ) : (
        <p className="mt-2 text-xs text-stone-500">Try SAVE10 for 10% off.</p>
      )}
    </div>
  );
}
