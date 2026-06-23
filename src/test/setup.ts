import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// ── matchMedia ────────────────────────────────────────────────────────────────
// jsdom doesn't implement matchMedia; provide a working stub. Reinstall it
// before every test so a test calling vi.restoreAllMocks() can't strip the
// implementation and leave matchMedia() returning undefined for later tests.
function installMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

installMatchMedia();
beforeEach(installMatchMedia);

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
