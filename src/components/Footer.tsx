import { useLocation } from 'react-router-dom';
import { cx } from '../lib/styles';

export function Footer() {
  const { pathname } = useLocation();
  const productPage = pathname.startsWith('/product');

  return (
    <footer className={cx('border-t border-stone-200 py-8 text-center text-xs text-stone-500', productPage && 'mb-24 lg:mb-0')}>
      VELA is a demo storefront. Payments are simulated and nothing is charged.
    </footer>
  );
}
