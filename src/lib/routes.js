export const ROUTES = {
  home: '/',
  catalog: '/catalog',
  cart: '/cart',
  about: '/about',
  delivery: '/delivery',
  contacts: '/contacts',
};

/** Router state that tells the cart page to open the checkout dialog straight away. */
export const OPEN_CHECKOUT_STATE = { openCheckout: true };

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

/** Google Maps directions to a street address (opens the app on phones). @param {string} address */
export const getDirectionsUrl = (address) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

/**
 * True on the catalog-wide promo listing, which gets its own nav item. A category page filtered
 * to promos still belongs to "Каталог".
 * @param {string} pathname
 * @param {string} search
 */
export const isPromoListing = (pathname, search) => pathname === ROUTES.catalog && new URLSearchParams(search).get('promo') === '1';

/** Catalog, category and product pages all belong to the "Каталог" navigation section. */
const isCatalogSection = (pathname) => pathname === ROUTES.catalog || pathname.startsWith('/category/') || pathname.startsWith('/product/');

/**
 * Active state for top-level nav links: "Каталог" stays active on category and product pages.
 * @param {string} to
 * @param {string} pathname
 * @param {boolean} isActive NavLink's own match
 */
export const isNavLinkActive = (to, pathname, isActive) => (to === ROUTES.catalog ? isCatalogSection(pathname) : isActive);
