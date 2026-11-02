import { describe, expect, it } from 'vitest';
import fixture from './__fixtures__/graphql.json';
import { emptySnapshot, formatRelative, getCommitType, getTimelinePosition, toSnapshot } from './transform';
import type { GraphQLUser } from './types';

describe('getCommitType', () => {
  it.each([
    ['feat: 3D Pixel Art slice view', 'feat'],
    ['fix: tidy the account status', 'fix'],
    ['Merge pull request #112 from x', 'merge'],
    ['Update proton-ish to 1.0.40', 'chore'],
    ['Remove usage-warn and filetree-collapsible mods', 'refactor'],
    ['Add full new-Mac bootstrap guide and Brewfile', 'feat'],
    ['docs: README', 'docs'],
  ])('types %s as %s', (message, type) => expect(getCommitType(message)).toBe(type));
});

describe('formatRelative', () => {
  const now = new Date('2026-11-02T10:00:00Z');
  it('formats minutes, hours and days', () => {
    expect(formatRelative('2026-11-02T09:45:00Z', now)).toBe('15m');
    expect(formatRelative('2026-11-02T07:00:00Z', now)).toBe('3h');
    expect(formatRelative('2026-10-30T10:00:00Z', now)).toBe('3d');
    expect(formatRelative('2026-09-28T10:00:00Z', now)).toBe('5w');
  });
});

describe('getTimelinePosition', () => {
  const now = new Date('2026-11-02T00:00:00Z');
  it('clamps to the 7-day window', () => {
    expect(getTimelinePosition('2026-11-02T00:00:00Z', now)).toBe(100);
    expect(getTimelinePosition('2026-10-01T00:00:00Z', now)).toBe(0);
    expect(getTimelinePosition('2026-10-29T12:00:00Z', now)).toBe(50);
  });
});

describe('toSnapshot', () => {
  const snapshot = toSnapshot(fixture.data.user as GraphQLUser, new Date('2026-11-02T10:00:00Z'));

  it('keeps the six most recent repos with commits, forks included', () => {
    expect(snapshot.recent).toHaveLength(6);
    expect(snapshot.recent.some((repo) => repo.isFork)).toBe(true);
    expect(snapshot.recent.find((repo) => repo.name === 'claude-mods')?.commits).toHaveLength(4);
  });

  it('keeps repos without a default branch out of recent but in repos', () => {
    expect(snapshot.repos.find((repo) => repo.name === 'Portfolio')).toBeDefined();
    expect(snapshot.recent.find((repo) => repo.name === 'Portfolio')).toBeUndefined();
  });

  it('counts totals, newest release and contributions', () => {
    expect(snapshot.totals).toEqual({ publicRepos: 8, originals: 7, forks: 1 });
    expect(snapshot.latestRelease?.tag).toBe('v1.0.40');
    expect(snapshot.latestRelease?.repo).toBe('Proton-ish');
    expect(snapshot.contributions).toHaveLength(104);
    expect(snapshot.contributions?.every((level) => level >= 0 && level <= 4)).toBe(true);
  });

  it('types and trims commits', () => {
    const commit = snapshot.recent[0].commits[0];
    expect(commit.shortSha).toHaveLength(7);
    expect(commit.subject).not.toContain('\n');
    expect(typeof commit.additions).toBe('number');
  });
});

describe('emptySnapshot', () => {
  it('has no data and source none', () => {
    const snapshot = emptySnapshot(new Date('2026-11-02T10:00:00Z'));
    expect(snapshot).toMatchObject({ source: 'none', repos: [], recent: [], latestRelease: null, contributions: null });
  });
});
