import { afterEach, describe, expect, it, vi } from 'vitest';
import fixture from './__fixtures__/graphql.json';
import { fetchGitHubSnapshot } from './fetch-snapshot';

const restRepo = (name: string, pushedAt: string, isFork = false) => ({
  name,
  html_url: `https://github.com/MagnusPladsen/${name}`,
  description: null,
  fork: isFork,
  stargazers_count: 0,
  created_at: '2024-01-01T00:00:00Z',
  pushed_at: pushedAt,
  language: 'TypeScript',
});

const restCommit = (sha: string, message: string) => ({
  sha,
  html_url: `https://github.com/x/commit/${sha}`,
  commit: { message, committer: { date: '2026-11-02T09:00:00Z' } },
});

const jsonResponse = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('fetchGitHubSnapshot', () => {
  it('uses GraphQL with the token and hourly revalidation', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(fixture));
    vi.stubGlobal('fetch', fetchMock);

    const snapshot = await fetchGitHubSnapshot();

    expect(snapshot.source).toBe('graphql');
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.github.com/graphql');
    expect(init.headers.Authorization).toBe('bearer test-token');
    expect(init.next.revalidate).toBe(3600);
  });

  it('falls back to REST without a token', async () => {
    vi.stubEnv('GITHUB_TOKEN', '');
    const repos = Array.from({ length: 8 }, (_, i) => restRepo(`repo-${i}`, `2026-11-0${(9 - i) % 9 || 1}T00:00:00Z`, i === 1));
    const fetchMock = vi.fn((url: string) =>
      Promise.resolve(
        url.includes('/users/MagnusPladsen/repos')
          ? jsonResponse(repos)
          : jsonResponse([restCommit('abcdef1234567', 'feat: hello\n\nbody')]),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const snapshot = await fetchGitHubSnapshot();

    expect(fetchMock.mock.calls[0][0]).toBe('https://api.github.com/users/MagnusPladsen/repos?per_page=100&sort=pushed');
    expect(fetchMock).toHaveBeenCalledTimes(7);
    expect(fetchMock.mock.calls[1][0]).toMatch(/repos\/MagnusPladsen\/repo-\d\/commits\?per_page=6$/);
    expect(snapshot).toMatchObject({ source: 'rest', contributions: null, latestRelease: null });
    expect(snapshot.recent).toHaveLength(6);
    expect(snapshot.recent[0].commits[0]).toMatchObject({ subject: 'feat: hello', shortSha: 'abcdef1', additions: null });
    expect(snapshot.totals).toEqual({ publicRepos: 8, originals: 7, forks: 1 });
  });

  it.each([
    ['rejects', () => Promise.reject(new Error('offline'))],
    ['returns 502', () => Promise.resolve(new Response('bad gateway', { status: 502 }))],
    ['returns GraphQL errors', () => Promise.resolve(jsonResponse({ errors: [{ message: 'nope' }] }))],
  ])('resolves to an empty snapshot when fetch %s', async (_, impl) => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    vi.stubGlobal('fetch', vi.fn(impl));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(fetchGitHubSnapshot()).resolves.toMatchObject({ source: 'none', recent: [] });
  });
});
