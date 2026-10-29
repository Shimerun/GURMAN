import { SearchX } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { SECTION_IDS } from '../../lib/constants';
import { PRODUCT_FORMS, pluralize } from '../../lib/format';
import EmptyState from '../ui/EmptyState';
import SectionHeader from '../ui/SectionHeader';
import ProductFilters from './ProductFilters';
import ProductGrid from './ProductGrid';

/** @param {{ categories: import('../../services/productService').Category[], isCategoriesLoading: boolean, catalogFilters: ReturnType<typeof import('../../hooks/useCatalogFilters').useCatalogFilters> }} props */
export default function Catalog({ categories, isCategoriesLoading, catalogFilters }) {
  const {
    selectedCategory,
    setSelectedCategory,
    debouncedSearch,
    filters,
    updateFilter,
    resetFilters,
    productParams,
    hasActiveFilters,
  } = catalogFilters;
  const { data: products, isLoading, isFetching, error, refetch } = useProducts(productParams);
  const trimmedSearch = debouncedSearch.trim();

  return (
    <section id={SECTION_IDS.catalog} aria-labelledby="catalog-heading">
      <SectionHeader
        id="catalog-heading"
        eyebrow="Усе для дому"
        title="Каталог"
        description={trimmedSearch ? `Результати пошуку за запитом «${trimmedSearch}»` : undefined}
      >
        <p className="text-sm text-slate-500" aria-live="polite">
          {!isLoading && !error && `Знайдено ${pluralize(products.length, PRODUCT_FORMS)}`}
        </p>
      </SectionHeader>

      <ProductFilters
        categories={categories}
        isCategoriesLoading={isCategoriesLoading}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        filters={filters}
        onFilterChange={updateFilter}
        hasActiveFilters={hasActiveFilters}
        onReset={resetFilters}
      />

      <ProductGrid
        products={products}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={refetch}
        emptyState={
          <EmptyState
            icon={SearchX}
            title="Нічого не знайдено"
            description="Спробуйте змінити пошуковий запит або скинути фільтри."
            action={
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Скинути фільтри
              </button>
            }
          />
        }
      />
    </section>
  );
}
