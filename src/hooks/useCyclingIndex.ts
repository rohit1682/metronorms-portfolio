import { useState, useEffect } from 'react';

/**
 * Cycles an index from 0..length-1 on a fixed interval — used to auto-rotate
 * through a pool of photos with a crossfade.
 *
 * @param length     number of items to cycle through
 * @param intervalMs delay between advances (milliseconds)
 * @param enabled    pause/resume the cycle (default: true)
 * @returns the current index (always within bounds, or 0 when length is 0)
 */
export function useCyclingIndex(length: number, intervalMs: number, enabled = true): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!enabled || length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [length, intervalMs, enabled]);

  // Guard against the pool shrinking between renders.
  return length > 0 ? index % length : 0;
}
