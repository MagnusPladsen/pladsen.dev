export type CommitType = 'feat' | 'fix' | 'merge' | 'chore' | 'refactor' | 'docs';

export interface Commit {
  sha: string;
  shortSha: string;
  message: string;
  subject: string;
  type: CommitType;
  date: string;
  url: string;
  additions: number | null;
  deletions: number | null;
}

export interface Repo {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  languageColor: string | null;
  isFork: boolean;
  stars: number;
  createdAt: string;
  pushedAt: string;
}

export interface RecentRepo extends Repo {
  commits: Commit[];
}

export interface Release {
  repo: string;
  tag: string;
  publishedAt: string;
  url: string;
}

export interface LanguageShare {
  name: string;
  color: string;
  count: number;
}

export interface GitHubSnapshot {
  fetchedAt: string;
  source: 'graphql' | 'rest' | 'none';
  repos: Repo[];
  recent: RecentRepo[];
  latestRelease: Release | null;
  totals: { publicRepos: number; originals: number; forks: number };
  languages: LanguageShare[];
  contributions: number[] | null;
}

export interface GraphQLCommit {
  oid: string;
  abbreviatedOid: string;
  message: string;
  messageHeadline: string;
  committedDate: string;
  additions: number;
  deletions: number;
  url: string;
}

export interface GraphQLRepo {
  name: string;
  url: string;
  description: string | null;
  isFork: boolean;
  stargazerCount: number;
  createdAt: string;
  pushedAt: string;
  primaryLanguage: { name: string; color: string | null } | null;
  latestRelease: { tagName: string; publishedAt: string; url: string } | null;
}

export interface GraphQLRecentRepo {
  name: string;
  defaultBranchRef: { target: { history?: { nodes: GraphQLCommit[] } } } | null;
}

export interface GraphQLUser {
  repositories: { nodes: GraphQLRepo[] };
  recent: { nodes: GraphQLRecentRepo[] };
  contributionsCollection: {
    contributionCalendar: { weeks: { contributionDays: { date: string; contributionCount: number }[] }[] };
  };
}
