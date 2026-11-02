'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { fuzzyMatch } from '@/lib/fuzzy';
import type { Repo } from '@/lib/github/types';
import { groupByMonth, SORT_OPTIONS, sortRepos, type SortDirection, type SortKey } from './repo-sorting';
import { RepoTimeline } from './RepoTimeline.component';

const FILTER_CHIP = 'rounded-full border px-3 py-1 font-mono text-xs transition-colors duration-150';
const SORT_BUTTON = 'rounded-lg border px-2.5 py-1.5 font-mono text-xs transition-colors duration-150';

function getLanguages(repos: Repo[]): string[] {
  return [...new Set(repos.map((repo) => repo.language).filter((language): language is string => language !== null))].sort();
}

interface SortControlsProps {
  sortKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey, direction: SortDirection) => void;
}

function SortControls({ sortKey, direction, onSort }: SortControlsProps): ReactNode {
  return (
    <div role="group" aria-label="Sort by" className="flex flex-wrap items-center gap-1.5">
      <span className="font-mono text-xs text-site-dim">sort</span>
      {SORT_OPTIONS.map((option) => {
        const isActive = option.key === sortKey;
        const nextDirection = isActive ? (direction === 'asc' ? 'desc' : 'asc') : option.defaultDirection;
        return (
          <button
            key={option.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSort(option.key, nextDirection)}
            className={`${SORT_BUTTON} ${isActive ? 'border-site-accent text-site-fg' : 'border-site-tile-border text-site-muted hover:text-site-fg'}`}
          >
            {option.label}
            {isActive && (
              <>
                <span aria-hidden="true"> {direction === 'asc' ? '↑' : '↓'}</span>
                <span className="sr-only">{direction === 'asc' ? ', ascending' : ', descending'}</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function RepoBrowser({ repos }: { repos: Repo[] }): ReactNode {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState<string | null>(null);
  const [isOriginalsOnly, setOriginalsOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('pushed');
  const [direction, setDirection] = useState<SortDirection>('desc');
  const languages = useMemo(() => getLanguages(repos), [repos]);
  const visible = repos.filter((repo) => fuzzyMatch(repo.name, query) && (!language || repo.language === language) && (!isOriginalsOnly || !repo.isFork));
  const groups = groupByMonth(sortRepos(visible, sortKey, direction), sortKey);

  if (repos.length === 0) {
    return <p className="tile mt-8 rounded-2xl p-6 font-mono text-sm text-site-muted">Couldn&apos;t reach GitHub right now. Try again in a bit.</p>;
  }

  return (
    <section aria-labelledby="repos-title" className="mt-10">
      <h1 id="repos-title" className="text-3xl font-semibold tracking-tight">
        Repos <span className="font-mono text-base text-site-dim">{repos.length} public</span>
      </h1>
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="grow">
          <span className="sr-only">Search repos</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="fuzzy search… try “gmdv”"
            className="w-full rounded-lg border border-site-tile-border bg-site-bg px-3 py-2 font-mono text-sm text-site-fg outline-none placeholder:text-site-faint focus:border-site-accent"
          />
        </label>
        <label className="flex items-center gap-2 font-mono text-xs text-site-muted">
          <input type="checkbox" checked={isOriginalsOnly} onChange={(event) => setOriginalsOnly(event.target.checked)} className="accent-site-accent" />
          Originals only
        </label>
      </div>
      <div className="mt-3 flex flex-col gap-3">
        <SortControls
          sortKey={sortKey}
          direction={direction}
          onSort={(key, nextDirection) => {
            setSortKey(key);
            setDirection(nextDirection);
          }}
        />
        <div className="flex flex-wrap gap-2">
          {languages.map((name) => {
            const isActive = name === language;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={isActive}
                onClick={() => setLanguage(isActive ? null : name)}
                className={`${FILTER_CHIP} ${isActive ? 'border-site-accent text-site-fg' : 'border-site-tile-border text-site-dim hover:text-site-fg'}`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
      {visible.length === 0 ? (
        <p className="tile mt-5 rounded-2xl p-6 font-mono text-sm text-site-faint">no repos match “{query}”</p>
      ) : (
        <RepoTimeline groups={groups} sortKey={sortKey} />
      )}
    </section>
  );
}
