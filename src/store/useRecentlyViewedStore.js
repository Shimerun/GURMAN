import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { sanitizeProductIds } from './productIds';

const MAX_RECENTLY_VIEWED = 12;

/**
 * Ids of opened product pages, newest first. Ids only: products are fetched fresh, so the row
 * always shows current prices and stock.
 * @typedef {Object} RecentlyViewedState
 * @property {string[]} productIds
 * @property {(productId: string) => void} addViewedProduct
 * @property {() => void} clearViewedProducts
 */

export const useRecentlyViewedStore = create(
  persist(
    /** @returns {RecentlyViewedState} */
    (set) => ({
      productIds: [],

      addViewedProduct: (productId) =>
        set((state) =>
          state.productIds[0] === productId
            ? state
            : { productIds: [productId, ...state.productIds.filter((id) => id !== productId)].slice(0, MAX_RECENTLY_VIEWED) },
        ),

      clearViewedProducts: () => set({ productIds: [] }),
    }),
    {
      name: 'gurman-recently-viewed',
      version: 1,
      merge: (persistedState, currentState) => ({
        ...currentState,
        productIds: sanitizeProductIds(/** @type {any} */ (persistedState)?.productIds, MAX_RECENTLY_VIEWED),
      }),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ productIds: state.productIds }),
    },
  ),
);
