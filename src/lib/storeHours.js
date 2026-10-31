const MINUTES_IN_DAY = 24 * 60;

/**
 * Business time is local to Ukraine (IANA zone "Europe/Kyiv" covers the whole country), so "open
 * now" or the current season must not depend on the visitor's timezone.
 * @param {Intl.DateTimeFormatOptions} options
 */
export const createUkraineFormatter = (options) => {
  try {
    return new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'Europe/Kyiv' });
  } catch {
    // Older ICU data only knows the legacy zone name.
    return new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'Europe/Kiev' });
  }
};

const ukraineTimeFormatter = createUkraineFormatter({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

/** @param {string} time 'HH:MM' ('24:00' allowed as end of day) */
const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/** @param {Date} date */
const getUkraineMinutes = (date) => {
  const parts = ukraineTimeFormatter.formatToParts(date);
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);
  return hour * 60 + minute;
};

/** @param {import('../services/storeService').StoreHours} hours */
export const isOpenAroundTheClock = (hours) => toMinutes(hours.close) - toMinutes(hours.open) >= MINUTES_IN_DAY;

/**
 * @param {import('../services/storeService').StoreHours} hours
 * @param {Date} [date]
 */
export function isStoreOpen(hours, date = new Date()) {
  if (isOpenAroundTheClock(hours)) return true;

  const now = getUkraineMinutes(date);
  const opensAt = toMinutes(hours.open);
  const closesAt = toMinutes(hours.close);

  // Overnight schedules (e.g. 20:00–02:00) wrap past midnight.
  return opensAt < closesAt ? now >= opensAt && now < closesAt : now >= opensAt || now < closesAt;
}

/** @param {import('../services/storeService').StoreHours} hours */
export const formatStoreHours = (hours) => (isOpenAroundTheClock(hours) ? 'Цілодобово' : `${hours.open}–${hours.close}`);

/**
 * @typedef {object} StoresOpenStatus
 * @property {boolean} isOpen At least one store is open
 * @property {string | null} time 'HH:MM': when the last open store closes, or when the first one opens; null when open around the clock
 */

/**
 * Network-wide status for the header: "open until …" or "opens at …".
 * @param {import('../services/storeService').Store[]} stores Non-empty
 * @param {Date} [date]
 * @returns {StoresOpenStatus}
 */
export function getStoresOpenStatus(stores, date = new Date()) {
  const openStores = stores.filter((store) => isStoreOpen(store.hours, date));
  if (openStores.length === 0) {
    const opensAt = stores.map((store) => store.hours.open).sort()[0];
    return { isOpen: false, time: opensAt };
  }
  if (openStores.some((store) => isOpenAroundTheClock(store.hours))) return { isOpen: true, time: null };
  const closesAt = openStores.map((store) => store.hours.close).sort().at(-1);
  return { isOpen: true, time: closesAt };
}
