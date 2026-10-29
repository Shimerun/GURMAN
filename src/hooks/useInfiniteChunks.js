import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Renders a long list in chunks: `chunkSize` items first, then another chunk each time
 * the sentinel element approaches the viewport.
 * @template T
 * @param {T[]} items
 * @param {{ chunkSize?: number }} [options]
 */
export function useInfiniteChunks(items, { chunkSize = 12 } = {}) {
  const [visibleCount, setVisibleCount] = useState(chunkSize);
  const [trackedItems, setTrackedItems] = useState(items);
  const sentinelRef = useRef(null);

  // A new result set starts from the first chunk again (state adjusted during render, no extra effect pass).
  if (trackedItems !== items) {
    setTrackedItems(items);
    setVisibleCount(chunkSize);
  }

  const hasMore = visibleCount < items.length;

  // Re-observes after every growth so a sentinel that is still on screen keeps loading.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!hasMore || !sentinel) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setVisibleCount((count) => count + chunkSize);
      },
      { rootMargin: '0px 0px 400px 0px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, chunkSize, visibleCount]);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);

  return { visibleItems, hasMore, sentinelRef };
}
