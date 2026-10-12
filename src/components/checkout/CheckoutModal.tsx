import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { DeliveryMethod, OrderSummary, PaymentDetails, ShippingDetails } from '../../types';
import { estimateDelivery } from '../../lib/delivery';
import { cardBrand, createOrderId, formatCardNumber, formatMoney } from '../../lib/format';
import { priceCart } from '../../lib/pricing';
import { cx, focusRing } from '../../lib/styles';
import {
  DECLINE_CARD,
  SUCCESS_CARD,
  hasFieldErrors,
  isDeclineCard,
  validatePayment,
  validateShipping,
  type PaymentErrors,
  type ShippingErrors,
} from '../../lib/validation';
import { useCartStore } from '../../store/cartStore';
import { useBodyLock } from '../../hooks/useBodyLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { OrderSummaryPanel } from '../OrderSummaryPanel';
import { ConfirmationStep } from './ConfirmationStep';
import { DeliveryStep } from './DeliveryStep';
import { InformationStep } from './InformationStep';
import { PaymentStep } from './PaymentStep';
import { StepIndicator, type CheckoutStep } from './StepIndicator';

const EMPTY_SHIPPING: ShippingDetails = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'South Africa',
  phone: '',
};

const EMPTY_PAYMENT: PaymentDetails = {
  method: 'card',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  bank: 'Capitec',
  phone: '',
};

const TITLES: Record<CheckoutStep, string> = {
  1: 'Customer information',
  2: 'Delivery method',
  3: 'Payment',
  4: 'Thank you',
};

function trimShipping(details: ShippingDetails): ShippingDetails {
  return {
    email: details.email.trim(),
    firstName: details.firstName.trim(),
    lastName: details.lastName.trim(),
    address: details.address.trim(),
    apartment: details.apartment.trim(),
    city: details.city.trim(),
    state: details.state,
    postalCode: details.postalCode.trim(),
    country: details.country,
    phone: details.phone.trim(),
  };
}

export function CheckoutModal() {
  const navigate = useNavigate();
  const checkoutOpen = useCartStore((state) => state.checkoutOpen);
  const items = useCartStore((state) => state.items);
  const promoCode = useCartStore((state) => state.promoCode);
  const closeCheckout = useCartStore((state) => state.closeCheckout);
  const clearCart = useCartStore((state) => state.clearCart);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const placingOrder = useRef(false);

  const [step, setStep] = useState<CheckoutStep>(1);
  const [shipping, setShipping] = useState<ShippingDetails>({ ...EMPTY_SHIPPING });
  const [shippingErrors, setShippingErrors] = useState<ShippingErrors>({});
  const [delivery, setDelivery] = useState<DeliveryMethod>('standard');
  const [payment, setPayment] = useState<PaymentDetails>({ ...EMPTY_PAYMENT });
  const [paymentErrors, setPaymentErrors] = useState<PaymentErrors>({});
  const [declineMessage, setDeclineMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<OrderSummary | null>(null);

  const breakdown = priceCart(items, promoCode, delivery);

  useBodyLock(checkoutOpen);
  useFocusTrap(checkoutOpen, panelRef, false);

  useEffect(() => {
    if (checkoutOpen && !wasOpen.current) {
      placingOrder.current = false;
      setStep(1);
      setOrder(null);
      setDeclineMessage(null);
      setSubmitting(false);
    }
    wasOpen.current = checkoutOpen;
  }, [checkoutOpen]);

  useEffect(() => {
    if (!checkoutOpen) return;
    headingRef.current?.focus();
    scrollRef.current?.scrollTo({ top: 0 });
  }, [checkoutOpen, step]);

  useEffect(() => {
    if (checkoutOpen && items.length === 0 && !order && !placingOrder.current) closeCheckout();
  }, [checkoutOpen, items.length, order, closeCheckout]);

  useEffect(() => {
    if (!checkoutOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const focusCartButton = () => {
    window.requestAnimationFrame(() => document.getElementById('cart-button')?.focus());
  };

  const requestClose = () => {
    if (submitting) return;
    closeCheckout();
    focusCartButton();
  };

  const updateShipping = (patch: Partial<ShippingDetails>) => {
    setShipping((current) => ({ ...current, ...patch }));
    setShippingErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch) as (keyof ShippingErrors)[]) delete next[key];
      return next;
    });
  };

  const updatePayment = (patch: Partial<PaymentDetails>) => {
    setPayment((current) => ({ ...current, ...patch }));
    setDeclineMessage(null);
    if (patch.method) {
      setPaymentErrors({});
      return;
    }
    setPaymentErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch) as (keyof PaymentErrors)[]) delete next[key];
      return next;
    });
  };

  const continueToDelivery = () => {
    const next = validateShipping(shipping);
    setShippingErrors(next);
    if (!hasFieldErrors(next)) setStep(2);
  };

  const continueToPayment = () => {
    setPayment((current) => ({
      ...current,
      cardName: current.cardName.trim() || `${shipping.firstName} ${shipping.lastName}`.trim(),
    }));
    setStep(3);
  };

  const fillCard = (kind: 'success' | 'decline') => {
    setPayment({
      ...payment,
      method: 'card',
      cardName: payment.cardName.trim() || `${shipping.firstName} ${shipping.lastName}`.trim() || 'Alex Morgan',
      cardNumber: formatCardNumber(kind === 'success' ? SUCCESS_CARD : DECLINE_CARD),
      expiry: '12/30',
      cvv: '123',
    });
    setPaymentErrors({});
    setDeclineMessage(null);
  };

  const pay = async () => {
    const nextErrors = validatePayment(payment);
    setPaymentErrors(nextErrors);
    setDeclineMessage(null);
    if (hasFieldErrors(nextErrors)) return;

    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    if (!useCartStore.getState().checkoutOpen) {
      setSubmitting(false);
      return;
    }
    if (payment.method === 'card' && isDeclineCard(payment.cardNumber)) {
      setSubmitting(false);
      setDeclineMessage('This card was declined. Use the demo success card 4242 4242 4242 4242, or any other valid number.');
      return;
    }

    placingOrder.current = true;
    const currentItems = useCartStore.getState().items;
    const currentPromo = useCartStore.getState().promoCode;
    const priced = priceCart(currentItems, currentPromo, delivery);
    const summary: OrderSummary = {
      orderId: createOrderId(),
      items: currentItems.map((item) => ({ ...item })),
      subtotal: priced.subtotal,
      discount: priced.discount,
      promoCode: priced.promoCode,
      tax: priced.tax,
      shipping: priced.shipping,
      total: priced.total,
      deliveryMethod: delivery,
      shippingDetails: trimShipping(shipping),
      estimatedDelivery: estimateDelivery(delivery),
      placedAt: new Date().toISOString(),
      paymentMethod: payment.method,
      paymentDetail:
        payment.method === 'card' ? cardBrand(payment.cardNumber) : payment.method === 'eft' ? payment.bank : payment.phone.trim(),
      paymentLast4: payment.method === 'card' ? payment.cardNumber.replace(/\D/g, '').slice(-4) : '',
    };
    setOrder(summary);
    setStep(4);
    setPayment({ ...EMPTY_PAYMENT });
    clearCart();
    setSubmitting(false);
  };

  const finish = () => {
    setShipping({ ...EMPTY_SHIPPING });
    setPayment({ ...EMPTY_PAYMENT });
    setDelivery('standard');
    setShippingErrors({});
    setPaymentErrors({});
    setOrder(null);
    setStep(1);
    closeCheckout();
    navigate('/');
    focusCartButton();
  };

  return (
    <div
      className={cx(
        'fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4',
        checkoutOpen ? '' : 'pointer-events-none',
      )}
      aria-hidden={!checkoutOpen}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close checkout"
        className={cx('absolute inset-0 bg-stone-950/45 transition-opacity duration-300', checkoutOpen ? 'opacity-100' : 'opacity-0')}
        onClick={requestClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        inert={checkoutOpen ? undefined : true}
        className={cx(
          'relative z-10 flex max-h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl outline-none transition duration-300 sm:max-h-[min(880px,92vh)] sm:max-w-4xl sm:rounded-3xl',
          checkoutOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0',
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-5 py-4 sm:px-8">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-stone-500 uppercase">Checkout</p>
            <h2 id={titleId} ref={headingRef} tabIndex={-1} className="mt-1 text-lg font-semibold tracking-tight outline-none">
              {TITLES[step]}
            </h2>
          </div>
          <button
            type="button"
            onClick={requestClose}
            disabled={submitting}
            aria-label="Close checkout"
            className={cx('flex size-10 items-center justify-center rounded-full hover:bg-stone-100 disabled:opacity-40', focusRing)}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="border-b border-stone-100 px-5 py-3 sm:px-8">
          <StepIndicator current={step} onSelect={setStep} />
        </div>

        {step < 4 ? (
          <>
            <details className="group border-b border-stone-200 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                <span>Order summary</span>
                <span className="flex items-center gap-2 text-stone-500">
                  {formatMoney(breakdown.total)}
                  <ChevronDown className="size-4 transition group-open:rotate-180" aria-hidden="true" />
                </span>
              </summary>
              <div className="px-5 pb-5">
                <OrderSummaryPanel delivery={delivery} />
              </div>
            </details>
            <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div ref={scrollRef} className="min-h-0 overflow-y-auto px-5 py-6 sm:px-8">
                {step === 1 && (
                  <InformationStep value={shipping} errors={shippingErrors} onChange={updateShipping} onSubmit={continueToDelivery} />
                )}
                {step === 2 && (
                  <DeliveryStep
                    value={delivery}
                    subtotal={breakdown.subtotal}
                    onChange={setDelivery}
                    onBack={() => setStep(1)}
                    onSubmit={continueToPayment}
                  />
                )}
                {step === 3 && (
                  <PaymentStep
                    value={payment}
                    errors={paymentErrors}
                    declineMessage={declineMessage}
                    submitting={submitting}
                    total={breakdown.total}
                    onChange={updatePayment}
                    onFill={fillCard}
                    onBack={() => setStep(2)}
                    onSubmit={() => void pay()}
                  />
                )}
              </div>
              <aside className="hidden min-h-0 overflow-y-auto border-stone-200 bg-stone-50 px-5 py-6 lg:block lg:border-l">
                <h3 className="mb-4 text-sm font-semibold text-stone-900">Your order</h3>
                <OrderSummaryPanel delivery={delivery} />
              </aside>
            </div>
          </>
        ) : (
          order && (
            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-8">
              <ConfirmationStep order={order} onDone={finish} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
