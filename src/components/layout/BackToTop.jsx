import { ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsScrolledPast } from '../../hooks/useIsScrolledPast';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { isProductPath } from '../../lib/routes';
import { cn } from '../../lib/utils';
import BrandMark from '../ui/BrandMark';

/** About two phone screens: on shorter pages scrolling back is easy without a button. */
const SHOW_AFTER_PX = 1200;

/**
 * "Нагору": appears after a long scroll; the basket hops and the page glides back to the top.
 * Focus moves to <main> so keyboard users continue from the start of the content.
 */
export default function BackToTop() {
  const { pathname } = useLocation();
  const isVisible = useIsScrolledPast(SHOW_AFTER_PX);
  const prefersReducedMotion = usePrefersReducedMotion();
  // Bumped on every click: re-keys the basket so its hop replays.
  const [hopCount, setHopCount] = useState(0);

  const scrollToTop = () => {
    setHopCount((count) => count + 1);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    document.getElementById('main')?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Нагору"
      className={cn(
        'fixed right-4 z-30 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-white text-emerald-700 shadow-lg ring-1 ring-slate-200 transition-[opacity,transform,visibility] duration-300 hover:ring-emerald-500 motion-reduce:transition-none md:bottom-6 md:right-6',
        // Phones: above the tab bar, and also above the product page's sticky purchase bar.
        isProductPath(pathname) ? 'bottom-[calc(8rem+env(safe-area-inset-bottom))]' : 'bottom-[calc(4.5rem+env(safe-area-inset-bottom))]',
        isVisible ? 'visible opacity-100' : 'invisible translate-y-3 opacity-0',
      )}
    >
      <ChevronUp className="-mb-1 h-4 w-4" strokeWidth={3} aria-hidden="true" />
      <BrandMark key={hopCount} className={cn('h-7 w-7', hopCount > 0 && 'animate-basket-hop')} />
    </button>
  );
}
