import { cn } from '../../lib/utils';

// Per-tone fills: on dark surfaces the basket turns cream and the weave is cut in the surface colour.
const TONE_CLASSES = {
  light: { basket: 'fill-emerald-700', handle: 'stroke-emerald-700', weave: 'stroke-white', leaf: 'fill-emerald-500' },
  dark: { basket: 'fill-gray-50', handle: 'stroke-gray-50', weave: 'stroke-emerald-900', leaf: 'fill-emerald-300' },
};

/**
 * GURMAN basket mark (baguette, leaf and orange in a woven basket). Decorative: the parent
 * link or heading carries the accessible name. The `logo-*` group classes are animation hooks
 * for index.css (intro, loading loop, hover); they do nothing on their own.
 * @param {{ tone?: keyof typeof TONE_CLASSES, isEmpty?: boolean, className?: string }} props
 * `isEmpty` draws the basket without produce (empty cart, 404).
 */
export default function BrandMark({ tone = 'light', isEmpty = false, className }) {
  const toneClasses = TONE_CLASSES[tone];

  return (
    <svg viewBox="0 0 64 64" className={cn('shrink-0', className)} aria-hidden="true" focusable="false">
      {/* Handle sits behind the produce, the rim and body in front, so the basket is split in two groups. */}
      <g className="logo-basket">
        <path d="M14.5 31a17.5 17.5 0 0 1 35 0" fill="none" strokeWidth="5" strokeLinecap="round" className={toneClasses.handle} />
      </g>
      {!isEmpty && (
        <>
          {/* Outer groups carry the intro/loading animations, inner ones the hover motion, so
              neither replaces the other's transform (or the baguette's own rotation). */}
          <g className="logo-produce logo-produce-1">
            <g transform="rotate(-24 20 19)">
              <rect x="16" y="5" width="8" height="28" rx="4" className="fill-amber-200" />
              <path d="M17.6 9.5l4.6 1.4M17.6 14.5l4.6 1.4M17.6 19.5l4.6 1.4" fill="none" strokeWidth="1.6" strokeLinecap="round" className="stroke-amber-700" />
            </g>
          </g>
          <g className="logo-produce logo-produce-2">
            <g className="logo-leaf">
              <path d="M31 31c-4.5-5-4.5-13 0-18 4.5 5 4.5 13 0 18z" className={toneClasses.leaf} />
            </g>
          </g>
          <g className="logo-produce logo-produce-3">
            <g className="logo-orange">
              <circle cx="41" cy="25" r="7" className="fill-amber-400" />
              <path d="M42 18.3c1-2.3 3.4-3.4 5.8-2.8-1 2.2-3.4 3.4-5.8 2.8z" className={toneClasses.leaf} />
            </g>
          </g>
        </>
      )}
      <g className="logo-basket">
        <rect x="8" y="30" width="48" height="6.5" rx="3.25" className={toneClasses.basket} />
        <path d="M11.5 38.5h41l-4.2 15.3a4 4 0 0 1-3.9 3.2H19.6a4 4 0 0 1-3.9-3.2z" className={toneClasses.basket} />
        <path d="M24.5 42l.7 11M32 42v11M39.5 42l-.7 11M14 47.5h36" fill="none" strokeWidth="1.8" strokeLinecap="round" className={toneClasses.weave} />
      </g>
    </svg>
  );
}
