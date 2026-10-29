import mockCategories from '../data/mockCategories.json';
import mockProducts from '../data/mockProducts.json';
import { getDiscountPercent } from '../lib/format';
import { ServiceError, simulateNetworkLatency } from './simulateNetworkLatency';

/** @typedef {'in_stock' | 'low_stock' | 'out_of_stock'} StockStatus */
/** @typedef {'кг' | 'шт' | 'л' | 'уп'} Unit */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} title
 * @property {string} category Category id
 * @property {number} price Current price in UAH per `unit`
 * @property {number | null} oldPrice Price before discount, null when not on promo
 * @property {boolean} isPromo
 * @property {StockStatus} stockStatus
 * @property {number} stockQty Upper bound for cart quantity
 * @property {Unit} unit
 * @property {string} image Absolute URL or '' (UI falls back to a placeholder)
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} title
 * @property {string} icon Icon key resolved by the UI
 */

/** @typedef {'price_asc' | 'price_desc' | 'discount'} ProductSort */

/**
 * @typedef {Object} ProductQueryParams
 * @property {string} [search] Case-insensitive match on title
 * @property {string} [category] Category id
 * @property {boolean} [onlyPromo]
 * @property {boolean} [inStockOnly] Excludes `out_of_stock`; `low_stock` still counts as available
 * @property {ProductSort} [sort]
 */

const SERVICE = 'productService';

const getProductDiscount = (product) => getDiscountPercent(product.price, product.oldPrice);

/** @type {Record<ProductSort, (a: Product, b: Product) => number>} */
const SORT_COMPARATORS = {
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  discount: (a, b) => getProductDiscount(b) - getProductDiscount(a),
};

/**
 * @param {ProductQueryParams} [params]
 * @returns {Promise<Product[]>}
 */
async function getProducts({ search = '', category, onlyPromo = false, inStockOnly = false, sort } = {}) {
  const comparator = sort ? SORT_COMPARATORS[sort] : undefined;
  if (sort && !comparator) {
    throw new ServiceError(
      `${SERVICE}.getProducts: unsupported sort "${sort}". Expected one of: ${Object.keys(SORT_COMPARATORS).join(', ')}`,
      { service: SERVICE, operation: 'getProducts' },
    );
  }

  await simulateNetworkLatency({ service: SERVICE, operation: 'getProducts' });

  const normalizedSearch = search.trim().toLocaleLowerCase('uk-UA');

  /** @type {Product[]} */
  const products = mockProducts.filter(
    (product) =>
      (!normalizedSearch || product.title.toLocaleLowerCase('uk-UA').includes(normalizedSearch)) &&
      (!category || product.category === category) &&
      (!onlyPromo || product.isPromo) &&
      (!inStockOnly || product.stockStatus !== 'out_of_stock'),
  );

  // `filter` already returned a fresh array, so sorting in place cannot mutate the mock source.
  return comparator ? products.sort(comparator) : products;
}

/** @returns {Promise<Category[]>} */
async function getCategories() {
  await simulateNetworkLatency({ service: SERVICE, operation: 'getCategories' });
  return [...mockCategories];
}

/**
 * @param {string} productId
 * @returns {Promise<Product>}
 */
async function getProductById(productId) {
  await simulateNetworkLatency({ service: SERVICE, operation: 'getProductById' });

  const product = mockProducts.find((candidate) => candidate.id === productId);
  if (!product) {
    throw new ServiceError(`${SERVICE}.getProductById: product "${productId}" not found`, {
      service: SERVICE,
      operation: 'getProductById',
    });
  }
  return product;
}

export const productService = { getProducts, getCategories, getProductById };
