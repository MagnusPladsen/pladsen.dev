'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useSiteContent } from '@/components/site/SiteContentProvider.component';
import { COMMIT_TYPE_CLASSES } from '@/lib/commit-types';
import { formatRelative, getTimelinePosition } from '@/lib/github/transform';
import type { Commit, GitHubSnapshot } from '@/lib/github/types';

const ROW_GRID = 'grid grid-cols-[8px_minmax(0,1fr)_40px] gap-3.5 items-center md:grid-cols-[8px_minmax(110px,170px)_72px_minmax(0,1fr)_64px_48px]';

function DiffStat({ commit }: { commit: Commit }): ReactNode {
  if (commit.additions === null || commit.deletions === null) return <span className="hidden md:block" />;
  return (
    <span data-testid="diff-bar" title={`+${commit.additions} −${commit.deletions}`} className="hidden flex-col gap-[3px] font-mono text-[10px] text-site-dim md:flex">
      <span className="flex h-1 overflow-hidden rounded-sm bg-site-line">
        <span className="bg-site-ok" style={{ flex: commit.additions }} />
        <span className="bg-site-err" style={{ flex: commit.deletions }} />
      </span>
      <span>
        <span className="text-site-ok">+{commit.additions}</span> <span className="text-site-err">−{commit.deletions}</span>
      </span>
    </span>
  );
}

export function LatestPushes({ snapshot, now }: { snapshot: GitHubSnapshot; now: string }): ReactNode {
  const { content } = useSiteContent();
  const nowDate = new Date(now);
  const syncedMinutes = Math.max(0, Math.round((nowDate.getTime() - new Date(snapshot.fetchedAt).getTime()) / 60_000));

  return (
    <section aria-labelledby="pushes-title" className="tile min-w-0 px-6 py-5 lg:col-span-2" style={{ animationDelay: '.2s' }}>
      <div className="flex flex-wrap items-center gap-3.5">
        <h2 id="pushes-title" className="section-label">
          <span className="method-badge">GET</span> <span>/repos?sort=pushed</span>
        </h2>
        <div aria-hidden="true" className="relative mx-2 hidden h-3.5 min-w-[120px] flex-1 sm:block">
          <div className="absolute inset-x-0 top-1/2 h-px origin-left" style={{ background: 'linear-gradient(90deg, var(--line), var(--site-accent))', animation: 'sweep 1.4s cubic-bezier(.2,.8,.2,1) .2s backwards' }} />
          {snapshot.recent.map((repo, index) => (
            <span
              key={repo.name}
              className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-site-bg ${COMMIT_TYPE_CLASSES[repo.commits[0].type].dot}`}
              style={{ left: `${getTimelinePosition(repo.pushedAt, nowDate)}%`, animation: `pop .4s ease ${0.2 + index * 0.1}s backwards` }}
            />
          ))}
          <span className="absolute left-full top-1/2 h-3.5 w-3.5 rounded-full border border-site-accent" style={{ animation: 'ripple 2s ease-out infinite' }} />
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-site-dim">
          <span className="live-dot" />
          s-maxage=3600 · synced {syncedMinutes} min ago
        </span>
      </div>

      {snapshot.recent.length === 0 ? (
        <p className="mt-6 font-mono text-[13px] text-site-dim">couldn&apos;t reach GitHub — showing nothing rather than stale data. Try again in a bit.</p>
      ) : (
        <>
          <div aria-hidden="true" className={`${ROW_GRID} mt-3.5 border-b border-site-line px-3 pb-1.5 font-mono text-[10px] uppercase tracking-wider text-site-faint`}>
            <span />
            <span>repo</span>
            <span className="hidden md:block">type</span>
            <span className="hidden md:block">message</span>
            <span className="hidden md:block">diff</span>
            <span className="text-right">pushed</span>
          </div>
          {snapshot.recent.map((repo, index) => {
            const commit = repo.commits[0];
            return (
              <a
                key={repo.name}
                href={commit.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`push ${repo.name}: ${commit.subject}`}
                className={`${ROW_GRID} group relative border-b border-site-line px-3 py-2.5 transition-colors duration-150 hover:bg-site-hover focus-visible:bg-site-hover`}
                style={{ animation: `line-in .4s ease ${0.2 + index * 0.1}s backwards` }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: repo.languageColor ?? 'var(--faint)' }} />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex items-center gap-2 truncate font-semibold">
                    {repo.name}
                    {index === 0 && <span className="live-dot-text font-mono text-[9px] font-medium text-site-ok">HEAD</span>}
                  </span>
                  <span className="truncate font-mono text-xs text-site-muted md:hidden">{commit.subject}</span>
                </span>
                <span className="hidden md:block">
                  <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-medium ${COMMIT_TYPE_CLASSES[commit.type].badge}`}>{commit.type}</span>
                </span>
                <span className="hidden truncate font-mono text-xs text-site-muted md:block">&quot;{commit.subject}&quot;</span>
                <DiffStat commit={commit} />
                <span className="text-right font-mono text-xs text-site-dim">
                  <span aria-hidden="true" className="text-site-accent opacity-0 transition-opacity duration-150 group-hover:opacity-100">↗ </span>
                  {formatRelative(commit.date, nowDate)}
                </span>
              </a>
            );
          })}
        </>
      )}
      <Link href="/repos" className="mt-3 inline-block text-sm text-site-accent hover:underline">
        {content.copy.browseRepos}
        {snapshot.totals.publicRepos > 0 && ` (${snapshot.totals.publicRepos})`} →
      </Link>
    </section>
  );
}
