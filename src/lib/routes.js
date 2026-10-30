export const ROUTES = {
  home: '/',
  catalog: '/catalog',
  cart: '/cart',
  about: '/about',
  contacts: '/contacts',
};

/** @typedef {{ search?: string, onlyPromo?: boolean, sort?: string }} ListingQuery */

/**
 * Keys mirror the query params read by `useProductFilters`.
 * @param {string} pathname
 * @param {ListingQuery} query
 */
function withListingQuery(pathname, { search, onlyPromo, sort }) {
  const searchParams = new URLSearchParams();
  if (search?.trim()) searchParams.set('q', search.trim());
  if (onlyPromo) searchParams.set('promo', '1');
  if (sort) searchParams.set('sort', sort);

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/** @param {string} categoryId @param {ListingQuery} [query] */
export const getCategoryPath = (categoryId, query = {}) => withListingQuery(`/category/${encodeURIComponent(categoryId)}`, query);

/** @param {string} productId */
export const getProductPath = (productId) => `/product/${encodeURIComponent(productId)}`;

/** @param {ListingQuery} [query] */
export const getCatalogPath = (query = {}) => withListingQuery(ROUTES.catalog, query);

/** Catalog, category and product pages all belong to the "Каталог" navigation section. */
const isCatalogSection = (pathname) => pathname === ROUTES.catalog || pathname.startsWith('/category/') || pathname.startsWith('/product/');

/**
 * Active state for top-level nav links: "Каталог" stays active on category and product pages.
 * @param {string} to
 * @param {string} pathname
 * @param {boolean} isActive NavLink's own match
 */
export const isNavLinkActive = (to, pathname, isActive) => (to === ROUTES.catalog ? isCatalogSection(pathname) : isActive);
