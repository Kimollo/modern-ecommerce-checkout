# VELA

Demo storefront for premium audio, localized for South Africa. Browse the collection, keep a cart in the browser, apply `SAVE10`, and finish a mock checkout in rand.

**Live site:** [https://modern-ecommerce-checkout.vercel.app/](https://modern-ecommerce-checkout.vercel.app/)

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build
npm run preview
```

## Checkout notes

Prices are VAT-inclusive (15%). Door-to-door delivery is R100, and free on orders over R1,000. Express courier is R180. Pargo locker pick-up is R80.

`SAVE10` takes 10% off the item subtotal before VAT is recalculated. Any other code is rejected.

Payment is simulated. Nothing is charged.

- Card: `4242 4242 4242 4242` succeeds. `4000 0000 0000 0002` is declined. Use expiry `12/30` and CVV `123`.
- Instant EFT / Ozow: pick a South African bank.
- Capitec Pay: enter a 10-digit mobile number.
