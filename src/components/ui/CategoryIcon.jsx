import { LayoutGrid } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Category icons drawn in the logo's style: chunky shapes in the current text colour with a
 * basket-orange accent, so they read on white chips, the green active chip and dark photo cards.
 * The `category-icon-accent` group hops when its link is hovered (index.css).
 * Services return icon keys (serializable); the UI owns the mapping to drawings.
 * @type {Record<string, import('react').ReactNode>}
 */
const CATEGORY_DRAWINGS = {
  apple: (
    <>
      <g className="category-icon-accent">
        <circle cx="12" cy="14" r="7.5" className="fill-amber-400" />
        <path d="M8.4 12.2a4.4 4.4 0 0 1 2.6-2.4" fill="none" strokeOpacity=".75" className="stroke-white" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <path d="M12 7V4.6" fill="none" className="stroke-current" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12.4 6.4c.9-2.4 3.3-3.6 5.8-2.9-.9 2.4-3.3 3.6-5.8 2.9z" className="fill-current" />
    </>
  ),
  carrot: (
    <>
      <g className="category-icon-accent">
        <path d="M14.3 6.9a3.6 3.6 0 0 1 4.8 4.8L6.6 20.6a1.4 1.4 0 0 1-2-.1 1.4 1.4 0 0 1-.1-2z" className="fill-amber-400" />
        <path d="M10.6 11.4l1.7 1.7M8.1 14.4l1.5 1.5M12.9 8.9l1.4 1.4" fill="none" className="stroke-amber-600" strokeWidth="1.3" strokeLinecap="round" />
      </g>
      <path d="M17.4 6.6c-.1-2 .7-3.6 2.3-4.6M17.6 6.4c1.7-.9 3.4-1 4.6-.3M17 6.8c-1.1-1.5-1.4-3-1-4.5" fill="none" className="stroke-current" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  beef: (
    <>
      <g className="category-icon-accent">
        <ellipse cx="14.6" cy="9.4" rx="6.6" ry="5.2" transform="rotate(-45 14.6 9.4)" className="fill-amber-400" />
      </g>
      <path d="M10.2 13.8L6.2 17.8" fill="none" className="stroke-current" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="4.6" cy="17" r="1.9" className="fill-current" />
      <circle cx="7" cy="19.4" r="1.9" className="fill-current" />
    </>
  ),
  milk: (
    <>
      <path d="M7 9.3L9.3 5h5.4L17 9.3V20a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 20z" className="fill-current" />
      <g className="category-icon-accent">
        <rect x="10.3" y="2.4" width="3.4" height="2.2" rx=".7" className="fill-amber-400" />
        <path d="M12 11.6c1.7 2.1 2.6 3.5 2.6 4.6a2.6 2.6 0 0 1-5.2 0c0-1.1.9-2.5 2.6-4.6z" className="fill-amber-400" />
      </g>
    </>
  ),
  croissant: (
    <>
      <g className="category-icon-accent">
        <g transform="rotate(-38 12 12)">
          <rect x="8.6" y="1.8" width="6.8" height="20.4" rx="3.4" className="fill-amber-400" />
          <path d="M10.2 6.6l3.6 1.1M10.2 11.4l3.6 1.1M10.2 16.2l3.6 1.1" fill="none" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>
    </>
  ),
  'cup-soda': (
    <>
      <path d="M10 2.4h4v3.2c0 .6.3 1.1.8 1.5 1.2.9 1.9 2.3 1.9 3.8V20a1.5 1.5 0 0 1-1.5 1.5H8.8A1.5 1.5 0 0 1 7.3 20v-9.1c0-1.5.7-2.9 1.9-3.8.5-.4.8-.9.8-1.5z" className="fill-current" />
      <g className="category-icon-accent">
        <rect x="7.3" y="12" width="9.4" height="5.2" className="fill-amber-400" />
      </g>
    </>
  ),
  wheat: (
    <>
      <path d="M12 22V9.5" fill="none" className="stroke-current" strokeWidth="1.8" strokeLinecap="round" />
      <g className="category-icon-accent">
        <ellipse cx="9.7" cy="16.2" rx="1.9" ry="3.3" transform="rotate(-38 9.7 16.2)" className="fill-amber-400" />
        <ellipse cx="14.3" cy="16.2" rx="1.9" ry="3.3" transform="rotate(38 14.3 16.2)" className="fill-amber-400" />
        <ellipse cx="9.7" cy="11.4" rx="1.9" ry="3.3" transform="rotate(-38 9.7 11.4)" className="fill-amber-400" />
        <ellipse cx="14.3" cy="11.4" rx="1.9" ry="3.3" transform="rotate(38 14.3 11.4)" className="fill-amber-400" />
        <ellipse cx="12" cy="6" rx="2" ry="3.4" className="fill-amber-400" />
      </g>
    </>
  ),
  cookie: (
    <>
      <g className="category-icon-accent">
        <path d="M20.4 10.4a2.9 2.9 0 0 1-3.6-3.4 2.9 2.9 0 0 1-3.5-3.6A8.6 8.6 0 1 0 20.4 10.4z" className="fill-amber-400" />
      </g>
      <circle cx="8.6" cy="9.6" r="1.4" className="fill-current" />
      <circle cx="13.6" cy="13.2" r="1.3" className="fill-current" />
      <circle cx="9.4" cy="15.6" r="1.5" className="fill-current" />
      <circle cx="16.4" cy="16" r="1.1" className="fill-current" />
      <circle cx="12" cy="7.4" r="1" className="fill-current" />
    </>
  ),
  snowflake: (
    <>
      <path d="M12 2.8v18.4M4 7.4l16 9.2M4 16.6l16-9.2M9.8 4.4L12 6.4l2.2-2M9.8 19.6l2.2-2 2.2 2M4.6 10.6l2.8-.9-.6-2.9M19.4 13.4l-2.8.9.6 2.9M6.8 16.2l.6-2.9-2.8-.9M17.2 7.8l-.6 2.9 2.8.9" fill="none" className="stroke-current" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <g className="category-icon-accent">
        <circle cx="12" cy="12" r="2.6" className="fill-amber-400" />
      </g>
    </>
  ),
};

/** @param {{ name: string, className?: string }} props Unknown keys fall back to a generic grid icon. */
export default function CategoryIcon({ name, className }) {
  const drawing = CATEGORY_DRAWINGS[name];
  if (!drawing) return <LayoutGrid className={className} aria-hidden="true" />;

  return (
    <svg viewBox="0 0 24 24" className={cn('shrink-0 overflow-visible', className)} aria-hidden="true" focusable="false">
      {drawing}
    </svg>
  );
}
