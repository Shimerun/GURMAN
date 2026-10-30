import { cn } from '../../lib/utils';
import BrandMark from './BrandMark';

/** @typedef {'empty' | 'spilled' | 'filled' | 'loading'} BasketIllustrationVariant */

/** @param {{ className?: string }} props */
function EmptyBasket({ className }) {
  return (
    <span aria-hidden="true" className={cn('grid h-24 w-24 place-items-center rounded-full bg-emerald-50', className)}>
      <BrandMark isEmpty className="basket-sway h-16 w-16" />
    </span>
  );
}

/**
 * Tipped-over basket with its orange rolled out: "nothing here".
 * @param {{ className?: string }} props
 */
function SpilledBasket({ className }) {
  return (
    <span aria-hidden="true" className={cn('relative block h-24 w-32', className)}>
      <span className="absolute inset-y-0 left-2 w-24 rounded-full bg-emerald-50" />
      <BrandMark isEmpty className="basket-tipped absolute left-3 top-2 h-20 w-20" />
      <svg viewBox="0 0 20 20" className="basket-orange-roll absolute bottom-1 right-0 h-8 w-8" focusable="false">
        <circle cx="10" cy="11" r="8" className="fill-amber-400" />
        <path d="M11 3.4c1-2 3.2-2.9 5.3-2.3-1 1.9-3.2 2.9-5.3 2.3z" className="fill-emerald-500" />
      </svg>
    </span>
  );
}

/**
 * Basket filling up, then the logo swoosh drawn under it (reuses the logo intro sequence).
 * @param {{ className?: string }} props
 */
function FilledBasket({ className }) {
  return (
    <span aria-hidden="true" className={cn('logo-intro flex flex-col items-center', className)}>
      <BrandMark className="h-20 w-20" />
      <svg viewBox="0 0 96 8" className="mt-1 h-2 w-24" focusable="false">
        <path d="M2 3Q48 9 94 2" pathLength="1" fill="none" strokeWidth="3" strokeLinecap="round" className="logo-swoosh stroke-amber-400" />
      </svg>
    </span>
  );
}

/** @param {{ className?: string }} props */
function LoadingBasket({ className }) {
  return <BrandMark className={cn('logo-loading h-16 w-16', className)} />;
}

/** @type {Record<BasketIllustrationVariant, (props: { className?: string }) => import('react').ReactElement>} */
const VARIANTS = { empty: EmptyBasket, spilled: SpilledBasket, filled: FilledBasket, loading: LoadingBasket };

/**
 * Decorative scenes built from the logo's basket for empty, not-found, success and loading
 * states. Always aria-hidden: the surrounding heading or status text carries the meaning.
 * @param {{ variant: BasketIllustrationVariant, className?: string }} props
 */
export default function BasketIllustration({ variant, className }) {
  const Illustration = VARIANTS[variant];
  return <Illustration className={className} />;
}
