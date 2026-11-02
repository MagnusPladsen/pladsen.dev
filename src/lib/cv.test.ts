import { afterEach, describe, expect, it, vi } from 'vitest';
import { isCvAvailable } from './cv';

afterEach(() => vi.unstubAllEnvs());

describe('isCvAvailable', () => {
  it('should be true when the build found the CV', () => {
    vi.stubEnv('CV_AVAILABLE', 'true');
    expect(isCvAvailable()).toBe(true);
  });

  it('should be false when the build did not find the CV', () => {
    vi.stubEnv('CV_AVAILABLE', 'false');
    expect(isCvAvailable()).toBe(false);
  });
});
