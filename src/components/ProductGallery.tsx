import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductImage as GalleryImage } from '../types';
import { cx, focusRing } from '../lib/styles';
import { ProductImage } from './ProductImage';

export function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) return null;

  const showPrevious = () => setActive((index) => (index - 1 + images.length) % images.length);
  const showNext = () => setActive((index) => (index + 1) % images.length);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-stone-200">
        <ProductImage src={current.src} alt={current.alt} loading="eager" />
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={showPrevious}
              className={cx(
                'absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-900 shadow-md backdrop-blur transition hover:bg-white',
                focusRing,
              )}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={showNext}
              className={cx(
                'absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-900 shadow-md backdrop-blur transition hover:bg-white',
                focusRing,
              )}
            >
              <ChevronRight className="size-5" />
            </button>
            <p className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium tabular-nums text-stone-700">
              {active + 1} / {images.length}
            </p>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1" role="list" aria-label="Product images">
          {images.map((image, index) => {
            const selected = index === active;
            return (
              <button
                key={image.src + index}
                type="button"
                role="listitem"
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-current={selected}
                onClick={() => setActive(index)}
                className={cx(
                  'relative size-16 shrink-0 overflow-hidden rounded-xl bg-stone-200 sm:size-20',
                  selected ? 'ring-2 ring-stone-950 ring-offset-2' : 'opacity-80 hover:opacity-100',
                  focusRing,
                )}
              >
                <ProductImage src={image.src} alt="" loading="lazy" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
