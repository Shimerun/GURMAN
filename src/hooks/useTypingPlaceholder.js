import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const TYPE_DELAY_MS = 90;
const DELETE_DELAY_MS = 45;
const HOLD_DELAY_MS = 1400;
const START_DELAY_MS = 1800;

/**
 * Placeholder that types example queries one by one ("Знайти: молоко…"), hinting at what the
 * search understands. Returns `fallback` while paused (field focused or filled, so it never
 * changes under the user's caret or a screen reader) and under reduced motion.
 * @param {{ prefix: string, words: string[], fallback: string, isPaused: boolean }} options
 */
export function useTypingPlaceholder({ prefix, words, fallback, isPaused }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [typed, setTyped] = useState(/** @type {string | null} */ (null));
  const isActive = !isPaused && !prefersReducedMotion && words.length > 0;

  useEffect(() => {
    if (!isActive) return undefined;

    let wordIndex = 0;
    let length = 0;
    let isDeleting = false;
    let timer = 0;

    const tick = () => {
      const word = words[wordIndex];
      length += isDeleting ? -1 : 1;
      setTyped(word.slice(0, length));

      let delay = isDeleting ? DELETE_DELAY_MS : TYPE_DELAY_MS;
      if (!isDeleting && length === word.length) {
        isDeleting = true;
        delay = HOLD_DELAY_MS;
      } else if (isDeleting && length === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
      timer = window.setTimeout(tick, delay);
    };

    timer = window.setTimeout(tick, START_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
      setTyped(null);
    };
  }, [isActive, words]);

  return isActive && typed !== null ? `${prefix}${typed}` : fallback;
}
