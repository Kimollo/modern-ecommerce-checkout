import { Check, Package, Truck, Zap } from 'lucide-react';
import type { DeliveryMethod } from '../../types';
import { deliveryWindow, estimateDelivery } from '../../lib/delivery';
import { formatMoney } from '../../lib/format';
import { shippingCents } from '../../lib/pricing';
import { cx, focusRing, primaryButtonClass, secondaryButtonClass } from '../../lib/styles';

interface DeliveryStepProps {
  value: DeliveryMethod;
  subtotal: number;
  onChange: (method: DeliveryMethod) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const OPTIONS: { id: DeliveryMethod; title: string; detail: string; icon: typeof Truck }[] = [
  { id: 'standard', title: 'Standard door-to-door', detail: 'Tracked courier to your address', icon: Truck },
  { id: 'express', title: 'Express courier', detail: 'Priority handling', icon: Zap },
  { id: 'locker', title: 'Pargo locker pick-up', detail: 'Collect from a locker near you', icon: Package },
];

export function DeliveryStep({ value, subtotal, onChange, onBack, onSubmit }: DeliveryStepProps) {
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <p className="text-sm leading-relaxed text-stone-600">Choose how quickly this order should arrive.</p>
      <fieldset className="mt-4 space-y-3">
        <legend className="sr-only">Delivery method</legend>
        {OPTIONS.map((option) => {
          const selected = value === option.id;
          const price = shippingCents(subtotal, option.id);
          const Icon = option.icon;
          return (
            <label
              key={option.id}
              className={cx(
                'flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition focus-within:ring-2 focus-within:ring-stone-900/15',
                selected ? 'border-stone-950 bg-stone-50 ring-1 ring-stone-950' : 'border-stone-200 bg-white hover:border-stone-400',
              )}
            >
              <input
                type="radio"
                name="delivery-method"
                value={option.id}
                checked={selected}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-stone-800 ring-1 ring-stone-200">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-stone-950">{option.title}</span>
                <span className="mt-0.5 block text-sm text-stone-500">
                  {deliveryWindow(option.id)} · Arrives {estimateDelivery(option.id)}
                </span>
                <span className="mt-0.5 block text-xs text-stone-400">{option.detail}</span>
              </span>
              <span className="text-sm font-semibold tabular-nums text-stone-950">{price === 0 ? 'Free' : formatMoney(price)}</span>
              <span
                className={cx(
                  'flex size-5 items-center justify-center rounded-full border',
                  selected ? 'border-stone-950 bg-stone-950 text-white' : 'border-stone-300 text-transparent',
                )}
                aria-hidden="true"
              >
                <Check className="size-3" />
              </span>
            </label>
          );
        })}
      </fieldset>
      <div className="mt-8 flex gap-3">
        <button type="button" className={cx(secondaryButtonClass, focusRing)} onClick={onBack}>
          Back
        </button>
        <button type="submit" className={cx(primaryButtonClass, 'flex-1')}>
          Continue to payment
        </button>
      </div>
    </form>
  );
}
