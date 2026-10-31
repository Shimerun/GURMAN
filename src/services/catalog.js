/**
 * Pure catalog derivation shared by the product service (in the browser) and the build-time page
 * generator (scripts/seoPages.js), so product pages and their link previews describe products
 * identically. No browser APIs and no `import.meta` here: Node imports this module.
 */

/** @typedef {import('./productService').Product} Product */
/** @typedef {import('./productService').Category} Category */
/** @typedef {import('./productService').ProductBadge} ProductBadge */

const POPULAR_BADGE_COUNT = 12;
const STORAGE_CONDITIONS_KEY = 'Умови зберігання';
const SHELF_LIFE_KEY = 'Термін зберігання';

/** In stock or running low; only `out_of_stock` cannot be bought. @param {Product} product */
export const isAvailable = (product) => product.stockStatus !== 'out_of_stock';

/**
 * @typedef {Object} Catalog
 * @property {Product[]} products
 * @property {Map<string, Product>} productById
 * @property {Category[]} categories
 */

/** @param {string} description */
const getFirstSentence = (description) => description.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? description;

/**
 * Derives the UI-ready catalog (denormalized titles, badges, storage, counts) from the raw records.
 * @param {any[]} rawProducts
 * @param {any[]} rawCategories
 * @returns {Catalog}
 */
export function buildCatalog(rawProducts, rawCategories) {
  const categoryById = new Map(rawCategories.map((category) => [category.id, category]));
  const popularProductIds = new Set(
    [...rawProducts]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, POPULAR_BADGE_COUNT)
      .map((product) => product.id),
  );

  /** @type {Product[]} */
  const products = rawProducts.map((product) => {
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
  const categories = rawCategories.map((category) => {
    const categoryProducts = products.filter((product) => product.category === category.id);
    return {
      ...category,
      productCount: categoryProducts.length,
      availableCount: categoryProducts.filter(isAvailable).length,
    };
  });

  return { products, productById: new Map(products.map((product) => [product.id, product])), categories };
}
