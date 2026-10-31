import { useEffect, useState } from 'react';

/**
 * True once the page is scrolled more than `offset` pixels down (e.g. to reveal "back to top").
 * @param {number} offset
 */
export function useIsScrolledPast(offset) {
  const [isScrolledPast, setIsScrolledPast] = useState(false);

  useEffect(() => {
    let frame = 0;
    // One read per frame: scroll events can fire many times between paints.
    const update = () => {
      frame = 0;
      setIsScrolledPast(window.scrollY > offset);
    };
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frame);
    };
  }, [offset]);

  return isScrolledPast;
}
