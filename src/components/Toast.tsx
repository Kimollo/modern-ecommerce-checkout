import { useEffect } from 'react';
import { Check, Info } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { focusRing } from '../lib/styles';

export function Toast() {
  const toast = useCartStore((state) => state.toast);
  const dismissToast = useCartStore((state) => state.dismissToast);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(dismissToast, 3400);
    return () => window.clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex justify-center px-4">
      <div
        role="status"
        className="pointer-events-auto flex max-w-md animate-[toast-in_0.35s_ease-out] items-center gap-3 rounded-full border border-stone-200 bg-white py-2 pr-2 pl-4 shadow-lg"
      >
        {toast.tone === 'success' ? (
          <Check className="size-4 shrink-0 text-emerald-700" aria-hidden="true" />
        ) : (
          <Info className="size-4 shrink-0 text-stone-600" aria-hidden="true" />
        )}
        <p className="text-sm font-medium text-stone-900">{toast.message}</p>
        <button
          type="button"
          className={`rounded-full bg-stone-950 px-3 py-1.5 text-xs font-medium text-white ${focusRing}`}
          onClick={() => {
            openCart();
            dismissToast();
          }}
        >
          View cart
        </button>
      </div>
    </div>
  );
}
