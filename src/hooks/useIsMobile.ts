import { useState, useEffect } from 'react';

/** Returns true when the viewport is ≤ 768 px wide. Updates on resize. */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return mobile;
}
