import { Star } from 'lucide-react';
import { cx } from '../lib/styles';

interface StarRatingProps {
  rating: number;
  count?: number;
  tone?: 'dark' | 'light';
}

export function StarRating({ rating, count, tone = 'dark' }: StarRatingProps) {
  const empty = tone === 'light' ? 'text-white/35' : 'text-stone-300';
  const fill = tone === 'light' ? 'fill-white text-white' : 'fill-stone-900 text-stone-900';
  const meta = tone === 'light' ? 'text-white/75' : 'text-stone-500';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex" role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, index) => {
          const amount = Math.min(1, Math.max(0, rating - index));
          return (
            <span key={index} className="relative inline-block size-4" aria-hidden="true">
              <Star className={cx('absolute inset-0 size-4', empty)} strokeWidth={1.5} />
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${amount * 100}%` }}>
                <Star className={cx('size-4', fill)} strokeWidth={1.5} />
              </span>
            </span>
          );
        })}
      </div>
      {count != null && (
        <p className={cx('text-sm', meta)}>
          {rating.toFixed(1)} · {count.toLocaleString()} reviews
        </p>
      )}
    </div>
  );
}
