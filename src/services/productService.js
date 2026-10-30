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

const POPULAR_BADGE_COUNT = 12;
const STORAGE_CONDITIONS_KEY = 'Умови зберігання';
const SHELF_LIFE_KEY = 'Термін зберігання';

const getProductDiscount = (product) => getDiscountPercent(product.price, product.oldPrice);
const isAvailable = (product) => product.stockStatus !== 'out_of_stock';

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

const categoryById = new Map(mockCategories.map((category) => [category.id, category]));

const popularProductIds = new Set(
  [...mockProducts]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, POPULAR_BADGE_COUNT)
    .map((product) => product.id),
);

/** @param {string} description */
const getFirstSentence = (description) => description.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? description;

/** @type {Product[]} */
const products = mockProducts.map((product) => {
  const category = categoryById.get(product.category);
  const { [STORAGE_CONDITIONS_KEY]: storageConditions, [SHELF_LIFE_KEY]: shelfLife, ...characteristics } = product.characteristics;

  /** @type {ProductBadge[]} */
  const badges = [];
  if (product.isPromo) badges.push('sale');
  if (popularProductIds.has(product.id)) badges.push('popular');

  return {
    ...product,
    categoryTitle: category?.title ?? '',
    shortDescription: getFirstSentence(product.description),
    characteristics,
    storage: { conditions: storageConditions ?? category?.storage ?? '', shelfLife: shelfLife ?? null },
    badges,
  };
});

/** @type {Category[]} */
const categories = mockCategories.map((category) => {
  const categoryProducts = products.filter((product) => product.category === category.id);
  return {
    ...category,
    productCount: categoryProducts.length,
    availableCount: categoryProducts.filter(isAvailable).length,
  };
});

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

  await simulateNetworkLatency({ service: SERVICE, operation: 'getProducts' });

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
  await simulateNetworkLatency({ service: SERVICE, operation: 'getCategories' });
  return [...categories];
}

/**
 * @param {string} categoryId
 * @returns {Promise<Category>}
 */
async function getCategoryById(categoryId) {
  await simulateNetworkLatency({ service: SERVICE, operation: 'getCategoryById' });

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
  await simulateNetworkLatency({ service: SERVICE, operation: 'getProductById' });

  const product = products.find((candidate) => candidate.id === productId);
  if (!product) {
    throw new ServiceError(`${SERVICE}.getProductById: product "${productId}" not found`, {
      service: SERVICE,
      operation: 'getProductById',
      code: 'NOT_FOUND',
    });
  }
  return product;
}

export const productService = { getProducts, getCategories, getCategoryById, getProductById };
