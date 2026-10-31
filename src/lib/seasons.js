import { createUkraineFormatter } from './storeHours';

/** @typedef {'winter' | 'spring' | 'summer' | 'autumn'} Season */

/** @type {Season[]} January … December */
const SEASON_BY_MONTH = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];

const ukraineMonthFormatter = createUkraineFormatter({ month: 'numeric' });

/**
 * Calendar season in Ukraine; the seasonal decorations switch by themselves on the 1st of
 * December, March, June and September.
 * @param {Date} [date]
 * @returns {Season}
 */
export function getSeason(date = new Date()) {
  const month = Number(ukraineMonthFormatter.format(date));
  return SEASON_BY_MONTH[month - 1];
}
