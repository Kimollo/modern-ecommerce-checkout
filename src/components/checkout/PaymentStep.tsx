import { Building2, CreditCard, Loader2, Lock, Smartphone } from 'lucide-react';
import type { ReactNode } from 'react';
import { SA_BANKS } from '../../data/banks';
import type { PaymentDetails, PaymentMethod } from '../../types';
import type { PaymentErrors } from '../../lib/validation';
import { cardBrand, formatCardNumber, formatCvv, formatExpiry, formatMoney, formatPhone } from '../../lib/format';
import { cx, fieldClass, focusRing, primaryButtonClass, secondaryButtonClass } from '../../lib/styles';
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

const METHODS: Array<{
  id: PaymentMethod;
  title: string;
  detail: string;
  icon: ReactNode;
}> = [
  {
    id: 'card',
    title: 'Credit / Debit Card',
    detail: 'Visa / Mastercard',
    icon: <CreditCard className="size-4" aria-hidden="true" />,
  },
  {
    id: 'eft',
    title: 'Instant EFT / Ozow',
    detail: 'Pay from your bank',
    icon: <Building2 className="size-4" aria-hidden="true" />,
  },
  {
    id: 'capitec',
    title: 'Capitec Pay',
    detail: 'Approve in the app',
    icon: <Smartphone className="size-4" aria-hidden="true" />,
  },
];

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
        Choose a payment method. This demo does not charge a real account.
      </p>
      <fieldset className="space-y-3">
        <legend className="sr-only">Payment method</legend>
        {METHODS.map((method) => {
          const selected = value.method === method.id;
          return (
            <div
              key={method.id}
              className={cx(
                'overflow-hidden rounded-2xl border bg-white transition duration-300',
                selected ? 'border-stone-950 shadow-sm' : 'border-stone-200',
              )}
            >
              <label className={cx('flex cursor-pointer items-center gap-3 px-4 py-3.5', focusRing)}>
                <input
                  type="radio"
                  name="payment-method"
                  value={method.id}
                  checked={selected}
                  disabled={submitting}
                  onChange={() => onChange({ method: method.id })}
                  className="size-4 accent-stone-950"
                />
                <span className="flex size-9 items-center justify-center rounded-full bg-stone-100 text-stone-800">{method.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-stone-950">{method.title}</span>
                  <span className="block text-xs text-stone-500">{method.detail}</span>
                </span>
                {method.id === 'card' && (
                  <span className="hidden items-center gap-1.5 sm:flex">
                    <span className="rounded-md bg-[#1a1f71] px-2 py-1 text-[10px] font-semibold tracking-wide text-white">Visa</span>
                    <span className="rounded-md bg-white px-2 py-1 text-[10px] font-semibold tracking-wide text-stone-900 ring-1 ring-stone-300">
                      Mastercard
                    </span>
                  </span>
                )}
                {method.id === 'eft' && (
                  <span className="hidden rounded-md bg-emerald-700 px-2 py-1 text-[10px] font-semibold tracking-wide text-white sm:inline">
                    Ozow
                  </span>
                )}
                {method.id === 'capitec' && (
                  <span className="hidden rounded-md bg-sky-700 px-2 py-1 text-[10px] font-semibold tracking-wide text-white sm:inline">
                    Capitec
                  </span>
                )}
              </label>
              <div
                className={cx(
                  'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
                  selected ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                )}
              >
                <div className="overflow-hidden" inert={selected ? undefined : true}>
                  <div className="border-t border-stone-200 px-4 py-4">
                    {method.id === 'card' && (
                      <CardFields
                        value={value}
                        errors={errors}
                        brand={brand}
                        declineMessage={declineMessage}
                        submitting={submitting}
                        onChange={onChange}
                        onFill={onFill}
                      />
                    )}
                    {method.id === 'eft' && (
                      <div className="space-y-3">
                        <Field id="bank" label="Bank" error={errors.bank}>
                          <select
                            {...fieldProps('bank', errors.bank)}
                            className={fieldClass}
                            value={value.bank}
                            disabled={submitting}
                            onChange={(event) => onChange({ bank: event.target.value })}
                          >
                            {SA_BANKS.map((bank) => (
                              <option key={bank} value={bank}>
                                {bank}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <p className="text-sm leading-relaxed text-stone-600">
                          You will be redirected to your bank to authorize payment.
                        </p>
                      </div>
                    )}
                    {method.id === 'capitec' && (
                      <div className="space-y-3">
                        <Field id="capitec-phone" label="Mobile number" error={errors.phone}>
                          <input
                            {...fieldProps('capitec-phone', errors.phone)}
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="082 123 4567"
                            className={cx(fieldClass, 'font-mono tracking-wide')}
                            value={value.phone}
                            disabled={submitting}
                            onChange={(event) => onChange({ phone: formatPhone(event.target.value) })}
                          />
                        </Field>
                        <p className="text-sm leading-relaxed text-stone-600">Approve the notification sent to your Capitec app.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </fieldset>
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

function CardFields({
  value,
  errors,
  brand,
  declineMessage,
  submitting,
  onChange,
  onFill,
}: {
  value: PaymentDetails;
  errors: PaymentErrors;
  brand: string;
  declineMessage: string | null;
  submitting: boolean;
  onChange: (patch: Partial<PaymentDetails>) => void;
  onFill: (kind: 'success' | 'decline') => void;
}) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}
