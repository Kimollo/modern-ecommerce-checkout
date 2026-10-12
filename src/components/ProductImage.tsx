import { useLayoutEffect, useRef, useState } from 'react';
import { Headphones } from 'lucide-react';
import { cx } from '../lib/styles';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function ProductImage({ src, alt, className, loading = 'lazy' }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [seenSrc, setSeenSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  if (src !== seenSrc) {
    setSeenSrc(src);
    setFailed(false);
    setLoaded(false);
  }

  useLayoutEffect(() => {
    const image = imgRef.current;
    if (!image) return;
    if (!image.complete) return;
    if (image.naturalWidth > 0) setLoaded(true);
    else setFailed(true);
  }, [src, failed]);

  if (failed) {
    return (
      <div
        className="flex h-full min-h-full w-full items-center justify-center bg-gradient-to-br from-stone-200 via-stone-100 to-stone-300"
        role="img"
        aria-label={alt}
      >
        <Headphones className="size-12 text-stone-500" strokeWidth={1.25} />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-stone-200" aria-hidden="true" />}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cx(
          'absolute inset-0 h-full w-full object-cover transition duration-700',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
      />
    </div>
  );
}
