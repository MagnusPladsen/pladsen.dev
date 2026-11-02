'use client';

import type { ReactNode } from 'react';
import { COMMIT_TYPE_CLASSES, GITHUB_REPOS_URL } from '@/lib/commit-types';
import { formatRelative } from '@/lib/github/transform';
import type { RecentRepo } from '@/lib/github/types';
import { useEditorState } from '../EditorState.component';
import { PanelHeading, SIDEBAR_ROW } from './PanelHeading.component';

function CommitList({ repo, now }: { repo: RecentRepo; now: Date }): ReactNode {
  const { setTab } = useEditorState();
  return (
    <div className="relative mb-1.5 ml-6 border-l border-site-tile-border pl-3.5">
      <ul aria-label={`${repo.name} commits`}>
        {repo.commits.map((commit, index) => (
          <li key={commit.sha} style={{ animation: `slide .3s ease ${index * 0.04}s backwards` }}>
            <a href={commit.url} target="_blank" rel="noreferrer" title={commit.subject} className="relative flex flex-col gap-px py-1 pr-2.5 font-mono hover:text-site-fg">
              <span className={`absolute -left-[18px] top-2.5 h-[7px] w-[7px] rounded-full border-[1.5px] bg-site-panel ${index === 0 ? 'border-site-accent' : 'border-site-faint'}`} />
              <span className="flex gap-2 text-[11px]">
                <span className="text-site-accent">{commit.shortSha}</span>
                <span className="grow" />
                <span className="text-site-faint">{formatRelative(commit.date, now)}</span>
              </span>
              <span className="truncate text-xs text-site-text2">{commit.subject}</span>
            </a>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => setTab('Git Graph')} className="py-1 font-mono text-[11px] text-site-accent hover:underline">
        ⎇ open in Git Graph
      </button>
    </div>
  );
}

export function SourceControl({ recent, now }: { recent: RecentRepo[]; now: string }): ReactNode {
  const { selectedRepo, setSelectedRepo, setTab } = useEditorState();
  const nowDate = new Date(now);

  const toggle = (name: string) => {
    setSelectedRepo(selectedRepo === name ? null : name);
    setTab('Git Graph');
  };

  return (
    <>
      <PanelHeading>
        <span>SOURCE CONTROL</span>
        <span>⟳ 1h</span>
      </PanelHeading>
      {recent.length === 0 && <p className="px-3.5 font-mono text-xs text-site-faint">no pushes — GitHub didn&apos;t answer</p>}
      <ul>
        {recent.map((repo) => {
          const isOpen = selectedRepo === repo.name;
          const latest = repo.commits[0];
          return (
            <li key={repo.name}>
              <button type="button" aria-expanded={isOpen} onClick={() => toggle(repo.name)} title={latest.subject} className={`${SIDEBAR_ROW} flex-col items-start gap-0.5 py-2`}>
                <span className="flex w-full gap-2">
                  <span aria-hidden="true" className="w-2 text-site-faint">{isOpen ? '▾' : '▸'}</span>
                  <span aria-hidden="true" className={COMMIT_TYPE_CLASSES[latest.type].text}>●</span>
                  <span className="grow text-site-fg">{repo.name}</span>
                  <span className="text-site-faint">{formatRelative(latest.date, nowDate)}</span>
                </span>
                <span className="w-full truncate pl-4 text-[11px] text-site-dim">{latest.subject}</span>
              </button>
              {isOpen && <CommitList repo={repo} now={nowDate} />}
            </li>
          );
        })}
      </ul>
      <a href={GITHUB_REPOS_URL} target="_blank" rel="noreferrer" className={`${SIDEBAR_ROW} text-site-accent`}>
        … all repos on GitHub
      </a>
    </>
  );
}
