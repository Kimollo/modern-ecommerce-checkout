# VELA — Premium Audio Storefront & Checkout

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://modern-ecommerce-checkout.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![State Management](https://img.shields.io/badge/State-Zustand-orange?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![Localization](https://img.shields.io/badge/Localization-South%20Africa%20(ZAR)-green?style=for-the-badge)](https://en.wikipedia.org/wiki/South_African_rand)

A modern, responsive e-commerce storefront for premium audio hardware, tailored specifically for the South African retail market. Features persistent client-side cart synchronization, dynamic VAT and shipping calculations, promo voucher evaluation, and a localized multi-step checkout funnel.

---

## 🌐 Live Application

* **Production URL:** [https://modern-ecommerce-checkout.vercel.app/](https://modern-ecommerce-checkout.vercel.app/)

---

## 🇿🇦 South African Localization & Checkout Rules

### Pricing & Delivery Structure
* **Currency & VAT:** All catalog prices are formatted in South African Rand (`R`) and include 15% VAT.
* **Promo Code Engine:** Applying code `SAVE10` deducts 10% from the item subtotal before VAT is recalculated. Unrecognized codes are rejected with real-time feedback.
* **Delivery Methods:**
  * **Standard Door-to-Door Courier:** R100.00 *(Free on orders exceeding R1,000.00)*
  * **Express Courier (1–2 days):** R180.00
  * **Pargo / Locker Pick-up:** R80.00

### Simulated Payment Rails
*Transactions are simulated client-side—no live cards are charged.*

| Payment Method | Validation & Flow | Test Credentials |
| :--- | :--- | :--- |
| **Credit / Debit Card** | Real-time card formatting with pass/decline outcomes | **Approved:** `4242 4242 4242 4242`<br>**Declined:** `4000 0000 0000 0002`<br>**Expiry:** `12/30` \| **CVV:** `123` |
| **Instant EFT (Ozow)** | Interactive bank selection modal | Select any SA bank (Capitec, FNB, Standard Bank, Nedbank, Absa) |
| **Capitec Pay** | Push authorization prompt simulation | Enter any valid 10-digit mobile number |

---

## ✨ Architectural Highlights

* **State Synchronization:** Cart items, quantities, and applied voucher codes automatically persist across sessions using Zustand backed by `localStorage`.
* **Form Validation:** Multi-step customer address flow covering all 9 South African provinces and 4-digit postal code patterns.
* **UI Components:** Slide-over cart drawer, responsive product variant selectors, and modular checkout modal steps built with Tailwind CSS and Lucide icons.

---

## 💻 Local Setup

```bash
# Clone the repository
git clone https://github.com/Kimollo/modern-ecommerce-checkout.git
cd modern-ecommerce-checkout

# Install dependencies
npm install

# Start development server
npm run dev
```
