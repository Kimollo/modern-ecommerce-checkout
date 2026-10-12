import { useEffect, useState } from 'react';
import { Headphones, ShieldCheck, Truck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getProduct, products } from '../data/products';
import { Accordion } from '../components/Accordion';
import { ProductCard } from '../components/ProductCard';
import { ProductGallery } from '../components/ProductGallery';
import { QuantityStepper } from '../components/QuantityStepper';
import { StarRating } from '../components/StarRating';
import { StockIndicator } from '../components/StockIndicator';
import { formatMoney } from '../lib/format';
import { colorsOf, findVariant, isLightHex, modelsForColor } from '../lib/product';
import { cx, focusRing, primaryButtonClass } from '../lib/styles';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../types';

export function ProductPage() {
  const { productId } = useParams();
  const product = productId ? getProduct(productId) : undefined;

  useEffect(() => {
    document.title = product ? `${product.name} — VELA` : 'Product not found — VELA';
  }, [product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">We could not find that product.</h1>
        <p className="mt-3 text-sm text-stone-600">It may have moved. The rest of the collection is still on the shop floor.</p>
        <Link to="/" className={cx(primaryButtonClass, 'mt-8')}>
          Back to shop
        </Link>
      </div>
    );
  }

  return <ProductDetail key={product.id} product={product} />;
}

function ProductDetail({ product }: { product: Product }) {
  const first = product.variants[0];
  const [color, setColor] = useState(first.color);
  const [model, setModel] = useState(first.model);
  const [quantity, setQuantity] = useState(1);
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const cartOpen = useCartStore((state) => state.isOpen);
  const checkoutOpen = useCartStore((state) => state.checkoutOpen);

  const variant = findVariant(product, color, model);
  const colors = colorsOf(product);
  const models = modelsForColor(product, variant.color);
  const inCart = items.find((item) => item.variantId === variant.id)?.quantity ?? 0;
  const remaining = Math.max(variant.stock - inCart, 0);
  const canAdd = remaining > 0;
  const buttonLabel = variant.stock <= 0 ? 'Out of stock' : remaining <= 0 ? 'Maximum in cart' : 'Add to cart';
  const related = products.filter((item) => item.id !== product.id);

  const selectColor = (nextColor: string) => {
    const nextModels = modelsForColor(product, nextColor);
    setColor(nextColor);
    if (!nextModels.some((item) => item.model === model) && nextModels[0]) {
      setModel(nextModels[0].model);
    }
  };

  const onAdd = () => {
    if (!canAdd) return;
    const image = variant.images[0];
    addItem({
      variantId: variant.id,
      productId: product.id,
      name: product.name,
      sku: variant.sku,
      color: variant.color,
      colorHex: variant.colorHex,
      model: variant.model,
      price: variant.price,
      image: image?.src ?? '',
      imageAlt: image?.alt ?? product.name,
      maxStock: variant.stock,
      quantity: Math.min(quantity, remaining),
    });
    setQuantity(1);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
        <ol className="flex items-center gap-2">
          <li>
            <Link to="/" className="hover:text-stone-900">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-stone-900">{product.name}</li>
        </ol>
      </nav>

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery key={variant.id} images={variant.images} />
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-stone-500 uppercase">{product.category}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">{product.name}</h1>
          <p className="mt-2 text-lg text-stone-600">{product.tagline}</p>
          <div className="mt-4">
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>
          <p className="mt-5 text-2xl font-semibold tabular-nums tracking-tight">{formatMoney(variant.price)}</p>
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-stone-600">{product.description}</p>

          <ul className="mt-6 grid grid-cols-3 gap-3 border-y border-stone-200 py-4">
            {variant.highlights.map((highlight) => (
              <li key={highlight.label}>
                <p className="text-sm font-semibold text-stone-950">{highlight.value}</p>
                <p className="text-xs text-stone-500">{highlight.label}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Color</p>
              <p className="text-sm text-stone-500">{variant.color}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-3" role="group" aria-label="Color">
              {colors.map((swatch) => {
                const selected = swatch.name === variant.color;
                return (
                  <button
                    key={swatch.name}
                    type="button"
                    aria-label={swatch.name}
                    aria-pressed={selected}
                    onClick={() => selectColor(swatch.name)}
                    className={cx(
                      'size-8 rounded-full transition hover:scale-105',
                      isLightHex(swatch.hex) ? 'border border-stone-300' : 'border border-transparent',
                      selected && 'ring-2 ring-stone-950 ring-offset-2',
                      focusRing,
                    )}
                    style={{ backgroundColor: swatch.hex }}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{product.variantLabel}</p>
              <p className="text-sm text-stone-500">{variant.model}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3" role="group" aria-label={product.variantLabel}>
              {models.map((option) => {
                const selected = option.model === variant.model;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setModel(option.model)}
                    className={cx(
                      'rounded-2xl border px-4 py-3 text-left transition',
                      focusRing,
                      selected ? 'border-stone-950 bg-stone-950 text-white' : 'border-stone-300 bg-white hover:border-stone-500',
                    )}
                  >
                    <span className="block text-sm font-medium">{option.model}</span>
                    <span className={cx('mt-0.5 block text-xs tabular-nums', selected ? 'text-stone-300' : 'text-stone-500')}>
                      {formatMoney(option.price)}
                    </span>
                    {option.stock <= 0 && (
                      <span className={cx('mt-1 block text-[11px] tracking-wide uppercase', selected ? 'text-stone-400' : 'text-stone-400')}>
                        Sold out
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">{variant.detail}</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-xs tracking-wide text-stone-500">SKU {variant.sku}</p>
            <div role="status" aria-live="polite">
              <StockIndicator stock={variant.stock} />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {remaining > 0 && (
              <QuantityStepper
                value={Math.min(quantity, remaining)}
                max={remaining}
                label={product.name}
                onChange={setQuantity}
              />
            )}
            <button type="button" className={cx(primaryButtonClass, 'w-full sm:flex-1')} disabled={!canAdd} onClick={onAdd}>
              {buttonLabel}
            </button>
          </div>
          {inCart > 0 && (
            <p className="mt-3 text-sm text-stone-500">
              {inCart} already in your cart
              {remaining > 0 ? ` · ${remaining} more available` : ''}
            </p>
          )}

          <div className="mt-8">
            <Accordion
              items={[
                {
                  id: 'specs',
                  title: 'Specs',
                  icon: <Headphones className="size-4" />,
                  content: (
                    <dl className="grid gap-x-8 sm:grid-cols-2">
                      {product.specs.map((spec) => (
                        <div key={spec.label} className="flex items-baseline justify-between gap-4 border-b border-stone-100 py-2.5">
                          <dt className="text-sm text-stone-500">{spec.label}</dt>
                          <dd className="text-right text-sm font-medium text-stone-900">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ),
                },
                {
                  id: 'shipping',
                  title: 'Shipping',
                  icon: <Truck className="size-4" />,
                  content: (
                    <div className="space-y-3 text-sm leading-relaxed text-stone-600">
                      {product.shipping.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  ),
                },
                {
                  id: 'warranty',
                  title: 'Warranty',
                  icon: <ShieldCheck className="size-4" />,
                  content: (
                    <div className="space-y-3 text-sm leading-relaxed text-stone-600">
                      {product.warranty.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-xl font-semibold tracking-tight">
            Also in the studio
          </h2>
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {!cartOpen && !checkoutOpen && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 p-4 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{product.name}</p>
              <p className="text-sm tabular-nums text-stone-500">{formatMoney(variant.price)}</p>
            </div>
            <button type="button" className={cx(primaryButtonClass, 'min-w-0 flex-1')} disabled={!canAdd} onClick={onAdd}>
              {buttonLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
