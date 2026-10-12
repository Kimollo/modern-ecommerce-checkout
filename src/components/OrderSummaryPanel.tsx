import type { DeliveryMethod } from '../types';
import { formatMoney } from '../lib/format';
import { priceCart } from '../lib/pricing';
import { deliveryLabel } from '../lib/delivery';
import { useCartStore } from '../store/cartStore';
import { ProductImage } from './ProductImage';
import { PriceBreakdownList } from './PriceBreakdownList';
import { PromoCodeField } from './PromoCodeField';

export function OrderSummaryPanel({ delivery }: { delivery: DeliveryMethod }) {
  const items = useCartStore((state) => state.items);
  const promoCode = useCartStore((state) => state.promoCode);
  const breakdown = priceCart(items, promoCode, delivery);

  return (
    <div>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.variantId} className="flex gap-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-white">
              <ProductImage src={item.image} alt={item.imageAlt} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-stone-900">{item.name}</p>
              <p className="truncate text-xs text-stone-500">
                {item.color} · {item.model} · Qty {item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium tabular-nums text-stone-900">{formatMoney(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-5 space-y-4">
        <PromoCodeField />
        <PriceBreakdownList breakdown={breakdown} shippingLabel={deliveryLabel(delivery)} />
      </div>
    </div>
  );
}
