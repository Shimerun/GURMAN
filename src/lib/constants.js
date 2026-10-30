import { ROUTES } from './routes';

/** GURMAN operates in a single city, so it is a constant rather than user-selectable state. */
export const CITY = 'Житомир';
/** Locative form for running text ("магазини у Житомирі"). */
export const IN_CITY = 'у Житомирі';

/** ISO date (local) until which the weekly promo is valid. */
export const PROMO_VALID_UNTIL = '2026-11-04';

export const MOBILE_MENU_ID = 'mobile-menu';

export const SECTION_IDS = {
  categories: 'categories',
  promo: 'promo',
  stores: 'stores',
  loyalty: 'loyalty',
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
export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Рекомендовані' },
  { value: 'popular', label: 'За популярністю' },
  { value: 'rating', label: 'За рейтингом' },
  { value: 'price_asc', label: 'Спочатку дешевші' },
  { value: 'price_desc', label: 'Спочатку дорожчі' },
  { value: 'discount', label: 'За розміром знижки' },
];

export const DEFAULT_SORT = 'recommended';

export const STORE_CONTACTS = {
  phone: '0 800 000 800',
  phoneHref: 'tel:0800000800',
  email: 'hello@gurman.example',
  emailHref: 'mailto:hello@gurman.example',
  address: `${CITY}, вул. Михайла Грушевського, 62`,
  supportHours: 'Щодня 08:00–22:00',
  storeHours: 'Щодня 07:00–22:00',
};

/** Payment accepted at the checkout counter in every store. */
export const PAYMENT_METHODS = ['Банківська картка', 'Apple Pay / Google Pay', 'Готівка', 'Бонуси картки GURMAN'];

export const SOCIAL_LINKS = [
  { id: 'telegram', label: 'GURMAN у Telegram', href: 'https://t.me' },
  { id: 'instagram', label: 'GURMAN в Instagram', href: 'https://www.instagram.com' },
  { id: 'youtube', label: 'GURMAN на YouTube', href: 'https://www.youtube.com' },
  { id: 'facebook', label: 'GURMAN у Facebook', href: 'https://www.facebook.com' },
];
