import { cn } from '../../lib/utils';

/**
 * Navigation icons drawn like `CategoryIcon`: solid shapes in the current text colour with one
 * basket-orange accent, so the main controls carry the brand instead of generic line icons.
 * @type {Record<'home' | 'catalog' | 'tag' | 'basket' | 'pin', import('react').ReactNode>}
 */
const BRAND_DRAWINGS = {
  home: (
    <>
      <path d="M4.5 11.2L12 4.6l7.5 6.6V19a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19z" className="fill-current" />
      <path d="M2.8 12L12 3.9l9.2 8.1" fill="none" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="10" y="13.4" width="4" height="7.1" rx="1" className="fill-amber-400" />
    </>
  ),
  catalog: (
    <>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" className="fill-current" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="2" className="fill-current" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="2" className="fill-current" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="2" className="fill-amber-400" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 5v6.2c0 .5.2 1 .6 1.4l8.3 8.3a2 2 0 0 0 2.8 0l5.7-5.7a2 2 0 0 0 0-2.8l-8.3-8.3a2 2 0 0 0-1.4-.6H5A1.5 1.5 0 0 0 3.5 5z" className="fill-current" />
      <circle cx="8" cy="8" r="2" className="fill-amber-400" />
    </>
  ),
  // The logo's basket, reduced to icon size: handle, rim, body and the orange.
  basket: (
    <>
      <path d="M6.5 11a5.5 5.5 0 0 1 11 0" fill="none" className="stroke-current" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="14.4" cy="9.4" r="2.6" className="fill-amber-400" />
      <rect x="2.5" y="10.6" width="19" height="3" rx="1.5" className="fill-current" />
      <path d="M4 14.9h16l-1.6 5.5a1.6 1.6 0 0 1-1.5 1.1H7.1a1.6 1.6 0 0 1-1.5-1.1z" className="fill-current" />
    </>
  ),
  pin: (
    <>
      <path d="M12 2.5a7 7 0 0 0-7 7c0 5 7 12 7 12s7-7 7-12a7 7 0 0 0-7-7z" className="fill-current" />
      <circle cx="12" cy="9.5" r="2.7" className="fill-amber-400" />
    </>
  ),
};

/** @param {{ name: keyof typeof BRAND_DRAWINGS, className?: string }} props Decorative: the control carries the label. */
export default function BrandIcon({ name, className }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('shrink-0', className)} aria-hidden="true" focusable="false">
      {BRAND_DRAWINGS[name]}
    </svg>
  );
}
