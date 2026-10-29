import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from './useDebounce';

/** @typedef {{ onlyPromo: boolean, inStockOnly: boolean, sort: '' | import('../services/productService').ProductSort }} CatalogFilters */

/** @type {CatalogFilters} */
const DEFAULT_FILTERS = { onlyPromo: false, inStockOnly: false, sort: '' };

/** Catalog filter state, owned by App so navbar, home sections and catalog stay in sync. */
export function useCatalogFilters() {
  const [selectedCategory, setSelectedCategory] = useState(/** @type {string | null} */ (null));
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const debouncedSearch = useDebounce(searchQuery, 300);

  /** @type {<K extends keyof CatalogFilters>(name: K, value: CatalogFilters[K]) => void} */
  const updateFilter = useCallback((name, value) => {
    setFilters((previous) => ({ ...previous, [name]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedCategory(null);
    setSearchQuery('');
    setFilters(DEFAULT_FILTERS);
  }, []);

  /** Resets toggles and sort only; keeps category and search (mobile filter sheet). */
  const resetFilterOptions = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const activeFilterOptionsCount = Number(filters.onlyPromo) + Number(filters.inStockOnly) + Number(Boolean(filters.sort));

  // Undefined keys are dropped by JSON.stringify, so equivalent queries share one cache key.
  const productParams = useMemo(
    () => ({
      search: debouncedSearch.trim() || undefined,
      category: selectedCategory ?? undefined,
      onlyPromo: filters.onlyPromo || undefined,
      inStockOnly: filters.inStockOnly || undefined,
      sort: filters.sort || undefined,
    }),
    [debouncedSearch, selectedCategory, filters],
  );

  const hasActiveFilters = Boolean(
    selectedCategory || searchQuery.trim() || filters.onlyPromo || filters.inStockOnly || filters.sort,
  );

  return {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    filters,
    updateFilter,
    resetFilters,
    resetFilterOptions,
    activeFilterOptionsCount,
    productParams,
    hasActiveFilters,
  };
}
