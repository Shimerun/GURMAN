import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribes to a CSS media query. Reads synchronously on first render, so layout
 * decisions based on it never flash.
 * @param {string} query
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches);
}
