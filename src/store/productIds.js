/**
 * Persisted product-id lists (favourites, recently viewed) come from localStorage, which is
 * untrusted input (see useCartStore): keeps unique non-empty string ids, at most `maxLength`.
 * @param {unknown} productIds
 * @param {number} maxLength
 * @returns {string[]}
 */
export const sanitizeProductIds = (productIds, maxLength) =>
  Array.isArray(productIds)
    ? [...new Set(productIds.filter((productId) => typeof productId === 'string' && productId !== ''))].slice(0, maxLength)
    : [];
