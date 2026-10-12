import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { formatMoney } from './lib/format';
import { FREE_SHIPPING_THRESHOLD } from './lib/pricing';
import { focusRing } from './lib/styles';
import { ProductPage } from './pages/ProductPage';
import { ShopPage } from './pages/ShopPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-canvas text-stone-900">
        <a
          href="#main"
          className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[80] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 ${focusRing}`}
        >
          Skip to content
        </a>
        <div className="bg-stone-950 px-4 py-2 text-center text-xs text-stone-100">
          Free door-to-door delivery on orders over {formatMoney(FREE_SHIPPING_THRESHOLD)}. Use code{' '}
          <span className="font-semibold tracking-wide">SAVE10</span> for 10% off.
        </div>
        <Header />
        <main id="main">
          <Routes>
            <Route path="/" element={<ShopPage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="*" element={<ShopPage />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
        <CheckoutModal />
        <Toast />
      </div>
    </BrowserRouter>
  );
}
