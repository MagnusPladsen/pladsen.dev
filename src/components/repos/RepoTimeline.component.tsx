import { Star } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Repo } from '@/lib/github/types';
import { formatDay, getRepoDate, type RepoGroup, type SortKey } from './repo-sorting';

function RepoEntry({ repo, sortKey }: { repo: Repo; sortKey: SortKey }): ReactNode {
  return (
    <li>
      <a
        href={repo.url}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col gap-1 rounded-lg border border-transparent px-3 py-2 transition-colors duration-150 hover:border-site-tile-border hover:bg-site-hover focus-visible:border-site-tile-border focus-visible:bg-site-hover md:flex-row md:items-baseline md:gap-4"
      >
        <span className="w-16 shrink-0 font-mono text-xs text-site-dim">{formatDay(getRepoDate(repo, sortKey))}</span>
        <span className="flex shrink-0 items-center gap-2">
          <span aria-hidden="true" style={{ color: repo.languageColor ?? 'var(--faint)' }}>●</span>
          <h3 className="font-mono text-sm text-site-fg">{repo.name}</h3>
          {repo.isFork && <span className="rounded-full border border-site-tile-border px-2 font-mono text-[10px] text-site-dim">fork</span>}
        </span>
        <span className="min-w-0 grow truncate text-[13px] text-site-muted">{repo.description}</span>
        {repo.stars > 0 && (
          <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-site-warn">
            <Star aria-hidden="true" className="h-3 w-3" />
            {repo.stars}
          </span>
        )}
      </a>
    </li>
  );
}

function MonthGroup({ group, sortKey }: { group: RepoGroup; sortKey: SortKey }): ReactNode {
  return (
    <li className="relative flex flex-col gap-2">
      <span aria-hidden="true" className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-site-accent bg-site-bg" />
      {group.label && (
        <h2 className="font-mono text-sm font-medium text-site-fg">
          {group.label} <span className="text-site-dim">· {group.repos.length} {group.repos.length === 1 ? 'repo' : 'repos'}</span>
        </h2>
      )}
      <ul className="flex flex-col gap-1">
        {group.repos.map((repo) => (
          <RepoEntry key={repo.name} repo={repo} sortKey={sortKey} />
        ))}
      </ul>
    </li>
  );
}

export function RepoTimeline({ groups, sortKey }: { groups: RepoGroup[]; sortKey: SortKey }): ReactNode {
  return (
    <div className="relative mt-6 pl-7">
      <span aria-hidden="true" className="absolute bottom-1.5 left-[7px] top-1.5 w-0.5 bg-gradient-to-b from-site-accent to-site-line to-40%" />
      <ul aria-label="Repositories" className="flex flex-col gap-6">
        {groups.map((group) => (
          <MonthGroup key={group.id} group={group} sortKey={sortKey} />
        ))}
      </ul>
    </div>
  );
}
