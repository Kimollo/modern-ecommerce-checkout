import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { colorsOf, previewVariant, priceLabel } from '../lib/product';
import { ProductImage } from './ProductImage';
import { StarRating } from './StarRating';

export function ProductCard({ product }: { product: Product }) {
  const preview = previewVariant(product);
  const image = preview.images[0];

  return (
    <Link to={`/product/${product.id}`} className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-stone-200">
        {image && (
          <ProductImage src={image.src} alt={image.alt} className="group-hover:scale-[1.03]" />
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-[0.16em] text-stone-500 uppercase">{product.category}</p>
          <h2 className="mt-1 text-base font-medium text-stone-950">{product.name}</h2>
          <p className="mt-0.5 text-sm text-stone-500">{product.tagline}</p>
        </div>
        <p className="shrink-0 text-sm font-medium tabular-nums text-stone-900">{priceLabel(product)}</p>
      </div>
      <div className="mt-3">
        <StarRating rating={product.rating} count={product.reviewCount} />
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {colorsOf(product).map((color) => (
          <span
            key={color.name}
            title={color.name}
            className="size-3 rounded-full border border-black/10"
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
    </Link>
  );
}
