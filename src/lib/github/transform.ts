import type {
  Commit,
  CommitType,
  GitHubSnapshot,
  GraphQLCommit,
  GraphQLRepo,
  GraphQLUser,
  LanguageShare,
  RecentRepo,
  Release,
  Repo,
} from './types';

const RECENT_REPO_COUNT = 6;
const HEATMAP_WEEKS = 26;
const TOP_LANGUAGE_COUNT = 4;
const OTHER_LANGUAGE_COLOR = '#52525b';
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

export function getCommitType(message: string): CommitType {
  const prefix = message.match(/^(feat|fix|chore|refactor|docs)(\(.+\))?!?:/i);
  if (prefix) return prefix[1].toLowerCase() as CommitType;
  if (/^Merge\b/.test(message)) return 'merge';
  if (/^Update .+ to v?\d/.test(message)) return 'chore';
  if (/^(Remove|Delete|Rename|Move)\b/.test(message)) return 'refactor';
  return 'feat';
}

export function formatRelative(iso: string, now: Date): string {
  const elapsed = Math.max(0, now.getTime() - new Date(iso).getTime());
  if (elapsed < HOUR) return `${Math.max(1, Math.round(elapsed / MINUTE))}m`;
  if (elapsed < DAY) return `${Math.round(elapsed / HOUR)}h`;
  if (elapsed < WEEK) return `${Math.round(elapsed / DAY)}d`;
  return `${Math.round(elapsed / WEEK)}w`;
}

export function getTimelinePosition(iso: string, now: Date, days = 7): number {
  const windowMs = days * DAY;
  const age = now.getTime() - new Date(iso).getTime();
  return Math.min(100, Math.max(0, Math.round(((windowMs - age) / windowMs) * 1000) / 10));
}

function toRepo(node: GraphQLRepo): Repo {
  return {
    name: node.name,
    url: node.url,
    description: node.description,
    language: node.primaryLanguage?.name ?? null,
    languageColor: node.primaryLanguage?.color ?? null,
    isFork: node.isFork,
    stars: node.stargazerCount,
    createdAt: node.createdAt,
    pushedAt: node.pushedAt,
  };
}

function toCommit(node: GraphQLCommit): Commit {
  return {
    sha: node.oid,
    shortSha: node.abbreviatedOid.slice(0, 7),
    message: node.message,
    subject: node.messageHeadline,
    type: getCommitType(node.messageHeadline),
    date: node.committedDate,
    url: node.url,
    additions: node.additions,
    deletions: node.deletions,
  };
}

function getLatestRelease(nodes: GraphQLRepo[]): Release | null {
  const releases = nodes
    .filter((node) => node.latestRelease)
    .map((node) => ({ repo: node.name, tag: node.latestRelease!.tagName, publishedAt: node.latestRelease!.publishedAt, url: node.latestRelease!.url }));
  return releases.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0] ?? null;
}

export function getLanguageShares(repos: Repo[]): LanguageShare[] {
  const counts = new Map<string, LanguageShare>();
  for (const repo of repos) {
    if (!repo.language) continue;
    const share = counts.get(repo.language) ?? { name: repo.language, color: repo.languageColor ?? OTHER_LANGUAGE_COLOR, count: 0 };
    share.count += 1;
    counts.set(repo.language, share);
  }
  const sorted = [...counts.values()].sort((a, b) => b.count - a.count);
  const other = sorted.slice(TOP_LANGUAGE_COUNT).reduce((sum, share) => sum + share.count, 0);
  const unknown = repos.filter((repo) => !repo.language).length;
  const top = sorted.slice(0, TOP_LANGUAGE_COUNT);
  return other + unknown > 0 ? [...top, { name: 'other', color: OTHER_LANGUAGE_COLOR, count: other + unknown }] : top;
}

function toContributionLevels(user: GraphQLUser): number[] {
  const weeks = user.contributionsCollection.contributionCalendar.weeks.slice(-HEATMAP_WEEKS);
  const buckets = weeks.flatMap((week) => {
    const counts = week.contributionDays.map((day) => day.contributionCount);
    return [0, 2, 4, 6].map((start) => counts.slice(start, start + 2).reduce((sum, count) => sum + count, 0));
  });
  const nonZero = buckets.filter((count) => count > 0).sort((a, b) => a - b);
  const quartile = (fraction: number) => nonZero[Math.floor((nonZero.length - 1) * fraction)] ?? 0;
  const thresholds = [quartile(0.25), quartile(0.5), quartile(0.75)];
  return buckets.map((count) => (count === 0 ? 0 : 1 + thresholds.filter((threshold) => count > threshold).length));
}

export function getTotals(repos: Repo[]): GitHubSnapshot['totals'] {
  const forks = repos.filter((repo) => repo.isFork).length;
  return { publicRepos: repos.length, originals: repos.length - forks, forks };
}

export function toSnapshot(user: GraphQLUser, fetchedAt: Date): GitHubSnapshot {
  const repos = user.repositories.nodes.map(toRepo);
  const byName = new Map(repos.map((repo) => [repo.name, repo]));
  const recent: RecentRepo[] = user.recent.nodes
    .filter((node) => node.defaultBranchRef?.target.history && byName.has(node.name))
    .map((node) => ({ ...byName.get(node.name)!, commits: node.defaultBranchRef!.target.history!.nodes.map(toCommit) }))
    .filter((repo) => repo.commits.length > 0)
    .slice(0, RECENT_REPO_COUNT);
  return {
    fetchedAt: fetchedAt.toISOString(),
    source: 'graphql',
    repos,
    recent,
    latestRelease: getLatestRelease(user.repositories.nodes),
    totals: getTotals(repos),
    languages: getLanguageShares(repos),
    contributions: toContributionLevels(user),
  };
}

export function emptySnapshot(fetchedAt: Date): GitHubSnapshot {
  return {
    fetchedAt: fetchedAt.toISOString(),
    source: 'none',
    repos: [],
    recent: [],
    latestRelease: null,
    totals: { publicRepos: 0, originals: 0, forks: 0 },
    languages: [],
    contributions: null,
  };
}
