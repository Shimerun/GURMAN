import { useEffect, useState } from 'react';

const ONE_MINUTE_MS = 60_000;

/**
 * Current time, refreshed every `intervalMs` and whenever the tab becomes visible again, so
 * time-based labels (e.g. "open now") stay right on a page left open for hours.
 * @param {number} [intervalMs]
 */
export function useCurrentTime(intervalMs = ONE_MINUTE_MS) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const update = () => setNow(new Date());
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') update();
    };
    const intervalId = window.setInterval(update, intervalMs);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [intervalMs]);

  return now;
}
