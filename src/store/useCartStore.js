import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** @typedef {import('../services/productService').Product} Product */

/**
 * @typedef {Object} CartItem
 * @property {Product} product Snapshot at time of adding
 * @property {number} quantity 1..product.stockQty
 */

/**
 * @typedef {Object} CartState
 * @property {CartItem[]} items
 * @property {boolean} isCartOpen
 * @property {(product: Product) => void} addItem
 * @property {(productId: string) => void} removeItem
 * @property {(item: CartItem, index: number) => void} restoreItem Puts a removed line back where it was
 * @property {(productId: string, quantity: number) => void} updateQuantity
 * @property {() => void} clearCart
 * @property {() => void} openCart
 * @property {() => void} closeCart
 */

/** @param {number} quantity @param {Product} product */
const capToStock = (quantity, product) => Math.min(quantity, product.stockQty);

/**
 * Persisted lines come from localStorage, which may hold data from an older site version, a
 * browser extension or manual edits. Anything malformed must not reach the UI: a single bad line
 * used to blank the whole site until the visitor cleared their browser data.
 * @param {unknown} item
 * @returns {item is CartItem}
 */
function isValidCartItem(item) {
  const product = /** @type {any} */ (item)?.product;
  const quantity = /** @type {any} */ (item)?.quantity;
  return (
    typeof product?.id === 'string' &&
    typeof product.title === 'string' &&
    typeof product.unit === 'string' &&
    typeof product.image === 'string' &&
    Number.isFinite(product.price) &&
    product.price >= 0 &&
    (product.oldPrice == null || (Number.isFinite(product.oldPrice) && product.oldPrice >= 0)) &&
    Number.isInteger(product.stockQty) &&
    product.stockQty > 0 &&
    Number.isInteger(quantity) &&
    quantity >= 1
  );
}

/**
 * Keeps only well-formed lines and re-applies the stock cap.
 * @param {unknown} items
 * @returns {CartItem[]}
 */
const sanitizeCartItems = (items) =>
  Array.isArray(items) ? items.filter(isValidCartItem).map((item) => ({ ...item, quantity: capToStock(item.quantity, item.product) })) : [];

/** @param {CartItem[]} items @param {string} productId */
const withoutProduct = (items, productId) => items.filter((item) => item.product.id !== productId);

export const useCartStore = create(
  persist(
    /** @returns {CartState} */
    (set) => ({
      items: [],
      isCartOpen: false,

      addItem: (product) =>
        set((state) => {
          if (product.stockQty <= 0) return state;

          const isInCart = state.items.some((item) => item.product.id === product.id);
          if (!isInCart) return { items: [...state.items, { product, quantity: 1 }] };

          return {
            items: state.items.map((item) =>
              item.product.id === product.id ? { ...item, quantity: capToStock(item.quantity + 1, item.product) } : item,
            ),
          };
        }),

      removeItem: (productId) => set((state) => ({ items: withoutProduct(state.items, productId) })),

      // Undo after removal. If the product was added again meanwhile, that newer line wins.
      restoreItem: (item, index) =>
        set((state) => {
          if (state.items.some((line) => line.product.id === item.product.id)) return state;
          const items = [...state.items];
          items.splice(Math.min(index, items.length), 0, item);
          return { items };
        }),

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
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
    }),
    {
      name: 'gurman-cart',
      // v2 dropped the city selection (single-city store); older snapshots keep only their cart items.
      version: 2,
      migrate: (persistedState) => ({ items: sanitizeCartItems(persistedState?.items) }),
      // Validates every rehydration, not only version migrations.
      merge: (persistedState, currentState) => ({ ...currentState, items: sanitizeCartItems(/** @type {any} */ (persistedState)?.items) }),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

/** @param {CartState} state */
export const selectTotalItems = (state) => state.items.reduce((total, item) => total + item.quantity, 0);

/** @param {CartState} state */
export const selectTotalPrice = (state) => state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

/** Total saved versus pre-promo prices. @param {CartState} state */
export const selectTotalSavings = (state) =>
  state.items.reduce(
    (total, { product, quantity }) => total + Math.max((product.oldPrice ?? product.price) - product.price, 0) * quantity,
    0,
  );

/** @param {string} productId */
export const selectItemQuantity = (productId) => (/** @type {CartState} */ state) =>
  state.items.find((item) => item.product.id === productId)?.quantity ?? 0;
