import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCyclingIndex } from './useCyclingIndex';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('useCyclingIndex', () => {
  it('starts at index 0', () => {
    const { result } = renderHook(() => useCyclingIndex(3, 1000));
    expect(result.current).toBe(0);
  });

  it('advances by one each interval and wraps around', () => {
    const { result } = renderHook(() => useCyclingIndex(3, 1000));
    expect(result.current).toBe(0);

    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current).toBe(1);

    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current).toBe(2);

    // wraps back to 0
    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current).toBe(0);
  });

  it('does not advance when length is 1', () => {
    const { result } = renderHook(() => useCyclingIndex(1, 1000));
    act(() => { vi.advanceTimersByTime(5000); });
    expect(result.current).toBe(0);
  });

  it('returns 0 and does not advance when length is 0', () => {
    const { result } = renderHook(() => useCyclingIndex(0, 1000));
    act(() => { vi.advanceTimersByTime(5000); });
    expect(result.current).toBe(0);
  });

  it('does not advance when disabled', () => {
    const { result } = renderHook(() => useCyclingIndex(4, 1000, false));
    act(() => { vi.advanceTimersByTime(5000); });
    expect(result.current).toBe(0);
  });

  it('clears the interval on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = renderHook(() => useCyclingIndex(3, 1000));
    unmount();
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  it('clamps the returned index if the pool shrinks below the current index', () => {
    const { result, rerender } = renderHook(
      ({ len }) => useCyclingIndex(len, 1000),
      { initialProps: { len: 4 } },
    );

    // advance to index 3
    act(() => { vi.advanceTimersByTime(3000); });
    expect(result.current).toBe(3);

    // pool shrinks to 2 → 3 % 2 = 1
    rerender({ len: 2 });
    expect(result.current).toBe(1);
  });
});
