import { LayoutGrid, Search, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCategories } from '../../hooks/useProducts';
import { ROUTES, getCategoryPath } from '../../lib/routes';
import { cn } from '../../lib/utils';
import CategoryIcon from '../ui/CategoryIcon';

const PILL_CLASS_NAME =
  'flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors';

/** @param {{ to: { pathname: string, search: string }, isActive: boolean, children: import('react').ReactNode }} props */
function CategoryPill({ to, isActive, children }) {
  return (
    <Link
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        PILL_CLASS_NAME,
        isActive
          ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:text-emerald-700',
      )}
    >
      {children}
    </Link>
  );
}

/**
 * Search box + category switcher for the catalog and category pages. Switching category is a
 * navigation to that category's page; the current query (search, sort, filters) carries over.
 * @param {{
 *   filterState: import('../../hooks/useProductFilters').ProductFiltersState,
 *   activeCategory?: { id: string, title: string },
 * }} props
 */
export default function ListingControls({ filterState, activeCategory }) {
  const { searchInput, setSearchInput } = filterState;
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { search } = useLocation();

  return (
    <div className="mb-6 space-y-4">
      <form role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="relative block">
          <span className="sr-only">{activeCategory ? `Пошук у категорії «${activeCategory.title}»` : 'Пошук товарів у каталозі'}</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          {/* text-base (16px) prevents iOS Safari from zooming into the field on focus. */}
          <input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={activeCategory ? `Шукати в «${activeCategory.title}»` : 'Назва товару або виробника: молоко, «Полісся», банани…'}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-base text-slate-800 shadow-soft transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 [&::-webkit-search-cancel-button]:hidden"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              aria-label="Очистити пошук"
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </label>
      </form>

      <nav aria-label="Категорії каталогу">
        {isCategoriesLoading ? (
          <div className="flex gap-2 overflow-hidden" aria-busy="true" aria-label="Завантаження категорій">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="skeleton h-10 w-36 shrink-0 rounded-full" />
            ))}
          </div>
        ) : (
          <ul className="scrollbar-hide -mx-4 flex snap-x gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:px-0 lg:flex-wrap lg:overflow-visible">
            <li className="shrink-0">
              <CategoryPill to={{ pathname: ROUTES.catalog, search }} isActive={!activeCategory}>
                <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                Усі товари
              </CategoryPill>
            </li>
            {categories.map((category) => (
              <li key={category.id} className="shrink-0">
                <CategoryPill to={{ pathname: getCategoryPath(category.id), search }} isActive={activeCategory?.id === category.id}>
                  <CategoryIcon name={category.icon} className="h-4 w-4" />
                  {category.title}
                </CategoryPill>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </div>
  );
}
