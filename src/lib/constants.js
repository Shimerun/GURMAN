export const CITIES = ['Київ', 'Львів', 'Харків', 'Одеса', 'Дніпро'];
export const DEFAULT_CITY = CITIES[0];

export const FREE_DELIVERY_THRESHOLD = 800;
export const DELIVERY_FEE = 79;

/** ISO date (local) until which the weekly promo is valid. */
export const PROMO_VALID_UNTIL = '2026-11-04';

export const SECTION_IDS = {
  promo: 'promo',
  catalog: 'catalog',
  loyalty: 'loyalty',
  stores: 'stores',
  app: 'app',
};

export const NAV_LINKS = [
  { label: 'Акції', href: `#${SECTION_IDS.promo}` },
  { label: 'Магазини', href: `#${SECTION_IDS.stores}` },
  { label: 'Картка лояльності', href: `#${SECTION_IDS.loyalty}` },
];

export const SORT_OPTIONS = [
  { value: '', label: 'За замовчуванням' },
  { value: 'price_asc', label: 'Ціна ↑' },
  { value: 'price_desc', label: 'Ціна ↓' },
  { value: 'discount', label: 'Знижка' },
];
