import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { sanitizeProductIds } from './productIds';

/** Generous for a grocery list, small enough that a tampered entry cannot bloat every render. */
const MAX_FAVORITES = 200;

/**
 * Only product ids are stored: product data stays in the data layer and is fetched fresh, so
 * favourites always show current prices and stock.
 * @typedef {Object} FavoritesState
 * @property {string[]} productIds Most recently added first
 * @property {(productId: string) => void} toggleFavorite
 * @property {(productIds: string[]) => void} removeFavorites e.g. products that are no longer sold
 */

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

      removeFavorites: (productIds) =>
        set((state) => {
          const removedIds = new Set(productIds);
          return { productIds: state.productIds.filter((id) => !removedIds.has(id)) };
        }),
    }),
    {
      name: 'gurman-favorites',
      version: 1,
      merge: (persistedState, currentState) => ({
        ...currentState,
        productIds: sanitizeProductIds(/** @type {any} */ (persistedState)?.productIds, MAX_FAVORITES),
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
