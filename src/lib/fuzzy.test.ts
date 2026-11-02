import { describe, expect, it } from 'vitest';
import { fuzzyMatch } from './fuzzy';

describe('fuzzyMatch', () => {
  it('matches subsequences case-insensitively', () => {
    expect(fuzzyMatch('claude-skills', 'clde')).toBe(true);
    expect(fuzzyMatch('Proton-ish', 'PRTN')).toBe(true);
  });

  it('rejects out-of-order letters', () => expect(fuzzyMatch('dotfiles', 'fd')).toBe(false));

  it('ignores whitespace and matches everything on empty query', () => {
    expect(fuzzyMatch('gamedev-studio', 'game studio')).toBe(true);
    expect(fuzzyMatch('anything', '')).toBe(true);
  });
});
