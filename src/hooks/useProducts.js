import { productService } from '../services/productService';
import { useAsyncData } from './useAsyncData';

/** @typedef {import('../services/productService').Product} Product */
/** @typedef {import('../services/productService').Category} Category */

/** Stable reference so consumers' memo dependencies don't change while loading. */
const EMPTY_LIST = [];

/**
 * The only entry point from components to `productService`.
 * @param {import('../services/productService').ProductQueryParams} [params]
 */
export function useProducts(params = {}) {
  const query = useAsyncData(() => productService.getProducts(params), `products:${JSON.stringify(params)}`);
  return { ...query, /** @type {Product[]} */ data: query.data ?? EMPTY_LIST };
}

/** Fewer characters match too much of the catalog to be useful as suggestions. */
export const MIN_SUGGESTION_QUERY_LENGTH = 2;

/**
 * Search-as-you-type matches, best first (in stock, promo, popular). Idle for short queries.
 * @param {string} query already debounced by the caller
 */
export function useProductSuggestions(query) {
  const search = query.trim();
  const isEnabled = search.length >= MIN_SUGGESTION_QUERY_LENGTH;
  const suggestionsQuery = useAsyncData(
    () => productService.getProducts({ search, sort: 'recommended' }),
    isEnabled ? `products:suggestions:${search.toLocaleLowerCase('uk-UA')}` : null,
  );
  return { ...suggestionsQuery, /** @type {Product[]} */ data: suggestionsQuery.data ?? EMPTY_LIST };
}

/** Products for a list of ids (e.g. favourites), in that order. @param {string[]} productIds */
export function useProductsByIds(productIds) {
  const query = useAsyncData(() => productService.getProductsByIds(productIds), `products:ids:${productIds.join(',')}`);
  return { ...query, /** @type {Product[]} */ data: query.data ?? EMPTY_LIST };
}

/** @param {string} productId */
export function useProduct(productId) {
  const query = useAsyncData(() => productService.getProductById(productId), `product:${productId}`);
  return { ...query, /** @type {Product | undefined} */ data: query.data };
}

export function useCategories() {
  const query = useAsyncData(() => productService.getCategories(), 'categories');
  return { ...query, /** @type {Category[]} */ data: query.data ?? EMPTY_LIST };
}

/** @param {string} categoryId */
export function useCategory(categoryId) {
  const query = useAsyncData(() => productService.getCategoryById(categoryId), `category:${categoryId}`);
  return { ...query, /** @type {Category | undefined} */ data: query.data };
}
