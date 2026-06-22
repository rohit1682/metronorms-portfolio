import { describe, it, expect } from 'vitest';
import { EASE_SMOOTH } from './easing';

describe('EASE_SMOOTH', () => {
  it('is a 4-tuple cubic-bezier matching the material-easing standard', () => {
    expect(EASE_SMOOTH).toEqual([0.4, 0, 0.2, 1]);
  });

  it('has exactly 4 elements', () => {
    expect(EASE_SMOOTH).toHaveLength(4);
  });

  it('all values are numbers', () => {
    (EASE_SMOOTH as unknown as number[]).forEach((v) => expect(typeof v).toBe('number'));
  });
});
