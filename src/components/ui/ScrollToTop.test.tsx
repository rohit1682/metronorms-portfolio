import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act, fireEvent } from '@testing-library/react';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('framer-motion', () => ({
  motion: new Proxy({} as Record<string, unknown>, {
    get: (_target, _tag: string) =>
      React.forwardRef(
        ({ children, ...props }: React.ComponentProps<'button'>, ref: React.Ref<HTMLButtonElement>) =>
          React.createElement('button', { ...props, ref }, children),
      ),
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ── Component under test ──────────────────────────────────────────────────────

import ScrollToTop from './ScrollToTop';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Override window.scrollY to simulate a scrolled page */
function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ScrollToTop', () => {
  let originalScrollY: number;
  let originalScrollTo: typeof window.scrollTo;

  beforeEach(() => {
    originalScrollY  = window.scrollY;
    originalScrollTo = window.scrollTo;
    window.scrollTo  = vi.fn();
    setScrollY(0);
  });

  afterEach(() => {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: originalScrollY });
    window.scrollTo = originalScrollTo;
  });

  it('does not render the button when scrollY is 0', () => {
    setScrollY(0);
    const { queryByTitle } = render(<ScrollToTop />);
    expect(queryByTitle('Back to top')).toBeNull();
  });

  it('does not render the button when scrollY is ≤ 400', () => {
    setScrollY(399);
    const { queryByTitle } = render(<ScrollToTop />);
    // Trigger the scroll handler manually
    act(() => { fireEvent.scroll(window); });
    expect(queryByTitle('Back to top')).toBeNull();
  });

  it('shows the button after scrollY exceeds 400 px', () => {
    setScrollY(0);
    const { queryByTitle } = render(<ScrollToTop />);
    // Simulate a scroll past the threshold
    setScrollY(401);
    act(() => { fireEvent.scroll(window); });
    expect(queryByTitle('Back to top')).not.toBeNull();
  });

  it('calls window.scrollTo({ top: 0, behavior: "smooth" }) when clicked', () => {
    setScrollY(500);
    const { getByTitle } = render(<ScrollToTop />);
    act(() => { fireEvent.scroll(window); });
    const btn = getByTitle('Back to top');
    fireEvent.click(btn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('has role button and aria-label', () => {
    setScrollY(500);
    const { getByLabelText } = render(<ScrollToTop />);
    act(() => { fireEvent.scroll(window); });
    const btn = getByLabelText('Scroll to top');
    expect(btn).toBeInTheDocument();
  });

  it('removes scroll listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    setScrollY(500);
    const { unmount } = render(<ScrollToTop />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    removeSpy.mockRestore();
  });
});
