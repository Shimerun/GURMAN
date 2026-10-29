export default function SectionHeader({ id, eyebrow, title, description, children }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">{eyebrow}</p>}
        <h2 id={id} className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}
