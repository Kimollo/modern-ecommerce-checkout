import { Minus, Plus } from 'lucide-react';
import { cx, focusRing } from '../lib/styles';

interface QuantityStepperProps {
  value: number;
  min?: number;
  max: number;
  onChange: (next: number) => void;
  label: string;
}

export function QuantityStepper({ value, min = 1, max, onChange, label }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-stone-300 bg-white">
      <button
        type="button"
        className={cx('flex size-9 items-center justify-center rounded-full text-stone-800 disabled:text-stone-300', focusRing)}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Decrease quantity of ${label}`}
      >
        <Minus className="size-3.5" />
      </button>
      <span className="w-6 text-center text-sm font-medium tabular-nums" aria-live="polite" aria-label={`Quantity ${value}`}>
        {value}
      </span>
      <button
        type="button"
        className={cx('flex size-9 items-center justify-center rounded-full text-stone-800 disabled:text-stone-300', focusRing)}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase quantity of ${label}`}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
