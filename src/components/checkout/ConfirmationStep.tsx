import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { OrderSummary } from '../../types';
import { deliveryLabel } from '../../lib/delivery';
import { VAT_LABEL } from '../../lib/pricing';
import { formatDateTime, formatMoney } from '../../lib/format';
import { cx, focusRing, primaryButtonClass } from '../../lib/styles';
import { ProductImage } from '../ProductImage';

export function ConfirmationStep({ order, onDone }: { order: OrderSummary; onDone: () => void }) {
  const [copied, setCopied] = useState(false);
  const address = order.shippingDetails;
  const street = address.apartment ? `${address.address}, ${address.apartment}` : address.address;

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(order.orderId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex size-14 items-center justify-center rounded-full bg-stone-950 text-white">
        <Check className="size-6" aria-hidden="true" />
      </div>
      <p className="mt-5 text-sm text-stone-500">A receipt for {address.email}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="font-mono text-sm tracking-wide text-stone-900">{order.orderId}</p>
        <button
          type="button"
          onClick={() => void copyId()}
          className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-stone-600 hover:bg-stone-100', focusRing)}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="mt-2 text-xs text-stone-500">Placed {formatDateTime(order.placedAt)}</p>

      <dl className="mt-8 grid gap-4 rounded-2xl bg-stone-50 p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium tracking-wide text-stone-500 uppercase">Delivery</dt>
          <dd className="mt-1 font-medium text-stone-900">{deliveryLabel(order.deliveryMethod)}</dd>
          <dd className="text-stone-600">Arrives {order.estimatedDelivery}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium tracking-wide text-stone-500 uppercase">
            {order.deliveryMethod === 'locker' ? 'Collection contact' : 'Deliver to'}
          </dt>
          <dd className="mt-1 text-stone-900">
            {address.firstName} {address.lastName}
          </dd>
          <dd className="text-stone-600">{street}</dd>
          <dd className="text-stone-600">
            {address.city}, {address.state} {address.postalCode}
          </dd>
          <dd className="text-stone-600">{address.country}</dd>
        </div>
      </dl>

      <ul className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
        {order.items.map((item) => (
          <li key={item.variantId} className="flex items-center gap-3 py-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-stone-100">
              <ProductImage src={item.image} alt={item.imageAlt} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="truncate text-xs text-stone-500">
                {item.color} · {item.model} · Qty {item.quantity}
              </p>
              <p className="font-mono text-[11px] text-stone-400">{item.sku}</p>
            </div>
            <p className="text-sm font-medium tabular-nums">{formatMoney(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 text-sm">
        <Line label="Subtotal" value={formatMoney(order.subtotal)} />
        {order.discount > 0 && (
          <Line label={`Promo ${order.promoCode}`} value={`-${formatMoney(order.discount)}`} valueClassName="text-emerald-800" />
        )}
        <Line label={deliveryLabel(order.deliveryMethod)} value={order.shipping === 0 ? 'Free' : formatMoney(order.shipping)} />
        <div className="border-t border-stone-200 pt-2">
          <Line label="Total paid" value={formatMoney(order.total)} strong />
        </div>
        <Line label={VAT_LABEL} value={formatMoney(order.tax)} valueClassName="text-stone-500" />
      </dl>
      <p className="mt-3 text-xs text-stone-500">{paymentLine(order)} This is a simulated charge.</p>
      <button type="button" className={cx(primaryButtonClass, 'mt-8 w-full')} onClick={onDone}>
        Continue shopping
      </button>
    </div>
  );
}

function paymentLine(order: OrderSummary) {
  if (order.paymentMethod === 'eft') return `Paid with Instant EFT / Ozow (${order.paymentDetail}).`;
  if (order.paymentMethod === 'capitec') return `Paid with Capitec Pay (${order.paymentDetail}).`;
  return `Paid with Credit / Debit Card (${order.paymentDetail}) ending ${order.paymentLast4}.`;
}

function Line({
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
    <div className={cx('flex items-baseline justify-between gap-4', strong && 'text-base font-semibold')}>
      <dt className={strong ? '' : 'text-stone-600'}>{label}</dt>
      <dd className={cx('tabular-nums', valueClassName)}>{value}</dd>
    </div>
  );
}
