/**
 * Card → product page image morph. A view-transition name must be unique on the page, but the same
 * product can appear in two sections at once (weekly deals and popular on the home page, the
 * recently viewed row). Only one card image may carry the name: the one the visitor tapped, or,
 * when coming back to a list (that card was re-mounted), the first card of the product.
 */

/** @type {HTMLElement | null} */
let tappedCardImage = null;

/** Call from the card link's click, before react-router starts the transition. @param {HTMLElement | null} image */
export function rememberTappedCardImage(image) {
  tappedCardImage = image;
}

/**
 * @param {HTMLElement} image a card's image wrapper (carries `data-morph-product`)
 * @param {string} productId
 */
export function isMorphSourceImage(image, productId) {
  if (tappedCardImage?.isConnected && tappedCardImage.dataset.morphProduct === productId) return image === tappedCardImage;
  return image === document.querySelector(`[data-morph-product="${CSS.escape(productId)}"]`);
}
