import type { Repo } from '@/lib/github/types';

export type SortKey = 'pushed' | 'created' | 'stars' | 'name';
export type SortDirection = 'asc' | 'desc';

export interface RepoGroup {
  id: string;
  label: string | null;
  repos: Repo[];
}

export const SORT_OPTIONS: { key: SortKey; label: string; defaultDirection: SortDirection }[] = [
  { key: 'pushed', label: 'Last pushed', defaultDirection: 'desc' },
  { key: 'created', label: 'Created', defaultDirection: 'desc' },
  { key: 'stars', label: 'Stars', defaultDirection: 'desc' },
  { key: 'name', label: 'Name', defaultDirection: 'asc' },
];

const ASCENDING: Record<SortKey, (a: Repo, b: Repo) => number> = {
  pushed: (a, b) => a.pushedAt.localeCompare(b.pushedAt),
  created: (a, b) => a.createdAt.localeCompare(b.createdAt),
  stars: (a, b) => a.stars - b.stars,
  name: (a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }),
};

const MONTH_FORMAT = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const DAY_FORMAT = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', timeZone: 'UTC' });

export function sortRepos(repos: Repo[], key: SortKey, direction: SortDirection): Repo[] {
  const compare = ASCENDING[key];
  return [...repos].sort((a, b) => (direction === 'asc' ? compare(a, b) : compare(b, a)));
}

export function getRepoDate(repo: Repo, key: SortKey): string {
  return key === 'created' ? repo.createdAt : repo.pushedAt;
}

export function formatDay(iso: string): string {
  return DAY_FORMAT.format(new Date(iso));
}

export function groupByMonth(sorted: Repo[], key: SortKey): RepoGroup[] {
  if (key !== 'pushed' && key !== 'created') return [{ id: 'all', label: null, repos: sorted }];
  const groups: RepoGroup[] = [];
  for (const repo of sorted) {
    const date = getRepoDate(repo, key);
    const id = date.slice(0, 7);
    const last = groups.at(-1);
    if (last?.id === id) last.repos.push(repo);
    else groups.push({ id, label: MONTH_FORMAT.format(new Date(date)), repos: [repo] });
  }
  return groups;
}
