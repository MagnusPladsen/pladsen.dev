'use client';

import { useState, type ReactNode } from 'react';
import { fuzzyMatch } from '@/lib/fuzzy';
import type { Repo } from '@/lib/github/types';
import { PanelHeading, SIDEBAR_ROW } from './PanelHeading.component';

const MAX_RESULTS = 14;

export function SearchPanel({ repos }: { repos: Repo[] }): ReactNode {
  const [query, setQuery] = useState('');
  const matches = repos.filter((repo) => fuzzyMatch(repo.name, query));

  return (
    <>
      <PanelHeading>SEARCH REPOS</PanelHeading>
      <label className="mx-3 mb-2.5 block">
        <span className="sr-only">Search repos</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="fuzzy… try “clde”"
          className="w-full rounded-md border border-site-tile-border bg-site-bg px-2.5 py-1.5 font-mono text-xs text-site-fg outline-none placeholder:text-site-faint focus:border-site-accent"
        />
      </label>
      <p className="px-3.5 pb-1.5 font-mono text-[11px] text-site-dim">
        {matches.length} of {repos.length} repos
      </p>
      {matches.length === 0 ? (
        <p className="px-3.5 font-mono text-xs text-site-faint">no repo matches “{query}”</p>
      ) : (
        <ul aria-label="Search results">
          {matches.slice(0, MAX_RESULTS).map((repo) => (
            <li key={repo.name}>
              <a href={repo.url} target="_blank" rel="noreferrer" className={SIDEBAR_ROW}>
                <span style={{ color: repo.languageColor ?? 'var(--faint)' }}>●</span>
                <span className="grow truncate">{repo.name}</span>
                <span className="text-[11px] text-site-faint">{repo.language ?? '—'}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
