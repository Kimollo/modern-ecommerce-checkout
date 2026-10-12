import { ShoppingBag } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { cx, focusRing } from '../lib/styles';

export function Header() {
  const count = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  const isOpen = useCartStore((state) => state.isOpen);
  const openCart = useCartStore((state) => state.openCart);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className={cx('flex items-center gap-2.5 rounded-full', focusRing)} end>
          <span className="flex size-8 items-center justify-center rounded-full bg-stone-950 text-xs font-semibold text-white">
            V
          </span>
          <span className="text-sm font-semibold tracking-[0.2em] text-stone-950">VELA</span>
        </NavLink>
        <nav aria-label="Primary" className="flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cx(
                'rounded-full px-3 py-2 text-sm font-medium',
                focusRing,
                isActive ? 'text-stone-950' : 'text-stone-500 hover:text-stone-900',
              )
            }
          >
            Shop
          </NavLink>
          <button
            id="cart-button"
            type="button"
            onClick={openCart}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}
            className={cx('relative flex size-11 items-center justify-center rounded-full hover:bg-stone-200/70', focusRing)}
          >
            <ShoppingBag className="size-5" strokeWidth={1.75} />
            {count > 0 && (
              <span
                key={count}
                className="absolute right-1 top-1 flex h-4 min-w-4 animate-[pop_280ms_ease-out] items-center justify-center rounded-full bg-stone-950 px-1 text-[10px] font-semibold text-white"
              >
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
