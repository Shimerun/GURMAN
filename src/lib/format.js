const priceFormatter = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'UAH',
  maximumFractionDigits: 0,
});

const dayMonthFormatter = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long' });

const pluralRules = new Intl.PluralRules('uk-UA');

/** @param {number} amount */
export const formatPrice = (amount) => priceFormatter.format(amount);

/**
 * @param {number} price
 * @param {number | null} oldPrice
 * @returns {number} whole percent, 0 when there is no real discount
 */
export const getDiscountPercent = (price, oldPrice) =>
  oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0;

/** @param {string} isoDate 'YYYY-MM-DD', interpreted in local time to avoid an off-by-one day in negative UTC offsets */
export const formatDayMonth = (isoDate) => dayMonthFormatter.format(new Date(`${isoDate}T00:00:00`));

/**
 * @param {number} count
 * @param {{ one: string, few: string, many: string, other: string }} forms
 */
export const pluralize = (count, forms) => `${count} ${forms[pluralRules.select(count)]}`;

export const PRODUCT_FORMS = { one: 'товар', few: 'товари', many: 'товарів', other: 'товару' };
export const STORE_FORMS = { one: 'магазин', few: 'магазини', many: 'магазинів', other: 'магазину' };
export const REVIEW_FORMS = { one: 'відгук', few: 'відгуки', many: 'відгуків', other: 'відгуку' };