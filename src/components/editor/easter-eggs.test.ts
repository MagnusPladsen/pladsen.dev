import { describe, expect, it } from 'vitest';
import { EASTER_EGGS, isEggHunt } from './easter-eggs';

describe('isEggHunt', () => {
  it.each(['easter eggs', 'ls easter-eggs', "find . -name '*egg*'", 'grep -r easter .', 'EGGS'])('should spot a hunt in %s', (input) => {
    expect(isEggHunt(input)).toBe(true);
  });

  it.each(['eggplant', 'ls', 'whoami'])('should ignore %s', (input) => {
    expect(isEggHunt(input)).toBe(false);
  });
});

describe('EASTER_EGGS', () => {
  it('should give every egg a label', () => {
    expect(Object.values(EASTER_EGGS).every((label) => label.length > 0)).toBe(true);
  });
});
