import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_CITY } from '../lib/constants';

/** @typedef {import('../services/productService').Product} Product */

/**
 * @typedef {Object} CartItem
 * @property {Product} product Snapshot at time of adding
 * @property {number} quantity 1..product.stockQty
 */

/**
 * @typedef {Object} CartState
 * @property {CartItem[]} items
 * @property {string} city
 * @property {boolean} isCartOpen
 * @property {(product: Product) => void} addItem
 * @property {(productId: string) => void} removeItem
 * @property {(productId: string, quantity: number) => void} updateQuantity
 * @property {() => void} clearCart
 * @property {(city: string) => void} setCity
 * @property {() => void} openCart
 * @property {() => void} closeCart
 */

/** @param {number} quantity @param {Product} product */
const capToStock = (quantity, product) => Math.min(quantity, product.stockQty);

/** @param {CartItem[]} items @param {string} productId */
const withoutProduct = (items, productId) => items.filter((item) => item.product.id !== productId);

export const useCartStore = create(
  persist(
    /** @returns {CartState} */
    (set) => ({
      items: [],
      city: DEFAULT_CITY,
      isCartOpen: false,

      addItem: (product) =>
        set((state) => {
          if (product.stockQty <= 0) return state;

          const isInCart = state.items.some((item) => item.product.id === product.id);
          if (!isInCart) return { items: [...state.items, { product, quantity: 1 }] };

          return {
            items: state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: capToStock(item.quantity + 1, item.product) }
                : item,
            ),
          };
        }),

      removeItem: (productId) => set((state) => ({ items: withoutProduct(state.items, productId) })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) return { items: withoutProduct(state.items, productId) };

          return {
            items: state.items.map((item) =>
              item.product.id === productId ? { ...item, quantity: capToStock(quantity, item.product) } : item,
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
      setCity: (city) => set({ city }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
    }),
    {
      name: 'gurman-cart',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, city: state.city }),
    },
  ),
);

/** @param {CartState} state */
export const selectTotalItems = (state) => state.items.reduce((total, item) => total + item.quantity, 0);

/** @param {CartState} state */
export const selectTotalPrice = (state) =>
  state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

/** @param {string} productId */
export const selectItemQuantity = (productId) => (/** @type {CartState} */ state) =>
  state.items.find((item) => item.product.id === productId)?.quantity ?? 0;
