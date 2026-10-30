import { ChevronRight, House } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../lib/routes';
import { cn } from '../../lib/utils';

/**
 * "Головна" is always prepended. The last item is the current page and is not a link.
 * @param {{ items: { label: string, to?: string }[], className?: string }} props
 */
export default function Breadcrumbs({ items, className }) {
  return (
    <nav aria-label="Навігаційний ланцюжок" className={cn('min-w-0', className)}>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-slate-500">
        <li className="flex items-center">
          <Link to={ROUTES.home} className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:text-emerald-700">
            <House className="h-4 w-4" aria-hidden="true" />
            Головна
          </Link>
        </li>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1">
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" />
              {isCurrent || !item.to ? (
                <span aria-current={isCurrent ? 'page' : undefined} className="line-clamp-1 px-1 font-medium text-slate-700">
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="line-clamp-1 rounded-md px-1 py-0.5 transition-colors hover:text-emerald-700">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
