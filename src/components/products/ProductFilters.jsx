import { RotateCcw } from 'lucide-react';
import { SORT_OPTIONS } from '../../lib/constants';
import CategoryGrid from '../home/CategoryGrid';

/**
 * @param {{
 *   categories: import('../../services/productService').Category[],
 *   isCategoriesLoading: boolean,
 *   selectedCategory: string | null,
 *   onSelectCategory: (categoryId: string | null) => void,
 *   filters: import('../../hooks/useCatalogFilters').CatalogFilters,
 *   onFilterChange: (name: string, value: unknown) => void,
 *   hasActiveFilters: boolean,
 *   onReset: () => void,
 * }} props
 */
export default function ProductFilters({
  categories,
  isCategoriesLoading,
  selectedCategory,
  onSelectCategory,
  filters,
  onFilterChange,
  hasActiveFilters,
  onReset,
}) {
  return (
    <div className="mb-5 space-y-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-100 sm:mb-6">
      <CategoryGrid
        categories={categories}
        isLoading={isCategoriesLoading}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        ariaLabel="Фільтр за категорією"
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 pt-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-sm"
            checked={filters.onlyPromo}
            onChange={(event) => onFilterChange('onlyPromo', event.target.checked)}
          />
          Тільки акції
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-sm"
            checked={filters.inStockOnly}
            onChange={(event) => onFilterChange('inStockOnly', event.target.checked)}
          />
          В наявності
        </label>

        <div className="flex w-full items-center gap-3 sm:ml-auto sm:w-auto">
          <label className="flex flex-1 items-center gap-2 text-sm text-slate-500 sm:flex-none">
            Сортування
            <select
              className="select select-bordered select-sm flex-1 rounded-full text-slate-800 sm:flex-none"
              value={filters.sort}
              onChange={(event) => onFilterChange('sort', event.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Скинути
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
