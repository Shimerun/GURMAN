import { FEATURES } from '../config/business';
import { ROUTES } from './routes';

// Business data (contacts, city, payment, socials) lives in src/config/business.js; re-exported
// here so app code keeps a single import location for shared constants.
export { CITY, IN_CITY, PAYMENT_METHODS, SOCIAL_LINKS, STORE_CONTACTS } from '../config/business';

/** ISO date (local) until which the weekly promo is valid. */
export const PROMO_VALID_UNTIL = '2026-11-04';

export const MOBILE_MENU_ID = 'mobile-menu';

export const SECTION_IDS = {
  categories: 'categories',
  promo: 'promo',
  stores: 'stores',
};

export const NAV_LINKS = [
  { label: 'Головна', to: ROUTES.home },
  { label: 'Каталог', to: ROUTES.catalog },
  { label: 'Як купити', to: ROUTES.delivery },
  { label: 'Про нас', to: ROUTES.about },
  { label: 'Магазини', to: ROUTES.contacts },
];

export const PROMO_LISTING_QUERY = { onlyPromo: true, sort: 'discount' };

/** Example queries: typed into the header search placeholder and offered on empty results. */
export const SEARCH_SUGGESTIONS = ['молоко', 'хліб', 'сир', 'яйця', 'банани'];

/** @type {{ value: import('../services/productService').ProductSort, label: string }[]} */
const ALL_SORT_OPTIONS = [
  { value: 'recommended', label: 'Рекомендовані' },
  { value: 'popular', label: 'За популярністю' },
  { value: 'rating', label: 'За рейтингом' },
  { value: 'price_asc', label: 'Спочатку дешевші' },
  { value: 'price_desc', label: 'Спочатку дорожчі' },
  { value: 'discount', label: 'За розміром знижки' },
];

/** Sorting by the (invented) ratings is offered only while ratings are shown. */
export const SORT_OPTIONS = FEATURES.productRatings ? ALL_SORT_OPTIONS : ALL_SORT_OPTIONS.filter((option) => option.value !== 'rating');

export const DEFAULT_SORT = 'recommended';
