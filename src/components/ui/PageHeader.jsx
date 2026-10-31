import Breadcrumbs from './Breadcrumbs';

/**
 * Top of an inner page: breadcrumbs, the page's single <h1>, and an optional lead paragraph.
 * @param {{
 *   title: string,
 *   breadcrumbs: { label: string, to?: string }[],
 *   description?: import('react').ReactNode,
 *   children?: import('react').ReactNode,
 * }} props `children` renders on the right on wide screens (e.g. a counter).
 */
export default function PageHeader({ title, breadcrumbs, description, children }) {
  return (
    <header className="mb-6 sm:mb-8">
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 max-w-3xl">
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          {description && <p className="mt-3 text-base leading-relaxed text-slate-600">{description}</p>}
        </div>
        {children}
      </div>
    </header>
  );
}
