'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import { useSiteContent } from '@/components/site/SiteContentProvider.component';
import techData from '@/components/tech/tech.data';
import type { GitHubSnapshot } from '@/lib/github/types';
import { useEditorState, type PanelTab } from '../EditorState.component';
import { runTerminalCommand, type TerminalTone } from '../terminal-commands';

const PANEL_TABS: { id: PanelTab; label: string }[] = [
  { id: 'terminal', label: 'TERMINAL' },
  { id: 'problems', label: 'PROBLEMS 1' },
  { id: 'output', label: 'OUTPUT' },
];

const TONE_CLASSES: Record<TerminalTone, string> = {
  muted: 'text-site-muted',
  plain: 'text-site-dim',
  success: 'text-site-ok',
  warning: 'text-site-warn',
  error: 'text-site-err',
};

const TECH_NAMES = techData.flatMap((group) => group.techs.map((tech) => tech.name));

function Terminal({ snapshot, scrollRef }: { snapshot: GitHubSnapshot; scrollRef: RefObject<HTMLDivElement | null> }): ReactNode {
  const { content, setTheme } = useSiteContent();
  const { terminalLines, print, clearTerminal, startRun, startMatrix, findEgg } = useEditorState();
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, [terminalLines, scrollRef]);

  const runCommand = () => {
    const trimmed = command.trim();
    const result = runTerminalCommand(trimmed, { content, snapshot, techNames: TECH_NAMES, history });
    setCommand('');
    if (!trimmed) return;
    setHistory((current) => [...current, trimmed]);
    if (result.egg) findEgg(result.egg);
    if (result.effect?.kind === 'clear') return clearTerminal();
    print([{ text: `$ ${trimmed}`, tone: 'plain' }, ...result.lines]);
    if (result.effect?.kind === 'run') startRun();
    if (result.effect?.kind === 'matrix') startMatrix();
    if (result.effect?.kind === 'theme') setTheme(result.effect.theme);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') runCommand();
    if (event.key === 'ArrowUp' && history.length > 0) {
      event.preventDefault();
      setCommand(history[history.length - 1]);
    }
  };

  return (
    <>
      <div aria-live="polite">
        {terminalLines.map((line, index) => (
          // Terminal output is append-only; position is the line's identity.
          <div key={`${index}-${line.text}`} className={`whitespace-pre-wrap ${line.tone === 'plain' && line.text.startsWith('$') ? 'text-site-fg' : TONE_CLASSES[line.tone]}`}>
            {line.text}
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2">
        <span aria-hidden="true" className="text-site-ok">➜</span>
        <span aria-hidden="true" className="text-site-fn">~</span>
        <span className="sr-only">Terminal command</span>
        <input
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type help and press enter"
          spellCheck={false}
          autoComplete="off"
          className="grow border-0 bg-transparent font-mono text-site-fg caret-site-accent outline-none placeholder:text-site-faint"
        />
      </label>
    </>
  );
}

function Output({ snapshot }: { snapshot: GitHubSnapshot }): ReactNode {
  const isOnline = snapshot.source !== 'none';
  return (
    <div className="text-site-muted">
      <div>
        [sync] {snapshot.source === 'graphql' ? 'POST api.github.com/graphql' : 'GET api.github.com/users/MagnusPladsen/repos'} →{' '}
        {isOnline ? `200 (${snapshot.totals.publicRepos} repos)` : 'failed'}
      </div>
      <div>[sync] fetched {new Date(snapshot.fetchedAt).toISOString()} · cached for 3600s</div>
      <div>[build] ✓ prerendered /</div>
    </div>
  );
}

export function BottomPanel({ snapshot }: { snapshot: GitHubSnapshot }): ReactNode {
  const { panel, setPanel } = useEditorState();
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <div className="border-t border-site-line bg-site-panel">
      <div role="tablist" aria-label="Panel" className="flex gap-5 px-5 pt-2">
        {PANEL_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={panel === tab.id}
            onClick={() => setPanel(tab.id)}
            className={`pb-1 font-mono text-[11px] transition-colors duration-150 ${panel === tab.id ? 'text-site-fg shadow-[inset_0_-1px_0_var(--site-accent)]' : 'text-site-dim hover:text-site-fg'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div ref={scrollRef} className="h-[150px] overflow-y-auto px-5 pb-3.5 pt-2 font-mono text-[13px] leading-[1.7]">
        {panel === 'terminal' && <Terminal snapshot={snapshot} scrollRef={scrollRef} />}
        {panel === 'problems' && (
          <>
            <div className="text-site-muted">
              <span className="text-site-ok">✓</span> 0 errors
            </div>
            <div className="text-site-text2">
              <span className="text-site-warn">⚠</span> coffee level low <span className="text-site-faint">magnus.ts:1:1 (caffeine/no-empty-mug)</span>
            </div>
          </>
        )}
        {panel === 'output' && <Output snapshot={snapshot} />}
      </div>
    </div>
  );
}
