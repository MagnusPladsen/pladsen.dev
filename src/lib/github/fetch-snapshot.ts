import { SNAPSHOT_QUERY } from './query';
import { emptySnapshot, getCommitType, getLanguageShares, getTotals, toSnapshot } from './transform';
import type { Commit, GitHubSnapshot, GraphQLUser, RecentRepo, Repo } from './types';

export const GITHUB_LOGIN = 'MagnusPladsen';
const API_URL = 'https://api.github.com';
const REVALIDATE_SECONDS = 3600;
const RECENT_REPO_COUNT = 6;

interface RestRepo {
  name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  created_at: string;
  pushed_at: string;
  language: string | null;
}

interface RestCommit {
  sha: string;
  html_url: string;
  commit: { message: string; committer: { date: string } | null };
}

async function getJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { Accept: 'application/vnd.github+json', ...init.headers },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) throw new Error(`GitHub responded ${response.status} for ${url}`);
  return (await response.json()) as T;
}

async function fetchWithGraphQL(token: string, fetchedAt: Date): Promise<GitHubSnapshot> {
  const body = await getJson<{ data?: { user: GraphQLUser }; errors?: unknown[] }>(`${API_URL}/graphql`, {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: SNAPSHOT_QUERY, variables: { login: GITHUB_LOGIN } }),
  });
  if (body.errors?.length || !body.data) throw new Error('GitHub GraphQL returned errors');
  return toSnapshot(body.data.user, fetchedAt);
}

function toRepo(repo: RestRepo): Repo {
  return {
    name: repo.name,
    url: repo.html_url,
    description: repo.description,
    language: repo.language,
    languageColor: null,
    isFork: repo.fork,
    stars: repo.stargazers_count,
    createdAt: repo.created_at,
    pushedAt: repo.pushed_at,
  };
}

function toCommit(commit: RestCommit): Commit {
  const subject = commit.commit.message.split('\n')[0];
  return {
    sha: commit.sha,
    shortSha: commit.sha.slice(0, 7),
    message: commit.commit.message,
    subject,
    type: getCommitType(subject),
    date: commit.commit.committer?.date ?? '',
    url: commit.html_url,
    additions: null,
    deletions: null,
  };
}

async function fetchWithRest(fetchedAt: Date): Promise<GitHubSnapshot> {
  const repos = (await getJson<RestRepo[]>(`${API_URL}/users/${GITHUB_LOGIN}/repos?per_page=100&sort=pushed`)).map(toRepo);
  const withCommits: RecentRepo[] = await Promise.all(
    repos.slice(0, RECENT_REPO_COUNT).map(async (repo) => {
      const commits = await getJson<RestCommit[]>(`${API_URL}/repos/${GITHUB_LOGIN}/${repo.name}/commits?per_page=6`).catch(() => []);
      return { ...repo, commits: commits.map(toCommit) };
    }),
  );
  const recent = withCommits.filter((repo) => repo.commits.length > 0);
  return {
    fetchedAt: fetchedAt.toISOString(),
    source: 'rest',
    repos,
    recent,
    latestRelease: null,
    totals: getTotals(repos),
    languages: getLanguageShares(repos),
    contributions: null,
  };
}

export async function fetchGitHubSnapshot(): Promise<GitHubSnapshot> {
  const fetchedAt = new Date();
  const token = process.env.GITHUB_TOKEN;
  try {
    return token ? await fetchWithGraphQL(token, fetchedAt) : await fetchWithRest(fetchedAt);
  } catch (error) {
    console.error({ event: 'github_snapshot_failed', source: token ? 'graphql' : 'rest', error: String(error) });
    return emptySnapshot(fetchedAt);
  }
}
