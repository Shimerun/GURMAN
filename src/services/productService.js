import { getDiscountPercent } from '../lib/format';
import { buildCatalog, isAvailable } from './catalog';
import { ServiceError, simulateNetworkLatency } from './simulateNetworkLatency';

/** @typedef {'in_stock' | 'low_stock' | 'out_of_stock'} StockStatus */
/** @typedef {'кг' | 'шт' | 'л' | 'уп'} Unit */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} title
 * @property {string} category Category id
 * @property {string} categoryTitle Denormalized for cards and breadcrumbs
 * @property {number} price Current price in UAH per `unit`
 * @property {number | null} oldPrice Price before discount, null when not on promo
 * @property {boolean} isPromo
 * @property {StockStatus} stockStatus
 * @property {number} stockQty Upper bound for cart quantity
 * @property {Unit} unit
 * @property {string} image Absolute URL or '' (UI falls back to a placeholder)
 * @property {number} rating 1..5
 * @property {number} reviewsCount
 * @property {number} popularity Orders over the last 30 days
 * @property {string} origin
 * @property {string} producer
 * @property {string} description
 * @property {string} shortDescription First sentence of `description`
 * @property {string | null} ingredients null for fresh produce sold as-is
 * @property {Record<string, string>} characteristics Ordered label → value pairs, storage keys excluded
 * @property {ProductStorage} storage
 * @property {ProductBadge[]} badges
 */

/**
 * @typedef {Object} ProductStorage
 * @property {string} conditions Product-specific when known, otherwise the category default
 * @property {string | null} shelfLife
 */

/** @typedef {'sale' | 'popular'} ProductBadge */

/**
 * @typedef {Object} Category
 * @property {string} id URL slug
 * @property {string} title
 * @property {string} description
 * @property {string} icon Icon key resolved by the UI
 * @property {string} image
 * @property {string} storage Default storage advice for the category's products
 * @property {number} productCount
 * @property {number} availableCount Products not out of stock
 */

/** @typedef {'recommended' | 'popular' | 'rating' | 'price_asc' | 'price_desc' | 'discount'} ProductSort */

/**
 * @typedef {Object} ProductQueryParams
 * @property {string} [search] Case-insensitive match on title and producer
 * @property {string} [category] Category id
 * @property {boolean} [onlyPromo]
 * @property {boolean} [inStockOnly] Excludes `out_of_stock`; `low_stock` still counts as available
 * @property {number} [minPrice]
 * @property {number} [maxPrice]
 * @property {ProductSort} [sort]
 */

const SERVICE = 'productService';
const LOCALE = 'uk-UA';

const getProductDiscount = (product) => getDiscountPercent(product.price, product.oldPrice);

/** @type {Record<ProductSort, (a: Product, b: Product) => number>} */
const SORT_COMPARATORS = {
  // Buyable items first, then this week's promos, then what sells best.
  recommended: (a, b) =>
    Number(isAvailable(b)) - Number(isAvailable(a)) || Number(b.isPromo) - Number(a.isPromo) || b.popularity - a.popularity,
  popular: (a, b) => b.popularity - a.popularity,
  rating: (a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount,
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  discount: (a, b) => getProductDiscount(b) - getProductDiscount(a),
};

export const PRODUCT_SORTS = /** @type {ProductSort[]} */ (Object.keys(SORT_COMPARATORS));

/** @type {Promise<import('./catalog').Catalog> | undefined} */
let catalogPromise;

/**
 * The mock catalog is a separate chunk, fetched on first use like a real API response, so its
 * ~65 kB stay out of the entry bundle. A failed load is not cached: the next call (a retry) tries again.
 * @param {string} operation
 * @returns {Promise<import('./catalog').Catalog>}
 */
function loadCatalog(operation) {
  catalogPromise ??= Promise.all([import('../data/mockProducts.json'), import('../data/mockCategories.json')])
    .then(([productsModule, categoriesModule]) => buildCatalog(productsModule.default, categoriesModule.default))
    .catch((error) => {
      catalogPromise = undefined;
      throw new ServiceError(`${SERVICE}.${operation}: could not load the catalog`, { service: SERVICE, operation, code: 'NETWORK', cause: error });
    });
  return catalogPromise;
}

/**
 * Network latency and the catalog download run in parallel, as one simulated round-trip.
 * @param {string} operation
 */
async function fetchCatalog(operation) {
  const [catalog] = await Promise.all([loadCatalog(operation), simulateNetworkLatency({ service: SERVICE, operation })]);
  return catalog;
}

/**
 * @param {ProductQueryParams} [params]
 * @returns {Promise<Product[]>}
 */
async function getProducts({ search = '', category, onlyPromo = false, inStockOnly = false, minPrice, maxPrice, sort } = {}) {
  const comparator = sort ? SORT_COMPARATORS[sort] : undefined;
  if (sort && !comparator) {
    throw new ServiceError(`${SERVICE}.getProducts: unsupported sort "${sort}". Expected one of: ${PRODUCT_SORTS.join(', ')}`, {
      service: SERVICE,
      operation: 'getProducts',
      code: 'INVALID_INPUT',
    });
  }

  const { products } = await fetchCatalog('getProducts');

  const normalizedSearch = search.trim().toLocaleLowerCase(LOCALE);

  const matches = products.filter(
    (product) =>
      (!normalizedSearch ||
        product.title.toLocaleLowerCase(LOCALE).includes(normalizedSearch) ||
        product.producer.toLocaleLowerCase(LOCALE).includes(normalizedSearch)) &&
      (!category || product.category === category) &&
      (!onlyPromo || product.isPromo) &&
      (!inStockOnly || isAvailable(product)) &&
      (minPrice === undefined || product.price >= minPrice) &&
      (maxPrice === undefined || product.price <= maxPrice),
  );

  // `filter` already returned a fresh array, so sorting in place cannot mutate the source.
  return comparator ? matches.sort(comparator) : matches;
}

/** @returns {Promise<Category[]>} */
async function getCategories() {
  const { categories } = await fetchCatalog('getCategories');
  return [...categories];
}

/**
 * @param {string} categoryId
 * @returns {Promise<Category>}
 */
async function getCategoryById(categoryId) {
  const { categories } = await fetchCatalog('getCategoryById');

  const category = categories.find((candidate) => candidate.id === categoryId);
  if (!category) {
    throw new ServiceError(`${SERVICE}.getCategoryById: category "${categoryId}" not found`, {
      service: SERVICE,
      operation: 'getCategoryById',
      code: 'NOT_FOUND',
    });
  }
  return category;
}

/**
 * @param {string} productId
 * @returns {Promise<Product>}
 */
async function getProductById(productId) {
  const { productById } = await fetchCatalog('getProductById');

  const product = productById.get(productId);
  if (!product) {
    throw new ServiceError(`${SERVICE}.getProductById: product "${productId}" not found`, {
      service: SERVICE,
      operation: 'getProductById',
      code: 'NOT_FOUND',
    });
  }
  return product;
}

/**
 * Products in the order of `productIds`; ids that no longer exist (delisted products) are skipped.
 * @param {string[]} productIds
 * @returns {Promise<Product[]>}
 */
async function getProductsByIds(productIds) {
  if (!Array.isArray(productIds) || productIds.some((productId) => typeof productId !== 'string')) {
    throw new ServiceError(`${SERVICE}.getProductsByIds: expected an array of product id strings`, {
      service: SERVICE,
      operation: 'getProductsByIds',
      code: 'INVALID_INPUT',
    });
  }

  const { productById } = await fetchCatalog('getProductsByIds');

  return productIds.map((productId) => productById.get(productId)).filter((product) => product !== undefined);
}

export const productService = { getProducts, getProductsByIds, getCategories, getCategoryById, getProductById };
