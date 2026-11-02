import fixture from '@/lib/github/__fixtures__/graphql.json';
import { emptySnapshot, toSnapshot } from '@/lib/github/transform';
import type { GitHubSnapshot, GraphQLUser } from '@/lib/github/types';

export const TEST_NOW = '2026-11-02T10:00:00.000Z';

export function makeSnapshot(overrides: Partial<GitHubSnapshot> = {}): GitHubSnapshot {
  return { ...toSnapshot(fixture.data.user as GraphQLUser, new Date('2026-11-02T09:48:00Z')), ...overrides };
}

export function makeEmptySnapshot(): GitHubSnapshot {
  return emptySnapshot(new Date(TEST_NOW));
}
