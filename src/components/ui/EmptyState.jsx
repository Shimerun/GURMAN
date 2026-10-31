import { cn } from '../../lib/utils';

/**
 * `headingAs` lets full-page states (404) own the page's <h1>; sections keep the default <h3>.
 * `illustration` (e.g. a BasketIllustration) takes the place of the icon bubble.
 */
export default function EmptyState({ icon: Icon, illustration, title, description, action, className, headingAs: Heading = 'h3' }) {
  return (
    <div className={cn('flex flex-col items-center rounded-lg bg-white px-6 py-12 text-center shadow-soft ring-1 ring-slate-100', className)}>
      {illustration}
      {!illustration && Icon && (
        <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
      )}
      <Heading className="mt-4 text-lg font-semibold text-slate-900">{title}</Heading>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
