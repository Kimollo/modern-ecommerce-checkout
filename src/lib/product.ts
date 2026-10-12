import type { Product, ProductVariant } from '../types';
import { formatMoney } from './format';

export function previewVariant(product: Product): ProductVariant {
  return product.variants.find((variant) => variant.stock > 0) ?? product.variants[0];
}

export function colorsOf(product: Product) {
  const colors: { name: string; hex: string }[] = [];
  for (const variant of product.variants) {
    if (!colors.some((color) => color.name === variant.color)) {
      colors.push({ name: variant.color, hex: variant.colorHex });
    }
  }
  return colors;
}

export function modelsForColor(product: Product, color: string) {
  return product.variants.filter((variant) => variant.color === color);
}

export function findVariant(product: Product, color: string, model: string) {
  return (
    product.variants.find((variant) => variant.color === color && variant.model === model) ??
    product.variants.find((variant) => variant.color === color) ??
    product.variants[0]
  );
}

export function priceLabel(product: Product) {
  const amounts = product.variants.map((variant) => variant.price);
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  return min === max ? formatMoney(min) : `From ${formatMoney(min)}`;
}

export function stockMessage(stock: number): { text: string; tone: 'out' | 'low' | 'ok' } {
  if (stock <= 0) return { text: 'Out of stock', tone: 'out' };
  if (stock === 1) return { text: 'Only 1 left in stock', tone: 'low' };
  if (stock <= 5) return { text: `Only ${stock} left in stock`, tone: 'low' };
  return { text: 'In stock', tone: 'ok' };
}

export function isLightHex(hex: string) {
  const value = hex.replace('#', '');
  if (value.length !== 6) return false;
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  if ([red, green, blue].some((channel) => Number.isNaN(channel))) return false;
  return (red * 299 + green * 587 + blue * 114) / 1000 > 170;
}
