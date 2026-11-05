import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

afterEach(() => vi.unstubAllEnvs());

async function getMe(): Promise<Record<string, unknown>> {
  const response = GET();
  expect(response.status).toBe(200);
  return response.json();
}

describe('GET /api/me', () => {
  it('should return the main info about me', async () => {
    const me = await getMe();
    expect(me).toMatchObject({
      name: 'Magnus Pladsen',
      role: 'Full-stack developer',
      location: 'Lillehammer, Norway',
      website: 'https://pladsen.dev',
      email: 'magnus_pladsen@hotmail.com',
    });
    expect(me.socials).toContainEqual({ name: 'github', url: 'https://github.com/MagnusPladsen' });
  });

  it('should not expose my phone number', async () => {
    expect(JSON.stringify(await getMe())).not.toContain('94812442');
  });

  it('should list featured apps with their urls', async () => {
    const { featuredApps } = await getMe();
    expect(featuredApps).toContainEqual(expect.objectContaining({ name: 'Flightdeck', url: 'https://flightdeck.pladsen.dev' }));
  });

  it('should only link the CV when the build found it', async () => {
    vi.stubEnv('CV_AVAILABLE', 'false');
    expect((await getMe()).cv).toBeNull();
    vi.stubEnv('CV_AVAILABLE', 'true');
    expect((await getMe()).cv).toBe('https://cv.pladsen.dev');
  });
});
