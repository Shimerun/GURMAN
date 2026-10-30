import { Star } from 'lucide-react';
import { REVIEW_FORMS, pluralize } from '../../lib/format';
import { cn } from '../../lib/utils';

const MAX_RATING = 5;

const ratingFormatter = new Intl.NumberFormat('uk-UA', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** @param {number} count */
const formatReviewsCount = (count) => pluralize(count, REVIEW_FORMS);

const SIZE_CLASSES = {
  sm: { star: 'h-3.5 w-3.5', text: 'text-xs' },
  lg: { star: 'h-5 w-5', text: 'text-sm' },
};

/**
 * `compact` shows a single star with the score (cards); otherwise five stars.
 * @param {{ rating: number, reviewsCount?: number, size?: keyof typeof SIZE_CLASSES, isCompact?: boolean, className?: string }} props
 */
export default function Rating({ rating, reviewsCount, size = 'sm', isCompact = false, className }) {
  const sizeClasses = SIZE_CLASSES[size];
  const label = `Рейтинг ${ratingFormatter.format(rating)} з ${MAX_RATING}${reviewsCount !== undefined ? `, ${formatReviewsCount(reviewsCount)}` : ''}`;
  const filledStars = Math.round(rating);

  return (
    // aria-label is ignored on a plain <p>, so the spoken version is real (visually hidden) text.
    <p className={cn('flex items-center gap-1.5', sizeClasses.text, className)}>
      <span className="sr-only">{label}</span>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {isCompact ? (
          <Star className={cn(sizeClasses.star, 'fill-amber-400 text-amber-400')} />
        ) : (
          Array.from({ length: MAX_RATING }, (_, index) => (
            <Star
              key={index}
              className={cn(sizeClasses.star, index < filledStars ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200')}
            />
          ))
        )}
      </span>
      <span className="font-semibold tabular-nums text-slate-800" aria-hidden="true">
        {ratingFormatter.format(rating)}
      </span>
      {reviewsCount !== undefined && (
        <span className="text-slate-500" aria-hidden="true">
          ({isCompact ? reviewsCount : formatReviewsCount(reviewsCount)})
        </span>
      )}
    </p>
  );
}
