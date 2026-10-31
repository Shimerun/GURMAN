import { Clock, Croissant, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { COFFEE_TO_GO } from '../../config/business';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { buttonClassName } from '../../lib/buttonStyles';
import { formatPrice } from '../../lib/format';
import { ROUTES, getCategoryPath } from '../../lib/routes';
import SectionHeader from '../ui/SectionHeader';

/** Gemini coffee logo (owner-supplied linear white version), drawn in the cup's own SVG. */
const GEMINI_LOGO_PATHS = [
  'M91.4,108.75c0,9.36-5.99,15.88-14.59,15.88c-7.97,0-14.68-6.82-14.68-14.92c0-8.21,6.75-14.89,15.04-14.89c4.33,0,7.96,1.63,11.43,5.15l-4,4c-2.44-2.47-4.78-3.58-7.54-3.58c-5.15,0-9.02,4-9.02,9.29c0,5.06,4.02,9.32,8.77,9.32c4.12,0,7.25-2.57,8.27-6.63h-9.72v-5.19H91.4V108.75z',
  'M117.48,100.83h-15.31v5.53h15.31v5.55h-15.31v2.42c0,2.87,1.36,4.26,4.14,4.26h11.17v5.57h-10.57c-6.99,0-10.53-3.49-10.53-10.38V95.27h21.1V100.83z',
  'M129.74,124.16v-23.33h10.36v23.33h5.79v-23.33h6.46c2.87,0,4.26,1.36,4.26,4.14v19.19h5.79V105.8c0-6.99-3.49-10.53-10.38-10.53h-28.06v28.89H129.74z',
  'M188.56,124.16v-23.33h9.19c2.87,0,4.26,1.36,4.26,4.14v19.19h5.79V105.8c0-6.99-3.49-10.53-10.38-10.53h-14.65v28.89H188.56z',
  'M169.55,95.27h5.78v28.89h-5.78z',
  'M214.69,95.27h5.8v28.89h-5.8z',
  'M141.73,39.76c-62.52,0-113.39,31.39-113.39,69.96s50.86,69.96,113.39,69.96s113.39-31.39,113.39-69.96S204.25,39.76,141.73,39.76 M141.73,173.98c-59.37,0-107.68-28.82-107.68-64.25s48.3-64.25,107.68-64.25c59.37,0,107.68,28.82,107.68,64.25S201.11,173.98,141.73,173.98',
];

const CUP_BODY_PATH = 'M39 57h66l-9 78a6 6 0 0 1-6 5H54a6 6 0 0 1-6-5z';
// The "liquid": wider than the cup so its wavy surface can sway; at rest the waves sit above the
// rim (y 50–54), where the clip hides them, so the full cup is solid green.
const CUP_LIQUID_PATH = 'M26 54q7-4 14 0t14 0 14 0 14 0 14 0 14 0 14 0V142H26z';
// One cup per page (home), so a fixed id is unique.
const CUP_CLIP_ID = 'coffee-cup-body';
/** Pour once most of the cup is on screen, so the whole fill is seen. */
const POUR_VISIBLE_RATIO = 0.9;

/**
 * 'waiting' (empty, lid off) → 'pouring' (CSS plays the fill, lid and beans) once the cup is in
 * view; 'done' from the start under reduced motion, where the cup is simply shown full.
 * @param {import('react').RefObject<SVGSVGElement | null>} cupRef
 */
function useCoffeePour(cupRef) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [pourState, setPourState] = useState(/** @type {'waiting' | 'pouring' | 'done'} */ (prefersReducedMotion ? 'done' : 'waiting'));

  useEffect(() => {
    const cup = cupRef.current;
    if (pourState !== 'waiting' || !cup) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < POUR_VISIBLE_RATIO) return;
        setPourState('pouring');
        observer.disconnect();
      },
      { threshold: POUR_VISIBLE_RATIO },
    );
    observer.observe(cup);
    return () => observer.disconnect();
  }, [cupRef, pourState]);

  return pourState;
}

/**
 * Takeaway cup in the logo's style with the white Gemini logo on the green body. When it comes
 * into view the empty cup fills up with a swaying surface, the lid drops on and the beans bounce
 * (`.coffee-cup[data-pour]` in index.css); the steam drifts up all the time (`.coffee-steam`).
 */
function CoffeeCupIllustration() {
  const cupRef = useRef(/** @type {SVGSVGElement | null} */ (null));
  const pourState = useCoffeePour(cupRef);

  return (
    <svg
      ref={cupRef}
      viewBox="0 0 140 150"
      data-pour={pourState}
      className="coffee-cup mx-auto h-40 w-auto sm:h-48 lg:h-60 xl:h-64"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={CUP_CLIP_ID}>
          <path d={CUP_BODY_PATH} />
        </clipPath>
      </defs>
      <g className="coffee-steam" fill="none" strokeWidth="4" strokeLinecap="round">
        <path d="M58 34c-7-8 7-13 0-22" className="stroke-amber-300" />
        <path d="M72 30c-7-8 7-13 0-22" className="stroke-emerald-300" />
        <path d="M86 34c-7-8 7-13 0-22" className="stroke-amber-300" />
      </g>
      {/* A wide cup body leaves room for the Gemini logo at a readable size. */}
      <g className="coffee-lid">
        <rect x="44" y="38" width="56" height="9" rx="4.5" className="fill-emerald-800" />
        <rect x="34" y="45" width="76" height="12" rx="6" className="fill-emerald-800" />
      </g>
      <path d={CUP_BODY_PATH} className="fill-emerald-100" />
      <g clipPath={`url(#${CUP_CLIP_ID})`}>
        <g className="coffee-fill">
          <path d={CUP_LIQUID_PATH} className="coffee-liquid fill-emerald-700" />
        </g>
      </g>
      <path d="M41.5 70.5h61M46.3 112h51.4" fill="none" strokeWidth="1.8" strokeLinecap="round" className="stroke-amber-400" />
      {/* The logo's oval (227×140 source units, centred at 141.73, 109.72) scaled to 54 units wide on the cup. */}
      <g transform="translate(72 91.25) scale(0.2381) translate(-141.73 -109.72)" className="fill-white">
        {GEMINI_LOGO_PATHS.map((path) => (
          <path key={path} d={path} />
        ))}
      </g>
      {/* Coffee beans at the foot of the cup. */}
      <g className="coffee-beans">
        <g>
          <ellipse cx="22" cy="132" rx="7" ry="9.5" transform="rotate(-30 22 132)" className="fill-amber-800" />
          <path d="M18 125c3 4 5 10 8 14" fill="none" strokeWidth="1.6" strokeLinecap="round" className="stroke-amber-950" />
        </g>
        <g>
          <ellipse cx="118" cy="128" rx="7" ry="9.5" transform="rotate(25 118 128)" className="fill-amber-800" />
          <path d="M121 121c-3 4-4 10-6 14" fill="none" strokeWidth="1.6" strokeLinecap="round" className="stroke-amber-950" />
        </g>
        <g>
          <ellipse cx="106" cy="141" rx="6" ry="8" transform="rotate(70 106 141)" className="fill-amber-800" />
          <path d="M100 138c3 1 8 3 12 5" fill="none" strokeWidth="1.6" strokeLinecap="round" className="stroke-amber-950" />
        </g>
      </g>
    </svg>
  );
}

/** Home-page block for the coffee-to-go corner in both stores. */
export default function CoffeeToGo() {
  return (
    // overflow-clip, not -hidden: a hidden-overflow box is a scroll container, which would freeze
    // the cup's scroll-driven fill (its view timeline would track this box instead of the page).
    <section aria-labelledby="coffee-heading" className="overflow-clip rounded-xl bg-amber-50 p-6 ring-1 ring-amber-200 sm:p-10">
      <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionHeader
            id="coffee-heading"
            title="Смачна кава — в обох магазинах"
            description={`Варимо на каві ${COFFEE_TO_GO.brand}. Готуємо при вас, поки ви обираєте продукти.`}
          />

          <ul className="max-w-md space-y-2.5" aria-label="Меню кави">
            {COFFEE_TO_GO.menu.map((drink) => (
              <li key={drink.name} className="flex items-baseline gap-2">
                <span className="min-w-0 font-semibold text-slate-900">{drink.name}</span>
                <span className="min-w-6 flex-1 -translate-y-1 border-b-2 border-dotted border-amber-300" aria-hidden="true" />
                <span className="shrink-0 whitespace-nowrap font-bold tabular-nums text-emerald-800">{formatPrice(drink.price)}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
              {COFFEE_TO_GO.hours}
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
              Біля кас у кожному магазині
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={getCategoryPath('bakery')} className={buttonClassName({ variant: 'accent' })}>
              <Croissant className="h-4 w-4" aria-hidden="true" />
              Свіжа випічка до кави
            </Link>
            <Link to={ROUTES.contacts} className={buttonClassName({ variant: 'secondary' })}>
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Адреси магазинів
            </Link>
          </div>
        </div>

        {/* Phones: a small cup opens the block (at the bottom it would trail after the buttons). */}
        <div className="order-first lg:order-none">
          <CoffeeCupIllustration />
        </div>
      </div>
    </section>
  );
}
