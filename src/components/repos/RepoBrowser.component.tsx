'use client';

import { Star } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { fuzzyMatch } from '@/lib/fuzzy';
import { formatRelative } from '@/lib/github/transform';
import type { Repo } from '@/lib/github/types';

type SortKey = 'pushed' | 'stars' | 'name';

const SORTERS: Record<SortKey, (a: Repo, b: Repo) => number> = {
  pushed: (a, b) => b.pushedAt.localeCompare(a.pushedAt),
  stars: (a, b) => b.stars - a.stars,
  name: (a, b) => a.name.localeCompare(b.name),
};

const FILTER_CHIP = 'rounded-full border px-3 py-1 font-mono text-xs transition-colors duration-150';

function getLanguages(repos: Repo[]): string[] {
  return [...new Set(repos.map((repo) => repo.language).filter((language): language is string => language !== null))].sort();
}

function RepoRow({ repo, now }: { repo: Repo; now: Date }): ReactNode {
  return (
    <li>
      <a href={repo.url} target="_blank" rel="noreferrer" className="flex flex-col gap-1.5 px-5 py-4 transition-colors duration-150 hover:bg-site-hover focus-visible:bg-site-hover">
        <div className="flex items-center gap-2">
          <h2 className="font-mono text-sm font-medium text-site-fg">{repo.name}</h2>
          {repo.isFork && <span className="rounded-full border border-site-tile-border px-2 font-mono text-[10px] text-site-dim">fork</span>}
        </div>
        {repo.description && <p className="text-[13px] text-site-muted">{repo.description}</p>}
        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-site-dim">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span style={{ color: repo.languageColor ?? 'var(--faint)' }}>●</span>
              {repo.language}
            </span>
          )}
          {repo.stars > 0 && (
            <span className="flex items-center gap-1">
              <Star aria-hidden="true" className="h-3 w-3" />
              {repo.stars}
            </span>
          )}
          <span>pushed {formatRelative(repo.pushedAt, now)} ago</span>
        </div>
      </a>
    </li>
  );
}

export function RepoBrowser({ repos, now }: { repos: Repo[]; now: string }): ReactNode {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState<string | null>(null);
  const [isOriginalsOnly, setOriginalsOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('pushed');
  const languages = useMemo(() => getLanguages(repos), [repos]);
  const visible = repos
    .filter((repo) => fuzzyMatch(repo.name, query) && (!language || repo.language === language) && (!isOriginalsOnly || !repo.isFork))
    .sort(SORTERS[sortKey]);

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
        <label className="flex items-center gap-2 font-mono text-xs text-site-muted">
          Sort by
          <select
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
            className="rounded-md border border-site-tile-border bg-site-bg px-2 py-1.5 text-site-fg outline-none focus:border-site-accent"
          >
            <option value="pushed">last push</option>
            <option value="stars">stars</option>
            <option value="name">name</option>
          </select>
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
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
      <div className="tile mt-5 overflow-hidden rounded-2xl">
        {visible.length === 0 ? (
          <p className="p-6 font-mono text-sm text-site-faint">no repos match “{query}”</p>
        ) : (
          <ul aria-label="Repositories" className="divide-y divide-site-line">
            {visible.map((repo) => (
              <RepoRow key={repo.name} repo={repo} now={new Date(now)} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
