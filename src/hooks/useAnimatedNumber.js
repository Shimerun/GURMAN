import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const DEFAULT_DURATION_MS = 450;

/**
 * Follows `target`, easing from the previously shown value instead of jumping, so a changed
 * cart total visibly "rolls" to the new sum. Starts at `target` (no count-up on mount) unless
 * `initialValue` is given, and jumps straight to it under reduced motion. Display only: keep the
 * real value for logic and accessible labels.
 * @param {number} target
 * @param {number} [durationMs]
 * @param {number} [initialValue] counts up from here on mount (e.g. 0 for a discount badge)
 */
export function useAnimatedNumber(target, durationMs = DEFAULT_DURATION_MS, initialValue = target) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayed, setDisplayed] = useState(initialValue);
  const displayedRef = useRef(initialValue);

  useEffect(() => {
    if (prefersReducedMotion || displayedRef.current === target) {
      displayedRef.current = target;
      setDisplayed(target);
      return undefined;
    }

    const from = displayedRef.current;
    const startedAt = performance.now();
    let frame = 0;

    const advance = (now) => {
      const progress = Math.min((now - startedAt) / durationMs, 1);
      const eased = 1 - (1 - progress) ** 3;
      displayedRef.current = from + (target - from) * eased;
      setDisplayed(displayedRef.current);
      if (progress < 1) frame = requestAnimationFrame(advance);
    };
    frame = requestAnimationFrame(advance);

    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, prefersReducedMotion]);

  return prefersReducedMotion ? target : displayed;
}
