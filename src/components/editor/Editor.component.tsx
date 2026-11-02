'use client';

import { useEffect, type ReactNode } from 'react';
import { Egg } from 'lucide-react';
import { useSiteContent } from '@/components/site/SiteContentProvider.component';
import type { GitHubSnapshot } from '@/lib/github/types';
import { DEFAULT_CONTENT } from '@/lib/site-content';
import { DEFAULT_ACCENT, HIDDEN_THEME } from '@/lib/themes';
import { EASTER_EGG_COUNT, EASTER_EGGS } from './easter-eggs';
import { EDITOR_TABS, EditorStateProvider, useEditorState, type EditorTab } from './EditorState.component';
import { LivePreview } from './LivePreview.component';
import { MatrixRain } from './MatrixRain.component';
import { Minimap } from './Minimap.component';
import { BottomPanel } from './panel/BottomPanel.component';
import { ReleaseToast } from './ReleaseToast.component';
import { ActivityBar } from './sidebar/ActivityBar.component';
import { Explorer } from './sidebar/Explorer.component';
import { EXTENSION_COUNT, Extensions } from './sidebar/Extensions.component';
import { SearchPanel } from './sidebar/SearchPanel.component';
import { SourceControl } from './sidebar/SourceControl.component';
import { GitGraph } from './tabs/GitGraph.component';
import { EnvFile } from './tabs/EnvFile.component';
import { JourneyMd } from './tabs/JourneyMd.component';
import { PageTsx } from './tabs/PageTsx.component';
import { SettingsJson } from './tabs/SettingsJson.component';
import { useKonamiCode } from './useKonamiCode';

const TAB_LANGUAGES: Record<EditorTab, string> = {
  'page.tsx': 'TypeScript React',
  'journey.md': 'Markdown',
  'settings.json': 'JSON with Comments',
  '.env': 'Environment',
  'Git Graph': 'Git Graph',
};

interface EditorProps {
  snapshot: GitHubSnapshot;
  now: string;
}

function TabBar(): ReactNode {
  const { tab, setTab } = useEditorState();
  return (
    <div role="tablist" aria-label="Open files" className="flex grow overflow-x-auto">
      {EDITOR_TABS.map((label) => {
        const isActive = label === tab;
        return (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setTab(label)}
            className={`whitespace-nowrap border-r border-site-line px-4 py-2.5 font-mono text-[13px] transition-colors duration-150 focus-visible:text-site-fg ${
              isActive ? 'bg-site-hover text-site-fg shadow-[inset_0_2px_0_var(--site-accent)]' : 'text-site-dim hover:text-site-text2'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function TabContent({ snapshot, now }: EditorProps): ReactNode {
  const { tab } = useEditorState();
  if (tab === 'page.tsx') return <PageTsx />;
  if (tab === 'journey.md') return <JourneyMd />;
  if (tab === 'settings.json') return <SettingsJson />;
  if (tab === '.env') return <EnvFile />;
  return <GitGraph snapshot={snapshot} now={now} />;
}

function Sidebar({ snapshot, now }: EditorProps): ReactNode {
  const { view, isMobileSidebarOpen } = useEditorState();
  return (
    <aside
      aria-label="Sidebar"
      className={`${isMobileSidebarOpen ? 'block' : 'hidden'} max-h-72 shrink-0 overflow-y-auto border-b border-site-line bg-site-panel py-3 md:block md:h-[560px] md:max-h-none md:w-[260px] md:border-b-0 md:border-r`}
    >
      {view === 'explorer' && <Explorer />}
      {view === 'search' && <SearchPanel repos={snapshot.repos} />}
      {view === 'scm' && <SourceControl recent={snapshot.recent} now={now} />}
      {view === 'extensions' && <Extensions />}
    </aside>
  );
}

function useSiteEasterEggs(): void {
  const { content, theme, setTheme, accent } = useSiteContent();
  const { tab, findEgg, print } = useEditorState();
  useKonamiCode(() => {
    setTheme(HIDDEN_THEME);
    print([{ text: '↑↑↓↓←→←→BA · +30 lives · Synthwave theme unlocked', tone: 'success' }]);
    findEgg('konami');
  });
  useEffect(() => {
    if (tab === '.env') findEgg('env-tab');
  }, [tab, findEgg]);
  useEffect(() => {
    if (theme === 'CRT') findEgg('crt');
  }, [theme, findEgg]);
  useEffect(() => {
    if (accent !== DEFAULT_ACCENT) findEgg('accent');
  }, [accent, findEgg]);
  useEffect(() => {
    if (content !== DEFAULT_CONTENT) findEgg('live-edit');
  }, [content, findEgg]);
}

function EasterEggCounter(): ReactNode {
  const { foundEggs, print, setPanel } = useEditorState();
  if (foundEggs.length === 0) return null;
  const showFound = () => {
    setPanel('terminal');
    print([{ text: `🥚 ${foundEggs.length}/${EASTER_EGG_COUNT} found: ${foundEggs.map((egg) => EASTER_EGGS[egg]).join(', ')}`, tone: 'success' }]);
  };
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 hover:underline focus-visible:underline"
      aria-label={`Easter eggs found: ${foundEggs.length} of ${EASTER_EGG_COUNT}`}
      title="Easter eggs found"
      onClick={showFound}
    >
      <Egg aria-hidden="true" className="h-3 w-3" />
      {foundEggs.length}/{EASTER_EGG_COUNT}
    </button>
  );
}

function StatusBar(): ReactNode {
  const { theme, cycleTheme } = useSiteContent();
  const { tab, setTab, setPanel } = useEditorState();
  const buttonClass = 'hover:underline focus-visible:underline';
  return (
    <div className="flex flex-wrap gap-4 bg-site-accent px-3.5 py-1 font-mono text-xs text-site-ink">
      <button type="button" className={buttonClass} title="Open Git Graph" onClick={() => setTab('Git Graph')}>
        ⎇ main
      </button>
      <button type="button" className={buttonClass} title="Show problems" onClick={() => setPanel('problems')}>
        ✓ 0 ⚠ 1
      </button>
      <EasterEggCounter />
      <span className="grow" />
      <span className="hidden sm:inline">{TAB_LANGUAGES[tab]}</span>
      <span className="hidden sm:inline">UTF-8</span>
      <button type="button" className={buttonClass} aria-label={`Switch theme (current: ${theme})`} onClick={cycleTheme}>
        ◐ {theme}
      </button>
    </div>
  );
}

function RunButton(): ReactNode {
  const { tab, startRun } = useEditorState();
  if (tab !== 'page.tsx') return null;
  return (
    <button type="button" aria-label="Run page.tsx" title="Run" onClick={startRun} className="px-4 text-sm text-site-ok hover:opacity-80">
      ▶
    </button>
  );
}

function EditorWindow({ snapshot, now }: EditorProps): ReactNode {
  const { tab, isPreviewOpen, isMatrixOn } = useEditorState();
  useSiteEasterEggs();
  const isPreviewVisible = isPreviewOpen && tab === 'page.tsx';
  return (
    <section aria-label="Code editor" className="tile overflow-clip rounded-[14px] shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]" style={{ animationDelay: '1.1s' }}>
      <div className="flex items-center gap-2 border-b border-site-line bg-site-panel px-3.5 py-2.5">
        <span className="h-[11px] w-[11px] rounded-full bg-site-mac-red" />
        <span className="h-[11px] w-[11px] rounded-full bg-site-mac-yellow" />
        <span className="h-[11px] w-[11px] rounded-full bg-site-mac-green" />
        <span className="grow text-center font-mono text-xs text-site-dim">pladsen.dev — {tab}</span>
      </div>
      <div className="flex min-w-0 flex-col md:flex-row">
        <ActivityBar extensionCount={EXTENSION_COUNT} />
        <Sidebar snapshot={snapshot} now={now} />
        <div className="flex min-w-0 grow flex-col">
          <div className="flex items-stretch border-b border-site-line bg-site-panel">
            <TabBar />
            <RunButton />
          </div>
          <div className="px-5 py-2 font-mono text-xs text-site-faint">
            src › app › {tab}
            {tab === 'page.tsx' && (
              <>
                {' › '}
                <span className="text-site-fn">developer</span>
              </>
            )}
          </div>
          <div className="flex h-[380px] min-h-0">
            <div className="relative min-w-0 grow overflow-auto pb-6 pt-1">
              <TabContent snapshot={snapshot} now={now} />
              {isMatrixOn && <MatrixRain />}
            </div>
            {isPreviewVisible && <LivePreview />}
            <Minimap />
          </div>
          <BottomPanel snapshot={snapshot} />
        </div>
      </div>
      <ReleaseToast release={snapshot.latestRelease} now={now} />
      <StatusBar />
    </section>
  );
}

export function Editor(props: EditorProps): ReactNode {
  return (
    <EditorStateProvider>
      <EditorWindow {...props} />
    </EditorStateProvider>
  );
}
