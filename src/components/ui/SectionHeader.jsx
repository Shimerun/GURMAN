/**
 * Section title row: optional eyebrow, the section's <h2>, optional lead, and right-aligned actions.
 * @param {{ id: string, title: import('react').ReactNode, eyebrow?: string, description?: string, children?: import('react').ReactNode }} props
 */
export default function SectionHeader({ id, eyebrow, title, description, children }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 sm:mb-6">
      <div className="min-w-0 max-w-3xl">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{eyebrow}</p>}
        <h2 id={id} className="mt-1 font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h2>
        {/* The logo's orange swoosh, drawn in as the section scrolls into view. */}
        <svg viewBox="0 0 96 8" className="mt-1.5 h-2 w-24" aria-hidden="true" focusable="false">
          <path d="M2 3Q48 9 94 2" pathLength="1" fill="none" strokeWidth="3" strokeLinecap="round" className="swoosh-draw stroke-amber-400" />
        </svg>
        {description && <p className="mt-1.5 text-sm text-slate-600">{description}</p>}
      </div>
      {children}
    </div>
  );
}
