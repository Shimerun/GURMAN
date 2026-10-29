import { useCallback, useEffect, useRef, useState } from 'react';

const INITIAL_STATE = { data: undefined, error: null, isFetching: true };

/**
 * Minimal query primitive. Keeps the previous `data` while refetching so the UI can dim
 * stale results instead of flashing skeletons. Consumers only see
 * `{ data, isLoading, isFetching, error, refetch }`, so this can be swapped for
 * React Query / SWR without touching components.
 *
 * @template T
 * @param {() => Promise<T>} fetcher
 * @param {string} queryKey Serialized inputs; a change triggers a refetch.
 */
export function useAsyncData(fetcher, queryKey) {
  const [state, setState] = useState(INITIAL_STATE);
  const [refetchCount, setRefetchCount] = useState(0);
  const fetcherRef = useRef(fetcher);

  // The fetcher closure changes every render; only `queryKey` should drive refetches.
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let isStale = false;
    setState((previous) => ({ ...previous, error: null, isFetching: true }));

    fetcherRef.current().then(
      (data) => {
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
