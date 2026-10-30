import { useEffect, useState } from 'react';

/**
 * True while the user is scrolling down past `offset`; flips back on the first scroll up, so
 * chrome that hides on it (the compact mobile header) is always one flick away.
 * @param {{ offset?: number, tolerance?: number }} [options] `tolerance` ignores jitter and
 * momentum noise smaller than that many pixels.
 */
export function useIsScrollingDown({ offset = 120, tolerance = 8 } = {}) {
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let frame = 0;

    // One read per frame: scroll events can fire many times between paints.
    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;
      if (Math.abs(scrollY - lastScrollY) < tolerance) return;
      setIsScrollingDown(scrollY > lastScrollY && scrollY > offset);
      lastScrollY = scrollY;
    };
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frame);
    };
  }, [offset, tolerance]);

  return isScrollingDown;
}
