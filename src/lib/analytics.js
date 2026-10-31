import { ANALYTICS } from '../config/business';

/**
 * Custom events. Plausible shows an event only after a goal with the same name is created in the
 * site settings. The store sells offline, so these are the visit's real outcomes.
 */
export const ANALYTICS_EVENTS = {
  directions: 'Маршрут до магазину',
  call: 'Дзвінок у магазин',
  shareList: 'Список покупок: надіслано',
  printList: 'Список покупок: друк',
  addFavorite: 'Додано в обране',
};

/**
 * Loads Plausible when it is configured, in production builds only. The queue stub mirrors the
 * official snippet, so events sent before the script arrives are not lost; it lives here rather
 * than inline in index.html because the CSP forbids inline scripts. Page views of the SPA are
 * tracked by the script itself via the History API.
 */
export function initAnalytics() {
  if (!ANALYTICS.scriptSrc || !import.meta.env.PROD) return;

  const plausible =
    window.plausible ??
    function queuePlausibleCall() {
      // Queued as the raw `arguments`, exactly like the official stub.
      (plausible.q = plausible.q ?? []).push(arguments);
    };
  plausible.init ??= (options) => {
    plausible.o = options ?? {};
  };
  window.plausible = plausible;
  plausible.init();

  const script = document.createElement('script');
  script.async = true;
  script.src = ANALYTICS.scriptSrc;
  document.head.append(script);
}

/**
 * No-op while analytics is off.
 * @param {string} eventName one of ANALYTICS_EVENTS
 * @param {Record<string, string>} [props]
 */
export function trackEvent(eventName, props) {
  window.plausible?.(eventName, props ? { props } : undefined);
}
