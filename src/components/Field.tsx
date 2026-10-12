import type { ReactNode } from 'react';

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

export function describedBy(id: string, error?: string, hint?: string) {
  const ids = [error ? `${id}-error` : null, !error && hint ? `${id}-hint` : null].filter(Boolean);
  return ids.length > 0 ? ids.join(' ') : undefined;
}

export function Field({ id, label, error, hint, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-stone-800">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-stone-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function fieldProps(id: string, error?: string, hint?: string) {
  return {
    id,
    'aria-invalid': Boolean(error) || undefined,
    'aria-describedby': describedBy(id, error, hint),
  };
}
