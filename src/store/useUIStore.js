import { create } from 'zustand';

/** @typedef {'home' | 'catalog' | 'promo' | 'cart' | 'stores'} MobileTab */
/** @typedef {null | 'filters' | 'product' | 'city'} MobileSheet */

/**
 * @typedef {Object} UIState
 * @property {MobileTab} activeTab
 * @property {MobileSheet} activeSheet
 * @property {string | null} selectedProductId
 * @property {(name: Exclude<MobileSheet, null>, payload?: { productId?: string }) => void} openSheet
 * @property {() => void} closeSheet
 * @property {(tab: MobileTab) => void} setTab
 * @property {() => void} handleHistoryBack Wired to `popstate` by MobileApp.
 */

const HISTORY_MARKER = { gurman: true };

/*
 * History model (Android back button / swipe-back):
 *   home ─push→ any other tab (switching between non-home tabs replaces, so depth stays 1)
 *   any tab ─push→ sheet (opening another sheet replaces)
 * Closing from the UI calls history.back() to keep the stack in sync; the resulting
 * popstate is ignored because state was already updated.
 */
let shouldIgnoreNextPop = false;

const goBackSilently = () => {
  shouldIgnoreNextPop = true;
  window.history.back();
};

export const useUIStore = create(
  /** @returns {UIState} */
  (set, get) => ({
    activeTab: 'home',
    activeSheet: null,
    selectedProductId: null,

    openSheet: (name, payload = {}) => {
      if (get().activeSheet) window.history.replaceState(HISTORY_MARKER, '');
      else window.history.pushState(HISTORY_MARKER, '');
      set({ activeSheet: name, selectedProductId: payload.productId ?? null });
    },

    closeSheet: () => {
      if (!get().activeSheet) return;
      set({ activeSheet: null, selectedProductId: null });
      goBackSilently();
    },

    setTab: (tab) => {
      const { activeTab } = get();
      if (tab === activeTab) return;

      if (tab === 'home') {
        set({ activeTab: 'home' });
        goBackSilently();
        return;
      }

      if (activeTab === 'home') window.history.pushState(HISTORY_MARKER, '');
      else window.history.replaceState(HISTORY_MARKER, '');
      set({ activeTab: tab });
    },

    handleHistoryBack: () => {
      if (shouldIgnoreNextPop) {
        shouldIgnoreNextPop = false;
        return;
      }

      const { activeSheet, activeTab } = get();
      if (activeSheet) set({ activeSheet: null, selectedProductId: null });
      else if (activeTab !== 'home') set({ activeTab: 'home' });
    },
  }),
);
