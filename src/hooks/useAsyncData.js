import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Last successful result per query key. Navigating between pages remounts consumers, so
 * without it every route change would flash skeletons for data that is already known.
 * @type {Map<string, unknown>}
 */
const responseCache = new Map();

/**
 * Minimal query primitive with stale-while-revalidate: cached (or previous) `data` stays
 * visible while refetching so the UI can dim stale results instead of flashing skeletons.
 * Consumers only see `{ data, isLoading, isFetching, error, refetch }`, so this can be
 * swapped for React Query / SWR without touching components.
 *
 * @template T
 * @param {() => Promise<T>} fetcher
 * @param {string} queryKey Serialized inputs; a change triggers a refetch.
 */
export function useAsyncData(fetcher, queryKey) {
  const [state, setState] = useState(() => ({
    data: /** @type {T | undefined} */ (responseCache.get(queryKey)),
    error: /** @type {unknown} */ (null),
    isFetching: true,
  }));
  const [refetchCount, setRefetchCount] = useState(0);
  const fetcherRef = useRef(fetcher);

  // The fetcher closure changes every render; only `queryKey` should drive refetches.
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let isStale = false;
    setState((previous) => ({
      data: responseCache.has(queryKey) ? /** @type {T} */ (responseCache.get(queryKey)) : previous.data,
      error: null,
      isFetching: true,
    }));

    fetcherRef.current().then(
      (data) => {
        responseCache.set(queryKey, data);
        if (!isStale) setState({ data, error: null, isFetching: false });
      },
      (error) => {
        if (!isStale) setState((previous) => ({ ...previous, error, isFetching: false }));
      },
    );

    // Out-of-order responses from superseded queries are ignored.
    return () => {
      isStale = true;
    };
  }, [queryKey, refetchCount]);

  const refetch = useCallback(() => setRefetchCount((count) => count + 1), []);

  return {
    data: state.data,
    isLoading: state.data === undefined && state.isFetching,
    isFetching: state.isFetching,
    error: state.error,
    refetch,
  };
}
