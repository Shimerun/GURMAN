const MINUTES_IN_DAY = 24 * 60;

// Store hours are local to Ukraine, so "open now" must not depend on the visitor's timezone.
const createKyivTimeFormatter = () => {
  const options = { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' };
  try {
    return new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'Europe/Kyiv' });
  } catch {
    // Older ICU data only knows the legacy zone name.
    return new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'Europe/Kiev' });
  }
};

const kyivTimeFormatter = createKyivTimeFormatter();

/** @param {string} time 'HH:MM' ('24:00' allowed as end of day) */
const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/** @param {Date} date */
const getKyivMinutes = (date) => {
  const parts = kyivTimeFormatter.formatToParts(date);
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);
  return hour * 60 + minute;
};

/** @param {import('../services/storeService').StoreHours} hours */
export const isOpenAroundTheClock = (hours) =>
  toMinutes(hours.close) - toMinutes(hours.open) >= MINUTES_IN_DAY;

/**
 * @param {import('../services/storeService').StoreHours} hours
 * @param {Date} [date]
 */
export function isStoreOpen(hours, date = new Date()) {
  if (isOpenAroundTheClock(hours)) return true;

  const now = getKyivMinutes(date);
  const opensAt = toMinutes(hours.open);
  const closesAt = toMinutes(hours.close);

  // Overnight schedules (e.g. 20:00–02:00) wrap past midnight.
  return opensAt < closesAt ? now >= opensAt && now < closesAt : now >= opensAt || now < closesAt;
}

/** @param {import('../services/storeService').StoreHours} hours */
export const formatStoreHours = (hours) =>
  isOpenAroundTheClock(hours) ? 'Цілодобово' : `${hours.open}–${hours.close}`;
