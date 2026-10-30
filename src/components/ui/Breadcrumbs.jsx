import { ChevronRight, House } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../lib/routes';
import { cn } from '../../lib/utils';

const LINK_CLASS_NAME =
  'inline-flex min-h-8 items-center gap-1 rounded-md px-1 text-slate-600 underline-offset-4 transition-colors hover:text-emerald-800 hover:underline';

/**
 * "Головна" is always prepended. The last item is the current page and is not a link.
 * Long names (products) are clamped to one line so the trail never pushes the page title down.
 * @param {{ items: { label: string, to?: string }[], className?: string }} props
 */
export default function Breadcrumbs({ items, className }) {
  return (
    <nav aria-label="Навігаційний ланцюжок" className={cn('min-w-0', className)}>
      <ol className="flex flex-wrap items-center gap-x-0.5 text-sm">
        <li className="flex items-center">
          <Link to={ROUTES.home} className={LINK_CLASS_NAME}>
            <House className="h-4 w-4" aria-hidden="true" />
            Головна
          </Link>
        </li>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 max-w-full items-center gap-0.5">
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
              {isCurrent || !item.to ? (
                <span aria-current={isCurrent ? 'page' : undefined} className="line-clamp-1 px-1 font-semibold text-slate-800">
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className={cn(LINK_CLASS_NAME, 'min-w-0')}>
                  <span className="line-clamp-1">{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
