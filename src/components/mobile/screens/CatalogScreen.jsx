import { BadgePercent, ChevronLeft, ChevronRight, SearchX, SlidersHorizontal } from 'lucide-react';
import { useEffect } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import { PRODUCT_FORMS, pluralize } from '../../../lib/format';
import { useUIStore } from '../../../store/useUIStore';
import CategoryIcon from '../../ui/CategoryIcon';
import EmptyState from '../../ui/EmptyState';
import MobileProductGrid from '../MobileProductGrid';
import FiltersSheet from '../sheets/FiltersSheet';

/** @typedef {ReturnType<typeof import('../../../hooks/useCatalogFilters').useCatalogFilters>} CatalogFiltersState */

const ROW_CLASS_NAME =
  'flex min-h-16 w-full items-center gap-3 rounded-2xl bg-white px-3 text-left shadow-soft ring-1 ring-slate-100 active:scale-[0.98]';

function CategoryList({ categories, isLoading, onSelectCategory }) {
  const setTab = useUIStore((state) => state.setTab);

  if (isLoading) {
    return (
      <ul className="space-y-2" aria-busy="true" aria-label="Завантаження категорій">
        {Array.from({ length: 8 }, (_, index) => (
          <li key={index} className="skeleton h-16 rounded-2xl" />
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-2">
      <li>
        <button type="button" onClick={() => setTab('promo')} className={ROW_CLASS_NAME}>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber-400 text-slate-900">
            <BadgePercent className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex-1 text-base font-semibold text-slate-900">Акції тижня</span>
          <ChevronRight className="h-5 w-5 text-slate-400" aria-hidden="true" />
        </button>
      </li>
      {categories.map((category) => (
        <li key={category.id}>
          <button type="button" onClick={() => onSelectCategory(category.id)} className={ROW_CLASS_NAME}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
              <CategoryIcon name={category.icon} className="h-5 w-5" />
            </span>
            <span className="flex-1 text-base font-medium text-slate-800">{category.title}</span>
            <ChevronRight className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}

/** @param {{ title: string, catalogFilters: CatalogFiltersState, onBack: () => void }} props */
function CatalogResults({ title, catalogFilters, onBack }) {
  const {
    searchQuery,
    debouncedSearch,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilterOptions,
    activeFilterOptionsCount,
    productParams,
  } = catalogFilters;
  const activeSheet = useUIStore((state) => state.activeSheet);
  const openSheet = useUIStore((state) => state.openSheet);
  const closeSheet = useUIStore((state) => state.closeSheet);
  const { data: products, isLoading, isFetching, error, refetch } = useProducts(productParams);

  // While the debounce is pending the shown results are already stale.
  const isSearchPending = searchQuery.trim() !== debouncedSearch.trim();
  const isUpdating = isFetching || isSearchPending;

  const resetResults = () => {
    resetFilterOptions();
    setSearchQuery('');
  };

  return (
    <>
      <div className="top-below-mobile-header sticky z-20 -mx-4 mb-3 flex items-center gap-2 border-b border-slate-200/70 bg-gray-50/90 px-2 py-1.5 backdrop-blur-md">
        <button
          type="button"
          onClick={onBack}
          aria-label="Назад до категорій"
          className="grid min-h-11 min-w-11 place-items-center rounded-full text-slate-700 active:scale-95 active:bg-slate-200/60"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500" aria-live="polite">
            {isLoading || error ? ' ' : pluralize(products.length, PRODUCT_FORMS)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => openSheet('filters')}
          aria-label={activeFilterOptionsCount > 0 ? `Фільтри, активних: ${activeFilterOptionsCount}` : 'Фільтри'}
          className="relative grid min-h-11 min-w-11 place-items-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 active:scale-95"
        >
          <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
          {activeFilterOptionsCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-600 px-1 text-[11px] font-bold text-white" aria-hidden="true">
              {activeFilterOptionsCount}
            </span>
          )}
        </button>
      </div>

      <MobileProductGrid
        products={products}
        isLoading={isLoading}
        isFetching={isUpdating}
        error={error}
        onRetry={refetch}
        emptyState={
          <EmptyState
            icon={SearchX}
            title="Нічого не знайдено"
            description="Спробуйте інший запит або скиньте фільтри."
            action={
              <button
                type="button"
                onClick={resetResults}
                className="min-h-11 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white active:scale-95"
              >
                Скинути фільтри
              </button>
            }
          />
        }
      />

      {activeSheet === 'filters' && (
        <FiltersSheet
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilterOptions}
          resultCount={products.length}
          isCounting={isLoading || isUpdating}
          onClose={closeSheet}
        />
      )}
    </>
  );
}

/**
 * Level 1: category list. Level 2: products of the selected category or search results.
 * @param {{
 *   categories: import('../../../services/productService').Category[],
 *   isCategoriesLoading: boolean,
 *   catalogFilters: CatalogFiltersState,
 * }} props
 */
export default function CatalogScreen({ categories, isCategoriesLoading, catalogFilters }) {
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = catalogFilters;
  const trimmedSearch = searchQuery.trim();
  const isShowingProducts = Boolean(selectedCategory || trimmedSearch);
  const categoryTitle = categories.find((category) => category.id === selectedCategory)?.title;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [selectedCategory]);

  const handleBack = () => {
    if (trimmedSearch) setSearchQuery('');
    else setSelectedCategory(null);
  };

  const title = trimmedSearch
    ? `«${trimmedSearch}»${categoryTitle ? ` у «${categoryTitle}»` : ''}`
    : (categoryTitle ?? 'Товари');

  return (
    <div className="px-4 pt-4">
      {isShowingProducts ? (
        <CatalogResults title={title} catalogFilters={catalogFilters} onBack={handleBack} />
      ) : (
        <>
          <h1 className="mb-3 text-2xl font-bold tracking-tight text-slate-900">Каталог</h1>
          <CategoryList categories={categories} isLoading={isCategoriesLoading} onSelectCategory={setSelectedCategory} />
        </>
      )}
    </div>
  );
}
