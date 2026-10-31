import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** Generous for a grocery list, small enough that a tampered entry cannot bloat every render. */
const MAX_FAVORITES = 200;

/**
 * Only product ids are stored: product data stays in the data layer and is fetched fresh, so
 * favourites always show current prices and stock.
 * @typedef {Object} FavoritesState
 * @property {string[]} productIds Most recently added first
 * @property {(productId: string) => void} toggleFavorite
 */

/**
 * localStorage is untrusted input (see useCartStore): keeps unique string ids only.
 * @param {unknown} productIds
 * @returns {string[]}
 */
const sanitizeProductIds = (productIds) =>
  Array.isArray(productIds)
    ? [...new Set(productIds.filter((productId) => typeof productId === 'string' && productId !== ''))].slice(0, MAX_FAVORITES)
    : [];

export const useFavoritesStore = create(
  persist(
    /** @returns {FavoritesState} */
    (set) => ({
      productIds: [],

      toggleFavorite: (productId) =>
        set((state) =>
          state.productIds.includes(productId)
            ? { productIds: state.productIds.filter((id) => id !== productId) }
            : { productIds: [productId, ...state.productIds].slice(0, MAX_FAVORITES) },
        ),
    }),
    {
      name: 'gurman-favorites',
      version: 1,
      merge: (persistedState, currentState) => ({
        ...currentState,
        productIds: sanitizeProductIds(/** @type {any} */ (persistedState)?.productIds),
      }),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ productIds: state.productIds }),
    },
  ),
);

/** @param {string} productId */
export const selectIsFavorite = (productId) => (/** @type {FavoritesState} */ state) => state.productIds.includes(productId);

/** @param {FavoritesState} state */
export const selectFavoriteCount = (state) => state.productIds.length;
