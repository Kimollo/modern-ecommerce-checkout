import { Check } from 'lucide-react';
import { cx, focusRing } from '../../lib/styles';

export type CheckoutStep = 1 | 2 | 3 | 4;

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: 1, label: 'Information' },
  { id: 2, label: 'Delivery' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Receipt' },
];

export function StepIndicator({ current, onSelect }: { current: CheckoutStep; onSelect: (step: CheckoutStep) => void }) {
  return (
    <ol className="flex items-center gap-2 overflow-x-auto" aria-label="Checkout progress">
      {STEPS.map((step, index) => {
        const state = current === step.id ? 'current' : current > step.id ? 'done' : 'upcoming';
        const canJump = current < 4 && step.id < current;
        return (
          <li key={step.id} className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canJump}
              onClick={() => canJump && onSelect(step.id)}
              aria-current={state === 'current' ? 'step' : undefined}
              className={cx('flex items-center gap-2 rounded-full', canJump && focusRing, !canJump && 'cursor-default')}
            >
              <span
                className={cx(
                  'flex size-6 items-center justify-center rounded-full text-xs font-semibold',
                  state === 'upcoming' ? 'bg-stone-100 text-stone-500' : 'bg-stone-950 text-white',
                )}
              >
                {state === 'done' ? <Check className="size-3.5" aria-hidden="true" /> : step.id}
              </span>
              <span className={cx('hidden text-xs font-medium sm:inline', state === 'upcoming' ? 'text-stone-400' : 'text-stone-800')}>
                {step.label}
              </span>
            </button>
            {index < STEPS.length - 1 && <span className="h-px w-4 bg-stone-300 sm:w-6" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
