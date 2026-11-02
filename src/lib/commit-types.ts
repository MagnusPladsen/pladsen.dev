import type { CommitType } from './github/types';

export const COMMIT_TYPE_CLASSES: Record<CommitType, { text: string; badge: string; dot: string }> = {
  feat: { text: 'text-site-ok', badge: 'bg-site-ok/15 text-site-ok', dot: 'bg-site-ok' },
  fix: { text: 'text-site-warn', badge: 'bg-site-warn/15 text-site-warn', dot: 'bg-site-warn' },
  merge: { text: 'text-site-violet', badge: 'bg-site-violet/15 text-site-violet', dot: 'bg-site-violet' },
  chore: { text: 'text-site-info', badge: 'bg-site-info/15 text-site-info', dot: 'bg-site-info' },
  refactor: { text: 'text-site-err', badge: 'bg-site-err/15 text-site-err', dot: 'bg-site-err' },
  docs: { text: 'text-site-warn', badge: 'bg-site-warn/15 text-site-warn', dot: 'bg-site-warn' },
};

export const GITHUB_PROFILE_URL = 'https://github.com/MagnusPladsen';
export const GITHUB_REPOS_URL = `${GITHUB_PROFILE_URL}?tab=repositories`;
