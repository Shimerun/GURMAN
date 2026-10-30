const FLIGHT_DURATION_MS = 650;
const ARC_HEIGHT_PX = 80;
const MIN_ARC_TOP_PX = 8;

/**
 * Fully on screen: the compact mobile header leaves its cart button a couple of pixels into the
 * viewport, which must not count.
 * @param {Element} element
 */
function isOnScreen(element) {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.top >= 0 && rect.bottom <= window.innerHeight;
}

/** @param {DOMRect} rect */
const getCenter = (rect) => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

/**
 * Throws a small orange from `sourceElement` into the visible cart button (`[data-cart-target]`:
 * header on desktop, bottom tab bar when the header row is scrolled away), then bounces it.
 * Purely visual feedback outside React's tree; a no-op under reduced motion or with no target.
 * Call before updating the cart: the source button may unmount once the item is added.
 * @param {Element | null} sourceElement
 */
export function flyToCart(sourceElement) {
  if (!sourceElement || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const target = [...document.querySelectorAll('[data-cart-target]')].find(isOnScreen);
  if (!target) return;

  const start = getCenter(sourceElement.getBoundingClientRect());
  const end = getCenter(target.getBoundingClientRect());
  const arcTop = Math.max(Math.min(start.y, end.y) - ARC_HEIGHT_PX, MIN_ARC_TOP_PX);

  const orange = document.createElement('span');
  orange.className = 'cart-flyer';
  orange.setAttribute('aria-hidden', 'true');
  document.body.append(orange);

  const flight = orange.animate(
    [
      { transform: `translate(${start.x}px, ${start.y}px) scale(1)` },
      { transform: `translate(${(start.x + end.x) / 2}px, ${arcTop}px) scale(1.15)`, offset: 0.45 },
      { transform: `translate(${end.x}px, ${end.y}px) scale(0.5)`, opacity: 0.7 },
    ],
    { duration: FLIGHT_DURATION_MS, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
  );

  flight.onfinish = () => {
    orange.remove();
    target.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 320, easing: 'ease-out' });
  };
  flight.oncancel = () => orange.remove();
}
