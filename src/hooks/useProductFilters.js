import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_SORT } from '../lib/constants';
import { PRODUCT_SORTS } from '../services/productService';
import { useDebounce } from './useDebounce';

/** @typedef {import('../services/productService').ProductSort} ProductSort */

const PARAM = {
  search: 'q',
  sort: 'sort',
  minPrice: 'min',
  maxPrice: 'max',
  inStockOnly: 'stock',
  onlyPromo: 'promo',
};

const FLAG_ON = '1';

/** @param {string | null} value @returns {ProductSort} */
const parseSort = (value) => (PRODUCT_SORTS.includes(/** @type {ProductSort} */ (value)) ? /** @type {ProductSort} */ (value) : DEFAULT_SORT);

/** @param {string | null} value @returns {number | undefined} */
function parsePrice(value) {
  if (value === null || value.trim() === '') return undefined;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : undefined;
}

/**
 * Listing filters stored in the URL query, so results are shareable and survive reloads
 * and back/forward navigation. Search is typed into local state and written to the URL
 * debounced; the URL stays the single source of truth for what is actually queried.
 *
 * @param {{ categoryId?: string }} [options] Category pages pass the category from the route.
 */
export function useProductFilters({ categoryId } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get(PARAM.search) ?? '';

  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchInput, 300);
  // Distinguishes our own debounced writes from external URL changes (header search,
  // back button, reset) so a write echoing back never clobbers what the user is typing.
  const lastWrittenSearchRef = useRef(urlSearch);

  const updateSearchParams = useCallback(
    /** @param {(params: URLSearchParams) => void} mutate */
    (mutate) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          mutate(next);
          return next;
        },
        // Filter tweaks refine the current page: no history spam, no jump to the top.
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (urlSearch === lastWrittenSearchRef.current) return;
    lastWrittenSearchRef.current = urlSearch;
    setSearchInput(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    const nextSearch = debouncedSearch.trim();
    if (nextSearch === lastWrittenSearchRef.current) return;
    lastWrittenSearchRef.current = nextSearch;
    updateSearchParams((params) => (nextSearch ? params.set(PARAM.search, nextSearch) : params.delete(PARAM.search)));
  }, [debouncedSearch, updateSearchParams]);

  const filters = useMemo(() => {
    let minPrice = parsePrice(searchParams.get(PARAM.minPrice));
    let maxPrice = parsePrice(searchParams.get(PARAM.maxPrice));
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];

    return {
      category: categoryId,
      sort: parseSort(searchParams.get(PARAM.sort)),
      minPrice,
      maxPrice,
      inStockOnly: searchParams.get(PARAM.inStockOnly) === FLAG_ON,
      onlyPromo: searchParams.get(PARAM.onlyPromo) === FLAG_ON,
    };
  }, [searchParams, categoryId]);

  /** @param {ProductSort} sort */
  const setSort = useCallback(
    (sort) => updateSearchParams((params) => (sort === DEFAULT_SORT ? params.delete(PARAM.sort) : params.set(PARAM.sort, sort))),
    [updateSearchParams],
  );

  /** @param {string} name @param {boolean} isOn */
  const setFlag = useCallback(
    (name, isOn) => updateSearchParams((params) => (isOn ? params.set(name, FLAG_ON) : params.delete(name))),
    [updateSearchParams],
  );
  const setInStockOnly = useCallback((isOn) => setFlag(PARAM.inStockOnly, isOn), [setFlag]);
  const setOnlyPromo = useCallback((isOn) => setFlag(PARAM.onlyPromo, isOn), [setFlag]);

  /** @param {number | undefined} minPrice @param {number | undefined} maxPrice */
  const setPriceRange = useCallback(
    (minPrice, maxPrice) =>
      updateSearchParams((params) => {
        if (minPrice === undefined) params.delete(PARAM.minPrice);
        else params.set(PARAM.minPrice, String(minPrice));
        if (maxPrice === undefined) params.delete(PARAM.maxPrice);
        else params.set(PARAM.maxPrice, String(maxPrice));
      }),
    [updateSearchParams],
  );

  /** Clears every query param; the category, being part of the route, stays. */
  const resetFilters = useCallback(() => {
    setSearchInput('');
    updateSearchParams((params) => Object.values(PARAM).forEach((name) => params.delete(name)));
  }, [updateSearchParams]);

  const appliedSearch = urlSearch.trim();
  const hasPriceFilter = filters.minPrice !== undefined || filters.maxPrice !== undefined;

  /** Price, stock and promo: the options inside the filter panel (drives the mobile badge). */
  const activeFilterCount = Number(hasPriceFilter) + Number(filters.inStockOnly) + Number(filters.onlyPromo);

  const hasActiveFilters = activeFilterCount > 0 || Boolean(appliedSearch) || filters.sort !== DEFAULT_SORT;

  // Undefined keys are dropped by JSON.stringify, so equivalent queries share one cache key.
  const productParams = useMemo(
    () => ({
      search: appliedSearch || undefined,
      category: filters.category,
      onlyPromo: filters.onlyPromo || undefined,
      inStockOnly: filters.inStockOnly || undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort,
    }),
    [appliedSearch, filters],
  );

  return {
    searchInput,
    setSearchInput,
    appliedSearch,
    isSearchPending: searchInput.trim() !== appliedSearch,
    filters,
    setSort,
    setInStockOnly,
    setOnlyPromo,
    setPriceRange,
    resetFilters,
    activeFilterCount,
    hasActiveFilters,
    productParams,
  };
}

/** @typedef {ReturnType<typeof useProductFilters>} ProductFiltersState */
