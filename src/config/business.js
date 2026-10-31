/**
 * Everything specific to the real business, in one place: contacts, seller details, company
 * facts and content switches. Values marked DEMO are placeholders of the demo build — replace
 * them with the client's real data before a public launch, then set `IS_DEMO_CONTENT` to false.
 */

/**
 * true while the site runs on demo content. It shows the "fictional brand" disclaimer and the
 * privacy-policy template notice, and enables the invented product ratings (see FEATURES).
 */
export const IS_DEMO_CONTENT = true;

export const FEATURES = {
  /**
   * Star ratings, review counts and the "За рейтингом" sort. The ratings in the mock data are
   * invented, so they follow the demo switch; enable on a public site only with real reviews.
   */
  productRatings: IS_DEMO_CONTENT,
};

export const BRAND_NAME = 'GURMAN';

/** GURMAN operates in a single city, so it is a constant rather than user-selectable state. */
export const CITY = 'Житомир';
/** Locative form for running text ("магазини у Житомирі"). */
export const IN_CITY = 'у Житомирі';

/** Store addresses and hours live in `src/data/mockStores.json` (served by storeService). */
export const STORE_CONTACTS = {
  phone: '0 800 000 800', // DEMO
  phoneHref: 'tel:0800000800', // DEMO
  email: 'hello@gurman.example', // DEMO
  emailHref: 'mailto:hello@gurman.example', // DEMO
  address: `${CITY}, вул. Михайла Грушевського, 62`,
  supportHours: 'Щодня 08:00–22:00', // DEMO: confirm the hotline hours
  storeHours: 'Щодня 07:00–22:00',
};

/**
 * @typedef {object} CoffeeDrink
 * @property {string} name
 * @property {number} price  UAH
 */

/**
 * Coffee to go, brewed in both stores during opening hours.
 * Drinks, prices and the coffee brand come from the owner (2026-10-31).
 */
export const COFFEE_TO_GO = {
  hours: STORE_CONTACTS.storeHours,
  /** @type {CoffeeDrink[]} */
  menu: [
    { name: 'Еспресо', price: 20 },
    { name: 'Американо', price: 20 },
    { name: 'Американо з молоком', price: 25 },
    { name: 'Капучино', price: 30 },
    { name: 'Лате', price: 35 },
    { name: 'Флет вайт', price: 30 },
    { name: 'Шоколад', price: 30 },
  ],
  /** Coffee brand brewed in the stores; its logo is on the cup illustration. */
  brand: 'Gemini',
};

/**
 * Visitor statistics via Plausible Analytics (no cookies, so no consent banner). Off while
 * `scriptSrc` is null. To enable: add the site in Plausible, open Site installation and copy the
 * script URL from the snippet (https://plausible.io/js/pa-….js). The CSP in vite.config.js then
 * allows that host automatically. Goals to create in Plausible: see `ANALYTICS_EVENTS` in lib/analytics.js.
 * @type {{ scriptSrc: string | null }}
 */
export const ANALYTICS = {
  scriptSrc: null, // DEMO: not set up yet
};

/**
 * Public address of the site, without a trailing slash. Link previews (Open Graph) need absolute
 * image URLs; null keeps them relative, which most messengers still resolve.
 * @type {string | null}
 */
export const SITE_URL = null; // DEMO: e.g. 'https://gurman.example' once the domain is bought

/** Payment accepted at the checkout counter in every store. */
export const PAYMENT_METHODS = ['Банківська картка', 'Apple Pay / Google Pay', 'Готівка', 'Бонуси картки GURMAN'];

/** DEMO: links point at the networks' home pages until the client's profiles are known. */
export const SOCIAL_LINKS = [
  { id: 'telegram', label: 'GURMAN у Telegram', href: 'https://t.me' },
  { id: 'instagram', label: 'GURMAN в Instagram', href: 'https://www.instagram.com' },
  { id: 'youtube', label: 'GURMAN на YouTube', href: 'https://www.youtube.com' },
  { id: 'facebook', label: 'GURMAN у Facebook', href: 'https://www.facebook.com' },
];

/**
 * @typedef {object} LegalEntity
 * @property {string} name   ФОП or ТОВ name as registered
 * @property {string} taxId  ЄДРПОУ (company) or РНОКПП (ФОП)
 * @property {string} address registered address
 * @property {string} email   contact for personal-data requests
 */

/**
 * Seller details shown in the footer and used as the data controller in the privacy policy.
 * DEMO: null until the client provides them; the policy then shows bracketed placeholders.
 * @type {LegalEntity | null}
 */
export const LEGAL_ENTITY = null;

/** ISO date of the current privacy-policy text. */
export const PRIVACY_POLICY_UPDATED = '2026-10-31';

/** DEMO: invented company facts used on the About page and the home benefits strip. */
export const COMPANY_FACTS = {
  foundedYear: 2014,
  partnerSupplierCount: 120,
};

/** DEMO: invented company history for the About page ("Як ми зростали"). */
export const COMPANY_MILESTONES = [
  {
    year: String(COMPANY_FACTS.foundedYear),
    title: 'Перший магазин на Грушевського',
    description: 'Невелика крамниця з фермерськими продуктами та власною пекарнею.',
  },
  { year: '2023', title: 'Другий магазин', description: 'Відкрили магазин на вулиці Гагаріна.' },
  { year: '2026', title: 'Новий сайт', description: 'Каталог із цінами, акції тижня й адреси магазинів — в одному місці.' },
];
