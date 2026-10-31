import { Link } from 'react-router-dom';
import { CITY } from '../../lib/constants';
import { ROUTES } from '../../lib/routes';
import { cn } from '../../lib/utils';
import BrandMark from './BrandMark';

const TONE_CLASSES = {
  light: { name: 'text-emerald-700', tagline: 'text-amber-700', subtitle: 'text-slate-600' },
  dark: { name: 'text-gray-50', tagline: 'text-amber-300', subtitle: 'text-slate-300' },
};

/**
 * Logo lockup linking home: basket mark, the GURMAN wordmark with its orange swoosh, the
 * handwritten "смачно щодня" tagline and, optionally, the "продуктовий магазин" subtitle.
 * @param {{ tone?: keyof typeof TONE_CLASSES, showTagline?: boolean, showSubtitle?: boolean, isIntroAnimated?: boolean, isDecorative?: boolean, className?: string }} props
 * `showTagline` is hidden on the narrowest screens, where the header has no room for it.
 * `isIntroAnimated` plays the one-off assembly animation on mount (header only: it stays mounted
 * across routes, so the intro runs once per visit).
 * `isDecorative` renders an identical, non-interactive copy (the opening splash flies it into the header).
 */
export default function BrandLogo({ tone = 'light', showTagline = false, showSubtitle = false, isIntroAnimated = false, isDecorative = false, className }) {
  const toneClasses = TONE_CLASSES[tone];
  const wrapperClassName = cn('flex min-h-11 shrink-0 items-center gap-2 rounded-xl', !isDecorative && 'brand-logo', isIntroAnimated && 'logo-intro', className);

  const lockup = (
    <>
      <BrandMark tone={tone} className="h-11 w-11" />
      <span className="flex flex-col items-start" aria-hidden="true">
        {showTagline && <span className={cn('logo-tagline -mb-0.5 hidden -rotate-2 font-script text-base font-semibold leading-none min-[400px]:block', toneClasses.tagline)}>смачно щодня</span>}
        {/* The swoosh spans the wordmark only, so it sits in its own shrink-wrapped column. */}
        <span className="flex flex-col">
          <span className={cn('logo-wordmark font-display text-xl font-bold leading-tight tracking-tight', toneClasses.name)}>GURMAN</span>
          <svg viewBox="0 0 100 6" preserveAspectRatio="none" className="-mt-0.5 h-1.5 w-full" focusable="false">
            <path d="M1 2.2Q50 6.4 99 1.4" pathLength="1" fill="none" strokeWidth="2.5" strokeLinecap="round" className="logo-swoosh stroke-amber-400" />
          </svg>
        </span>
        {showSubtitle && <span className={cn('mt-1.5 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em]', toneClasses.subtitle)}>продуктовий магазин</span>}
      </span>
    </>
  );

  if (isDecorative) {
    return (
      <div aria-hidden="true" className={wrapperClassName}>
        {lockup}
      </div>
    );
  }

  return (
    // The name starts with the visible text (WCAG 2.5.3), so "click GURMAN" works for voice control.
    <Link to={ROUTES.home} aria-label={`${showTagline ? 'смачно щодня, ' : ''}GURMAN — продуктовий магазин у місті ${CITY}, на головну`} className={wrapperClassName}>
      {lockup}
    </Link>
  );
}
