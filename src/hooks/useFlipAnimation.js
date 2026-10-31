import { useLayoutEffect, useRef } from 'react';

const MOVE_DURATION_MS = 300;
const ENTER_DURATION_MS = 250;
const VIEWPORT_MARGIN_PX = 200;

/** @param {DOMRect} rect */
const isNearViewport = (rect) => rect.bottom > -VIEWPORT_MARGIN_PX && rect.top < window.innerHeight + VIEWPORT_MARGIN_PX;

/**
 * FLIP reordering for a keyed list: after each commit, children (identified by
 * `data-flip-key`) glide from their previous spot to the new one, and newly added ones fade
 * in. Only items near the viewport animate. Positions are kept relative to the list, so page
 * scroll between renders doesn't read as movement.
 * @param {import('react').RefObject<HTMLElement | null>} listRef
 * @param {unknown} trigger value whose change means the list was re-rendered (e.g. the items array)
 */
export function useFlipAnimation(listRef, trigger) {
  const positionsRef = useRef(/** @type {Map<string, { x: number, y: number }>} */ (new Map()));

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) {
      positionsRef.current = new Map();
      return;
    }

    const listRect = list.getBoundingClientRect();
    const items = /** @type {HTMLElement[]} */ ([...list.children]).filter((item) => item.dataset.flipKey);
    const previous = positionsRef.current;
    const next = new Map();
    for (const item of items) {
      const rect = item.getBoundingClientRect();
      next.set(item.dataset.flipKey, { x: rect.left - listRect.left, y: rect.top - listRect.top });
    }
    positionsRef.current = next;

    // First paint of this list, or motion turned off: nothing to animate from.
    if (previous.size === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    for (const item of items) {
      const rect = item.getBoundingClientRect();
      if (!isNearViewport(rect)) continue;

      const before = previous.get(item.dataset.flipKey);
      const after = next.get(item.dataset.flipKey);
      if (!before) {
        item.animate([{ opacity: 0, transform: 'scale(0.96)' }, { opacity: 1, transform: 'none' }], { duration: ENTER_DURATION_MS, easing: 'ease-out' });
        continue;
      }

      const deltaX = before.x - after.x;
      const deltaY = before.y - after.y;
      if (deltaX === 0 && deltaY === 0) continue;
      item.animate([{ transform: `translate(${deltaX}px, ${deltaY}px)` }, { transform: 'none' }], {
        duration: MOVE_DURATION_MS,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
      });
    }
  }, [listRef, trigger]);
}
