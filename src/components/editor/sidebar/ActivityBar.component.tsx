'use client';

import { Blocks, Files, GitBranch, Search, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEditorState, type SidebarView } from '../EditorState.component';

const VIEWS: { id: SidebarView; label: string; Icon: LucideIcon }[] = [
  { id: 'explorer', label: 'Explorer', Icon: Files },
  { id: 'search', label: 'Search', Icon: Search },
  { id: 'scm', label: 'Source Control', Icon: GitBranch },
  { id: 'extensions', label: 'Extensions', Icon: Blocks },
];

export function ActivityBar({ extensionCount }: { extensionCount: number }): ReactNode {
  const { view, setView } = useEditorState();
  return (
    <nav aria-label="Activity bar" className="flex shrink-0 flex-row border-b border-site-line bg-site-panel md:w-12 md:flex-col md:border-b-0 md:border-r md:pt-1">
      {VIEWS.map(({ id, label, Icon }) => {
        const isActive = view === id;
        return (
          <button
            key={id}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            title={label}
            onClick={() => setView(id)}
            className={`relative flex h-11 w-12 items-center justify-center border-b-2 transition-colors duration-150 md:border-b-0 md:border-l-2 ${
              isActive ? 'border-site-accent text-site-fg' : 'border-transparent text-site-dim hover:text-site-fg focus-visible:text-site-fg'
            }`}
          >
            <Icon aria-hidden="true" size={20} strokeWidth={1.6} />
            {id === 'extensions' && !isActive && (
              <span className="absolute bottom-1.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-site-accent px-1 font-mono text-[9px] font-semibold text-site-ink" style={{ animation: 'pulse-soft 2.4s ease infinite' }}>
                {extensionCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
