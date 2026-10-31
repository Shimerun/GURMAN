import { BRAND_NAME, IN_CITY, SITE_URL, STORE_CONTACTS } from '../config/business';
import { formatPrice } from './format';

/** @typedef {import('../store/useCartStore').CartItem} CartItem */

export const SHOPPING_LIST_TITLE = `Список покупок ${BRAND_NAME}`;

/** How long a print request may take to start before we assume the browser ignored it. */
const PRINT_START_TIMEOUT_MS = 1000;
const PRINT_MODE_ATTRIBUTE = 'print';

/**
 * Plain-text list for messengers: one checkbox line per product, then the total and when to come.
 * @param {CartItem[]} items
 * @param {number} totalPrice
 */
export function formatShoppingList(items, totalPrice) {
  const lines = items.map(({ product, quantity }) => `☐ ${product.title} — ${quantity} ${product.unit} · ${formatPrice(product.price * quantity)}`);
  return [
    SHOPPING_LIST_TITLE,
    '',
    ...lines,
    '',
    `Разом: ${formatPrice(totalPrice)}`,
    `Магазини ${BRAND_NAME} ${IN_CITY}: ${STORE_CONTACTS.storeHours.toLowerCase()}`,
  ].join('\n');
}

/**
 * The system share sheet exists only on secure pages (HTTPS or localhost) and is missing in most
 * desktop browsers and in-app browsers of messengers.
 */
export const canShareNatively = () => window.isSecureContext && typeof navigator.share === 'function';

/**
 * @param {string} text
 * @returns {Promise<'shared' | 'cancelled'>}
 * @throws when the browser refuses to share (callers then offer messenger links)
 */
export async function shareNatively(text) {
  try {
    await navigator.share({ title: SHOPPING_LIST_TITLE, text });
    return 'shared';
  } catch (error) {
    // The visitor closed the share sheet: nothing to report.
    if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
    throw error;
  }
}

/**
 * Direct links for when there is no share sheet. Viber opens its app (phones and desktop);
 * Telegram's share page needs a URL besides the text, so the site address goes along.
 * @param {string} text
 */
export function getMessengerShareLinks(text) {
  const siteUrl = SITE_URL ?? window.location.origin;
  return {
    viber: `viber://forward?text=${encodeURIComponent(text)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(text)}`,
  };
}

/**
 * @param {string} text
 * @throws when the browser rejects the copy
 */
export async function copyText(text) {
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Plain-http pages (e.g. the dev server opened on a phone over Wi-Fi) have no Clipboard API;
  // the legacy copy command still works there.
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.readOnly = true;
  textarea.className = 'fixed left-0 top-0 opacity-0';
  document.body.append(textarea);
  textarea.select();
  const isCopied = document.execCommand('copy');
  textarea.remove();
  if (!isCopied) throw new Error('shoppingList.copyText: the browser rejected the copy command');
}

/**
 * Prints the paper shopping list (index.css swaps the page for it while the `print` attribute
 * is set). Some browsers silently ignore print requests (messenger in-app browsers, iOS
 * home-screen apps), which shows up as no `beforeprint` event.
 * @returns {Promise<boolean>} false when printing never started
 */
export function printShoppingList() {
  const root = document.documentElement;
  let hasStarted = false;
  const markStarted = () => {
    hasStarted = true;
  };
  const leavePrintMode = () => {
    delete root.dataset[PRINT_MODE_ATTRIBUTE];
  };

  root.dataset[PRINT_MODE_ATTRIBUTE] = 'shopping-list';
  window.addEventListener('beforeprint', markStarted, { once: true });
  window.addEventListener('afterprint', leavePrintMode, { once: true });
  window.print();

  return new Promise((resolve) => {
    window.setTimeout(() => {
      window.removeEventListener('beforeprint', markStarted);
      if (!hasStarted) {
        window.removeEventListener('afterprint', leavePrintMode);
        leavePrintMode();
      }
      resolve(hasStarted);
    }, PRINT_START_TIMEOUT_MS);
  });
}
