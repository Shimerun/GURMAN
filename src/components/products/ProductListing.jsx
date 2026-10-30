import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { SORT_OPTIONS } from '../../lib/constants';
import { PRODUCT_FORMS, formatPrice, pluralize } from '../../lib/format';
import { buttonClassName } from '../../lib/buttonStyles';
import BottomSheet from '../ui/BottomSheet';
import ProductFilterPanel from './ProductFilterPanel';
import ProductGrid from './ProductGrid';

const LISTING_GRID_CLASS_NAME = 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4';

/** @typedef {import('../../hooks/useProductFilters').ProductFiltersState} ProductFiltersState */

/** @param {number | undefined} minPrice @param {number | undefined} maxPrice */
function formatPriceRange(minPrice, maxPrice) {
  if (minPrice !== undefined && maxPrice !== undefined) return `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`;
  if (minPrice !== undefined) return `від ${formatPrice(minPrice)}`;
  return `до ${formatPrice(maxPrice ?? 0)}`;
}

/** @param {{ filterState: ProductFiltersState }} props */
function ActiveFilterChips({ filterState }) {
  const { appliedSearch, setSearchInput, filters, setPriceRange, setInStockOnly, setOnlyPromo } = filterState;

  /** @type {{ id: string, label: string, onRemove: () => void }[]} */
  const chips = [];
  if (appliedSearch) chips.push({ id: 'search', label: `Пошук: «${appliedSearch}»`, onRemove: () => setSearchInput('') });
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    chips.push({ id: 'price', label: formatPriceRange(filters.minPrice, filters.maxPrice), onRemove: () => setPriceRange(undefined, undefined) });
  }
  if (filters.inStockOnly) chips.push({ id: 'stock', label: 'В наявності', onRemove: () => setInStockOnly(false) });
  if (filters.onlyPromo) chips.push({ id: 'promo', label: 'Акції', onRemove: () => setOnlyPromo(false) });

  if (chips.length === 0) return null;

  return (
    <ul className="mb-4 flex flex-wrap gap-2" aria-label="Активні фільтри">
      {chips.map((chip) => (
        <li key={chip.id} className="min-w-0">
          <button
            type="button"
            onClick={chip.onRemove}
            className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-emerald-50 py-1.5 pl-3 pr-2 text-xs font-medium text-emerald-800 ring-1 ring-emerald-100 transition-colors hover:bg-emerald-100"
          >
            <span className="truncate">{chip.label}</span>
            <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="sr-only">— прибрати фільтр</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * Sidebar filters (desktop) / filter sheet (mobile) + toolbar + product grid.
 * Shared by the catalog and category pages; both drive it through `useProductFilters`.
 * @param {{
 *   filterState: ProductFiltersState,
 *   productsQuery: { data: import('../../services/productService').Product[], isLoading: boolean, isFetching: boolean, error: unknown, refetch: () => void },
 *   emptyState: import('react').ReactNode,
 * }} props
 */
export default function ProductListing({ filterState, productsQuery, emptyState }) {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const { filters, setSort, activeFilterCount, isSearchPending } = filterState;
  const { data: products, isLoading, isFetching, error, refetch } = productsQuery;
  const isUpdating = isFetching || isSearchPending;

  const resultLabel = isLoading ? 'Завантаження товарів…' : error ? 'Не вдалося завантажити' : `Знайдено ${pluralize(products.length, PRODUCT_FORMS)}`;

  return (
    <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start lg:gap-8">
      <aside aria-label="Фільтри товарів" className="hidden lg:sticky lg:top-36 lg:block">
        <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <ProductFilterPanel filterState={filterState} />
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-slate-100 sm:px-4">
          <p className="mr-auto text-sm font-medium text-slate-600" aria-live="polite">
            {resultLabel}
          </p>

          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(true)}
            className={buttonClassName({ variant: 'secondary', size: 'sm', className: 'lg:hidden' })}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Фільтри
            {activeFilterCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-emerald-600 px-1 text-[11px] font-bold text-white">
                {activeFilterCount}
                <span className="sr-only"> активних</span>
              </span>
            )}
          </button>

          <label className="flex items-center gap-2 text-sm text-slate-500">
            <span className="hidden sm:inline">Сортування</span>
            <span className="sr-only sm:hidden">Сортування</span>
            <select
              className="select select-bordered select-sm rounded-full text-slate-800"
              value={filters.sort}
              onChange={(event) => setSort(/** @type {import('../../services/productService').ProductSort} */ (event.target.value))}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ActiveFilterChips filterState={filterState} />

        <ProductGrid
          products={products}
          isLoading={isLoading}
          isFetching={isUpdating}
          error={error}
          onRetry={refetch}
          eagerImageCount={4}
          skeletonCount={8}
          gridClassName={LISTING_GRID_CLASS_NAME}
          emptyState={emptyState}
        />
      </div>

      {isFilterSheetOpen && (
        <BottomSheet
          title="Фільтри"
          onClose={() => setIsFilterSheetOpen(false)}
          footer={
            <button type="button" onClick={() => setIsFilterSheetOpen(false)} className={buttonClassName({ size: 'lg', className: 'w-full' })}>
              {isLoading || isUpdating ? 'Показати товари' : `Показати ${pluralize(products.length, PRODUCT_FORMS)}`}
            </button>
          }
        >
          <ProductFilterPanel filterState={filterState} />
        </BottomSheet>
      )}
    </div>
  );
}

