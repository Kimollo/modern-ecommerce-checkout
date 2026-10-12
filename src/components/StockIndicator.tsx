import { stockMessage } from '../lib/product';
import { cx } from '../lib/styles';

export function StockIndicator({ stock }: { stock: number }) {
  const status = stockMessage(stock);
  const dot = status.tone === 'out' ? 'bg-red-600' : status.tone === 'low' ? 'bg-amber-500' : 'bg-emerald-600';
  const text = status.tone === 'out' ? 'text-red-700' : status.tone === 'low' ? 'text-amber-900' : 'text-emerald-800';

  return (
    <span className={cx('inline-flex items-center gap-2 text-sm font-medium', text)}>
      <span className={cx('size-1.5 rounded-full', dot)} aria-hidden="true" />
      {status.text}
    </span>
  );
}
