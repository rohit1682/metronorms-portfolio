import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('framer-motion', () => ({
  motion: new Proxy({} as Record<string, unknown>, {
    get: (_target, _tag: string) =>
      React.forwardRef(({ children, ...props }: React.ComponentProps<'span'>, ref: React.Ref<HTMLSpanElement>) =>
        React.createElement('span', { ...props, ref }, children),
      ),
  }),
}));

// ── Component under test ──────────────────────────────────────────────────────

import AnimatedText from './AnimatedText';

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('AnimatedText', () => {
  it('renders every non-space character as a visible span', () => {
    const { container } = render(<AnimatedText text="ABC" />);
    // Each letter gets its own motion.span → <span>; find all text-bearing spans
    const spans = container.querySelectorAll('span span');
    expect(spans).toHaveLength(3);
    expect(spans[0].textContent).toBe('A');
    expect(spans[1].textContent).toBe('B');
    expect(spans[2].textContent).toBe('C');
  });

  it('replaces space characters with non-breaking spaces (\u00a0)', () => {
    const { container } = render(<AnimatedText text="A B" />);
    const spans = container.querySelectorAll('span span');
    expect(spans).toHaveLength(3);
    expect(spans[1].textContent).toBe('\u00a0');
  });

  it('renders an empty wrapper for an empty string', () => {
    const { container } = render(<AnimatedText text="" />);
    const inner = container.querySelectorAll('span span');
    expect(inner).toHaveLength(0);
  });

  it('passes the className prop to the outer wrapper span', () => {
    const { container } = render(<AnimatedText text="X" className="my-class" />);
    const wrapper = container.querySelector('span.my-class');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders the correct number of spans for a multi-word text', () => {
    const text = 'METRONORMS';
    const { container } = render(<AnimatedText text={text} />);
    const spans = container.querySelectorAll('span span');
    expect(spans).toHaveLength(text.length);
  });

  it('renders with custom delay and staggerDelay props (no crash)', () => {
    expect(() =>
      render(<AnimatedText text="HI" delay={1} staggerDelay={0.1} />),
    ).not.toThrow();
  });
});
