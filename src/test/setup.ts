import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ── matchMedia ────────────────────────────────────────────────────────────────
// jsdom doesn't implement matchMedia; provide a working stub.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ── innerWidth default ────────────────────────────────────────────────────────
Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 });

// ── HTMLMediaElement stubs ────────────────────────────────────────────────────
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: vi.fn().mockResolvedValue(undefined),
});
Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  value: vi.fn(),
});

// ── scrollIntoView ────────────────────────────────────────────────────────────
window.HTMLElement.prototype.scrollIntoView = vi.fn();
