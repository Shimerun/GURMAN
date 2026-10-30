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
