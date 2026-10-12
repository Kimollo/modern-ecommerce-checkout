import { Lock, Loader2 } from 'lucide-react';
import type { PaymentDetails } from '../../types';
import type { PaymentErrors } from '../../lib/validation';
import { cardBrand, formatCardNumber, formatCvv, formatExpiry, formatMoney } from '../../lib/format';
import { cx, fieldClass, primaryButtonClass, secondaryButtonClass } from '../../lib/styles';
import { Field, fieldProps } from '../Field';

interface PaymentStepProps {
  value: PaymentDetails;
  errors: PaymentErrors;
  declineMessage: string | null;
  submitting: boolean;
  total: number;
  onChange: (patch: Partial<PaymentDetails>) => void;
  onFill: (kind: 'success' | 'decline') => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function PaymentStep({
  value,
  errors,
  declineMessage,
  submitting,
  total,
  onChange,
  onFill,
  onBack,
  onSubmit,
}: PaymentStepProps) {
  const brand = cardBrand(value.cardNumber);

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <p className="text-sm leading-relaxed text-stone-600">
        Demo card checkout. Nothing is charged, and the card number never leaves this browser.
      </p>
      <ul className="flex flex-wrap gap-2" aria-label="Local payment options">
        <li className="rounded-md bg-[#1a1f71] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white">Visa</li>
        <li className="rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold tracking-wide text-stone-900 ring-1 ring-stone-300">
          Mastercard
        </li>
        <li className="rounded-md bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white">Instant EFT / Ozow</li>
        <li className="rounded-md bg-sky-700 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white">Capitec Pay</li>
      </ul>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-700 p-5 text-white shadow-lg sm:max-w-sm">
        <div className="flex items-start justify-between">
          <span className="block h-8 w-11 rounded-md bg-gradient-to-br from-amber-200 to-amber-500" aria-hidden="true" />
          <span className="text-xs font-medium tracking-[0.18em] uppercase">{brand}</span>
        </div>
        <p className="mt-8 font-mono text-lg tracking-[0.18em]">{value.cardNumber || '•••• •••• •••• ••••'}</p>
        <div className="mt-4 flex items-end justify-between text-xs tracking-wide uppercase">
          <span>{value.cardName.trim() || 'Name on card'}</span>
          <span className="font-mono normal-case tracking-normal">{value.expiry || 'MM/YY'}</span>
        </div>
      </div>
      <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-3">
        <p className="text-xs font-medium text-stone-600">1-click test cards</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className={cx(secondaryButtonClass, 'px-3 py-2 text-xs')} onClick={() => onFill('success')} disabled={submitting}>
            Success · 4242
          </button>
          <button type="button" className={cx(secondaryButtonClass, 'px-3 py-2 text-xs')} onClick={() => onFill('decline')} disabled={submitting}>
            Decline · 0002
          </button>
        </div>
      </div>
      {declineMessage && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {declineMessage}
        </p>
      )}
      <Field id="cardName" label="Name on card" error={errors.cardName}>
        <input
          {...fieldProps('cardName', errors.cardName)}
          autoComplete="cc-name"
          className={fieldClass}
          value={value.cardName}
          onChange={(event) => onChange({ cardName: event.target.value })}
          disabled={submitting}
        />
      </Field>
      <Field id="cardNumber" label="Card number" error={errors.cardNumber}>
        <input
          {...fieldProps('cardNumber', errors.cardNumber)}
          inputMode="numeric"
          autoComplete="cc-number"
          spellCheck={false}
          className={cx(fieldClass, 'font-mono tracking-wide')}
          placeholder="1234 1234 1234 1234"
          value={value.cardNumber}
          onChange={(event) => onChange({ cardNumber: formatCardNumber(event.target.value) })}
          disabled={submitting}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field id="expiry" label="Expiry" error={errors.expiry}>
          <input
            {...fieldProps('expiry', errors.expiry)}
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            className={cx(fieldClass, 'font-mono')}
            value={value.expiry}
            onChange={(event) => onChange({ expiry: formatExpiry(event.target.value) })}
            disabled={submitting}
          />
        </Field>
        <Field id="cvv" label="CVV" error={errors.cvv}>
          <input
            {...fieldProps('cvv', errors.cvv)}
            inputMode="numeric"
            autoComplete="cc-csc"
            className={cx(fieldClass, 'font-mono')}
            value={value.cvv}
            onChange={(event) => onChange({ cvv: formatCvv(event.target.value) })}
            disabled={submitting}
          />
        </Field>
      </div>
      <div className="mt-8 flex gap-3">
        <button type="button" className={secondaryButtonClass} onClick={onBack} disabled={submitting}>
          Back
        </button>
        <button type="submit" className={cx(primaryButtonClass, 'flex-1')} disabled={submitting} aria-busy={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
          {submitting ? 'Processing' : `Pay ${formatMoney(total)}`}
        </button>
      </div>
    </form>
  );
}
