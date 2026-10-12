import { SA_PROVINCES } from '../../data/provinces';
import type { ShippingDetails } from '../../types';
import { formatPostalCode } from '../../lib/format';
import type { ShippingErrors } from '../../lib/validation';
import { fieldClass, primaryButtonClass } from '../../lib/styles';
import { cx } from '../../lib/styles';
import { Field, fieldProps } from '../Field';

interface InformationStepProps {
  value: ShippingDetails;
  errors: ShippingErrors;
  onChange: (patch: Partial<ShippingDetails>) => void;
  onSubmit: () => void;
}

export function InformationStep({ value, errors, onChange, onSubmit }: InformationStepProps) {
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
        Where should we send this order? This demo keeps the address on this device only.
      </p>
      <Field id="email" label="Email" error={errors.email}>
        <input
          {...fieldProps('email', errors.email)}
          type="email"
          autoComplete="email"
          inputMode="email"
          className={fieldClass}
          value={value.email}
          onChange={(event) => onChange({ email: event.target.value })}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="firstName" label="First name" error={errors.firstName}>
          <input
            {...fieldProps('firstName', errors.firstName)}
            autoComplete="given-name"
            className={fieldClass}
            value={value.firstName}
            onChange={(event) => onChange({ firstName: event.target.value })}
          />
        </Field>
        <Field id="lastName" label="Last name" error={errors.lastName}>
          <input
            {...fieldProps('lastName', errors.lastName)}
            autoComplete="family-name"
            className={fieldClass}
            value={value.lastName}
            onChange={(event) => onChange({ lastName: event.target.value })}
          />
        </Field>
      </div>
      <Field id="address" label="Street address" error={errors.address}>
        <input
          {...fieldProps('address', errors.address)}
          autoComplete="address-line1"
          className={fieldClass}
          value={value.address}
          onChange={(event) => onChange({ address: event.target.value })}
        />
      </Field>
      <Field id="apartment" label="Apartment, suite (optional)">
        <input
          id="apartment"
          autoComplete="address-line2"
          className={fieldClass}
          value={value.apartment}
          onChange={(event) => onChange({ apartment: event.target.value })}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="city" label="City" error={errors.city}>
          <input
            {...fieldProps('city', errors.city)}
            autoComplete="address-level2"
            className={fieldClass}
            value={value.city}
            onChange={(event) => onChange({ city: event.target.value })}
          />
        </Field>
        <Field id="postalCode" label="Postal code" error={errors.postalCode} hint="4 digits, for example 2000 or 0700">
          <input
            {...fieldProps('postalCode', errors.postalCode, '4 digits, for example 2000')}
            autoComplete="postal-code"
            inputMode="numeric"
            className={fieldClass}
            value={value.postalCode}
            onChange={(event) => onChange({ postalCode: formatPostalCode(event.target.value) })}
          />
        </Field>
      </div>
      <Field id="state" label="Province" error={errors.state}>
        <select
          {...fieldProps('state', errors.state)}
          autoComplete="address-level1"
          className={fieldClass}
          value={value.state}
          onChange={(event) => onChange({ state: event.target.value })}
        >
          <option value="">Select a province</option>
          {SA_PROVINCES.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="phone" label="Phone (optional)" error={errors.phone}>
          <input
            {...fieldProps('phone', errors.phone)}
            type="tel"
            autoComplete="tel"
            className={fieldClass}
            value={value.phone}
            onChange={(event) => onChange({ phone: event.target.value })}
          />
        </Field>
        <div>
          <p className="mb-1.5 text-sm font-medium text-stone-800">Country</p>
          <p className="rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-700">South Africa</p>
        </div>
      </div>
      <button type="submit" className={cx(primaryButtonClass, 'mt-2 w-full')}>
        Continue to delivery
      </button>
    </form>
  );
}
