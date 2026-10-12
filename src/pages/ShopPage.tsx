import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { formatMoney } from '../lib/format';
import { FREE_SHIPPING_THRESHOLD } from '../lib/pricing';
import { priceLabel, previewVariant } from '../lib/product';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import { StarRating } from '../components/StarRating';

export function ShopPage() {
  const featured = products[0];

  useEffect(() => {
    document.title = 'VELA — Sound, refined';
  }, []);

  if (!featured) return null;
  const image = previewVariant(featured).images[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="max-w-3xl">
        <p className="text-xs font-medium tracking-[0.22em] text-stone-500 uppercase">The collection</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 sm:text-6xl">Sound, pared back to what matters.</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone-600">
          Headphones, speakers, and amplification, finished in small batches. Free door-to-door delivery on orders over{' '}
          {formatMoney(FREE_SHIPPING_THRESHOLD)}.
        </p>
      </section>

      <Link
        to={`/product/${featured.id}`}
        className="group mt-10 grid overflow-hidden rounded-[2rem] bg-stone-950 text-white lg:grid-cols-2"
      >
        <div className="flex flex-col justify-end p-8 sm:p-12 lg:p-14">
          <p className="text-xs font-medium tracking-[0.2em] text-stone-400 uppercase">{featured.category}</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{featured.name}</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-stone-300">{featured.tagline}</p>
          <div className="mt-5">
            <StarRating rating={featured.rating} count={featured.reviewCount} tone="light" />
          </div>
          <p className="mt-5 text-sm text-stone-300">{priceLabel(featured)}</p>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
            Shop {featured.name}
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
        <div className="relative min-h-[280px] overflow-hidden sm:min-h-[420px]">
          {image && <ProductImage src={image.src} alt={image.alt} loading="eager" className="group-hover:scale-[1.03]" />}
        </div>
      </Link>

      <section className="mt-16" aria-labelledby="catalog-heading">
        <h2 id="catalog-heading" className="text-xl font-semibold tracking-tight text-stone-950">
          All pieces
        </h2>
        <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
