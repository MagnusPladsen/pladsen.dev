'use client';

import type { ReactNode } from 'react';
import { formatRelative } from '@/lib/github/transform';
import type { GitHubSnapshot } from '@/lib/github/types';
import { useEditorState } from '../EditorState.component';

interface GraphEntry {
  key: string;
  shortSha: string;
  repo: string;
  branch: string;
  subject: string;
  date: string;
  url: string;
}

function getEntries(snapshot: GitHubSnapshot, selectedRepo: string | null): GraphEntry[] {
  const repo = snapshot.recent.find((candidate) => candidate.name === selectedRepo);
  if (repo) {
    return repo.commits.map((commit, index) => ({
      key: commit.sha,
      shortSha: commit.shortSha,
      repo: repo.name,
      branch: index === 0 ? 'HEAD → main' : 'main',
      subject: commit.subject,
      date: commit.date,
      url: commit.url,
    }));
  }
  return snapshot.recent.map((recent) => ({
    key: recent.name,
    shortSha: recent.commits[0].shortSha,
    repo: recent.name,
    branch: 'main',
    subject: recent.commits[0].subject,
    date: recent.commits[0].date,
    url: recent.commits[0].url,
  }));
}

export function GitGraph({ snapshot, now }: { snapshot: GitHubSnapshot; now: string }): ReactNode {
  const { selectedRepo, setSelectedRepo } = useEditorState();
  const isFiltered = snapshot.recent.some((repo) => repo.name === selectedRepo);
  const entries = getEntries(snapshot, selectedRepo);
  const nowDate = new Date(now);

  return (
    <div>
      <div className="flex flex-wrap gap-4 px-5 pt-1 font-mono text-xs text-site-dim">
        <span className="text-site-text2">$ {isFiltered ? `git log --graph -6 ${selectedRepo}` : 'git log --graph --all --author=magnus'}</span>
        {isFiltered && (
          <button type="button" onClick={() => setSelectedRepo(null)} className="text-site-accent hover:underline">
            ✕ show all repos
          </button>
        )}
      </div>
      {entries.length === 0 ? (
        <p className="px-5 pt-6 font-mono text-xs text-site-faint">nothing to graph — GitHub didn&apos;t answer this hour.</p>
      ) : (
        <ol key={selectedRepo ?? 'all'} className="relative pb-0 pl-14 pr-5 pt-4">
          <span aria-hidden="true" className="absolute bottom-6 left-[31px] top-6 w-0.5 origin-top bg-site-accent" style={{ animation: 'grow 1.2s cubic-bezier(.2,.8,.2,1) backwards' }} />
          {entries.map((entry, index) => (
            <li key={entry.key} className="relative" style={{ animation: `slide .45s ease ${0.2 + index * 0.1}s backwards` }}>
              <a href={entry.url} target="_blank" rel="noreferrer" className="block pb-3.5 pt-2 hover:opacity-90">
                <span aria-hidden="true" className="absolute -left-[31px] top-3 h-3 w-3 rounded-full border-[3px] border-site-accent bg-site-bg" />
                <span className="flex flex-wrap items-baseline gap-2.5">
                  <span className="rounded bg-site-hover px-1.5 py-0.5 font-mono text-xs text-site-accent">{entry.shortSha}</span>
                  <span className="font-semibold">{entry.repo}</span>
                  <span className="rounded-full border border-site-tile-border px-2 font-mono text-[11px] text-site-muted">{entry.branch}</span>
                  <span className="grow" />
                  <span className="font-mono text-xs text-site-dim">{formatRelative(entry.date, nowDate)} ago</span>
                </span>
                <span className="mt-1 block font-mono text-[13px] text-site-muted">{entry.subject}</span>
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
