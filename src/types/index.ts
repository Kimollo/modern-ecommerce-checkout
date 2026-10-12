export interface Highlight {
  label: string;
  value: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  color: string;
  colorHex: string;
  model: string;
  price: number;
  stock: number;
  detail: string;
  highlights: Highlight[];
  images: ProductImage[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  variantLabel: string;
  specs: ProductSpec[];
  shipping: string[];
  warranty: string[];
  variants: ProductVariant[];
}

export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  sku: string;
  color: string;
  colorHex: string;
  model: string;
  price: number;
  quantity: number;
  image: string;
  imageAlt: string;
  maxStock: number;
}

export interface ShippingDetails {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export type DeliveryMethod = 'standard' | 'express' | 'locker';

export interface PaymentDetails {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface OrderSummary {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  promoCode: string | null;
  tax: number;
  shipping: number;
  total: number;
  deliveryMethod: DeliveryMethod;
  shippingDetails: ShippingDetails;
  estimatedDelivery: string;
  placedAt: string;
  paymentLast4: string;
}
