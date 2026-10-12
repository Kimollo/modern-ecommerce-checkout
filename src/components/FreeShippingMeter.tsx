import { FREE_SHIPPING_THRESHOLD } from '../lib/pricing';
import { formatMoney } from '../lib/format';

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const ratio = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const percent = Math.round(ratio * 100);

  return (
    <div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-stone-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Progress toward free door-to-door delivery"
      >
        <div className="h-full rounded-full bg-stone-900 transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-stone-600">
        {remaining === 0
          ? 'You have unlocked free door-to-door delivery.'
          : `Add ${formatMoney(remaining)} more for free door-to-door delivery.`}
      </p>
    </div>
  );
}
