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

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value });
}

function setInnerWidth(value: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ScrollToTop', () => {
  let originalScrollY: number;
  let originalScrollTo: typeof window.scrollTo;
  let originalInnerWidth: number;

  beforeEach(() => {
    originalScrollY   = window.scrollY;
    originalScrollTo  = window.scrollTo;
    originalInnerWidth = window.innerWidth;
    window.scrollTo   = vi.fn();
    setScrollY(0);
    setInnerWidth(1280); // default to desktop
  });

  afterEach(() => {
    Object.defineProperty(window, 'scrollY',     { configurable: true, value: originalScrollY });
    Object.defineProperty(window, 'innerWidth',  { configurable: true, value: originalInnerWidth });
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
    act(() => { fireEvent.scroll(window); });
    expect(queryByTitle('Back to top')).toBeNull();
  });

  it('shows the button after scrollY exceeds 400 px', () => {
    setScrollY(0);
    const { queryByTitle } = render(<ScrollToTop />);
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

  it('has aria-label "Scroll to top"', () => {
    setScrollY(500);
    const { getByLabelText } = render(<ScrollToTop />);
    act(() => { fireEvent.scroll(window); });
    expect(getByLabelText('Scroll to top')).toBeInTheDocument();
  });

  it('uses desktop positioning (left > 20px) on wide screens', () => {
    setInnerWidth(1280);
    setScrollY(500);
    const { getByTitle } = render(<ScrollToTop />);
    act(() => { fireEvent.scroll(window); });
    const btn = getByTitle('Back to top') as HTMLElement;
    // On desktop: left = calc(var(--sidebar-collapsed) + 16px)
    expect(btn.style.left).toContain('calc');
  });

  it('uses mobile positioning (left: 20px) on narrow screens', () => {
    setInnerWidth(375);
    setScrollY(500);
    // Trigger resize so the component detects mobile
    const { getByTitle } = render(<ScrollToTop />);
    act(() => { fireEvent.resize(window); });
    act(() => { fireEvent.scroll(window); });
    const btn = getByTitle('Back to top') as HTMLElement;
    expect(btn.style.left).toBe('20px');
  });

  it('removes both scroll and resize listeners on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    setScrollY(500);
    const { unmount } = render(<ScrollToTop />);
    unmount();
    const calls = removeSpy.mock.calls.map(c => c[0]);
    expect(calls).toContain('scroll');
    expect(calls).toContain('resize');
    removeSpy.mockRestore();
  });
});
