import { VAT_LABEL, type PriceBreakdown } from '../lib/pricing';
import { formatMoney } from '../lib/format';
import { cx } from '../lib/styles';

interface PriceBreakdownListProps {
  breakdown: PriceBreakdown;
  shippingLabel: string;
  taxLabel?: string;
  emphasizeTotal?: boolean;
}

export function PriceBreakdownList({
  breakdown,
  shippingLabel,
  taxLabel = VAT_LABEL,
  emphasizeTotal = true,
}: PriceBreakdownListProps) {
  return (
    <dl className="space-y-2 text-sm">
      <Row label="Subtotal" value={formatMoney(breakdown.subtotal)} />
      {breakdown.discount > 0 && (
        <Row
          label={`Promo ${breakdown.promoCode}`}
          value={`-${formatMoney(breakdown.discount)}`}
          valueClassName="text-emerald-800"
        />
      )}
      <Row label={shippingLabel} value={breakdown.shipping === 0 ? 'Free' : formatMoney(breakdown.shipping)} />
      <div className="border-t border-stone-200 pt-2">
        <Row label="Total" value={formatMoney(breakdown.total)} strong={emphasizeTotal} />
      </div>
      <Row label={taxLabel} value={formatMoney(breakdown.tax)} valueClassName="text-stone-500" />
    </dl>
  );
}

function Row({
  label,
  value,
  strong = false,
  valueClassName,
}: {
  label: string;
  value: string;
  strong?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className={cx('flex items-baseline justify-between gap-4', strong && 'text-base font-semibold text-stone-950')}>
      <dt className={strong ? '' : 'text-stone-600'}>{label}</dt>
      <dd className={cx('tabular-nums', valueClassName)}>{value}</dd>
    </div>
  );
}
