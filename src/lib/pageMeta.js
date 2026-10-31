import { BRAND_NAME, CITY, IN_CITY } from '../config/business';
import { formatPrice } from './format';

/**
 * Page titles and descriptions, shared by the pages (`useDocumentTitle`, at runtime) and the
 * build-time page generator (scripts/seoPages.js, for link previews and search engines), so both
 * always say the same thing. Pure: Node imports this module.
 */

/** @typedef {{ title: string, description: string }} PageMeta */

export const DEFAULT_PAGE_TITLE = `${BRAND_NAME} — супермаркет свіжих продуктів ${IN_CITY}`;
export const DEFAULT_PAGE_DESCRIPTION = `${BRAND_NAME} — супермаркет свіжих продуктів ${IN_CITY}: акції тижня, каталог із цінами та два магазини поруч.`;

/** @param {string | undefined} pageTitle undefined for the home page */
export const formatPageTitle = (pageTitle) => (pageTitle ? `${pageTitle} — ${BRAND_NAME}` : DEFAULT_PAGE_TITLE);

export const STATIC_PAGE_META = {
  catalog: {
    title: 'Каталог товарів',
    description: `Каталог ${BRAND_NAME} ${IN_CITY}: понад 70 товарів із цінами, акціями й наявністю — фрукти, овочі, м’ясо, молочні продукти, випічка та напої.`,
  },
  about: {
    title: 'Про нас',
    description: `Історія ${BRAND_NAME} — мережі з двох супермаркетів свіжих продуктів ${IN_CITY}: місцеві постачальники, власна пекарня й гарантія якості.`,
  },
  delivery: {
    title: 'Як купити: оплата й повернення',
    description: `Обирайте товари на сайті й купуйте в магазинах ${BRAND_NAME} ${IN_CITY}. Способи оплати, повернення та відповіді на питання.`,
  },
  contacts: {
    title: 'Магазини та контакти',
    description: `Адреси, графік роботи й телефони двох магазинів ${BRAND_NAME} ${IN_CITY}, маршрут до магазину та форма зворотного зв’язку.`,
  },
  privacy: {
    title: 'Політика конфіденційності',
    description: `Як ${BRAND_NAME} обробляє персональні дані відвідувачів сайту: що збираємо, навіщо, як довго зберігаємо та які у вас права.`,
  },
  cart: {
    title: 'Кошик',
    description: `Кошик ${BRAND_NAME}: перевірте товари й суму перед покупкою в магазинах ${IN_CITY}.`,
  },
  favorites: {
    title: 'Обране',
    description: `Улюблені товари ${BRAND_NAME}, збережені на цьому пристрої.`,
  },
};

/** @param {import('../services/productService').Product} product @returns {PageMeta} */
export const getProductPageMeta = (product) => ({
  title: product.title,
  description: `${product.title}: ${formatPrice(product.price)} / ${product.unit} у магазинах ${BRAND_NAME} ${IN_CITY}. ${product.shortDescription}`,
});

/** @param {import('../services/productService').Category} category @returns {PageMeta} */
export const getCategoryPageMeta = (category) => ({
  title: category.title,
  description: `${category.title} у ${BRAND_NAME}, ${CITY}: ${category.description}`,
});
