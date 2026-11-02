'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { Egg } from 'lucide-react';
import { useSiteContent } from '@/components/site/SiteContentProvider.component';
import type { GitHubSnapshot } from '@/lib/github/types';
import { DEFAULT_CONTENT } from '@/lib/site-content';
import { DEFAULT_ACCENT, HIDDEN_THEME } from '@/lib/themes';
import { EASTER_EGG_COUNT, EASTER_EGGS } from './easter-eggs';
import { EditorStateProvider, useEditorState, type EditorTab } from './EditorState.component';
import { EditorTabBar } from './EditorTabBar.component';
import { LivePreview } from './LivePreview.component';
import { MatrixRain } from './MatrixRain.component';
import { Minimap } from './Minimap.component';
import { BottomPanel } from './panel/BottomPanel.component';
import { ReleaseToast } from './ReleaseToast.component';
import { Sash } from './Sash.component';
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
import { PANEL_SIZE, SIDEBAR_SIZE, useEditorLayout, type EditorLayout } from './useEditorLayout';
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

function TabContent({ snapshot, now }: EditorProps): ReactNode {
  const { tab } = useEditorState();
  if (tab === null) return <EmptyEditor />;
  if (tab === 'page.tsx') return <PageTsx />;
  if (tab === 'journey.md') return <JourneyMd />;
  if (tab === 'settings.json') return <SettingsJson />;
  if (tab === '.env') return <EnvFile />;
  return <GitGraph snapshot={snapshot} now={now} />;
}

const SHORTCUTS: [string, string][] = [
  ['Search pages, apps and repos', '⌘ K'],
  ['Toggle Primary Side Bar', '⌘ B'],
  ['Toggle Panel', '⌘ J'],
  ['Open a file', 'Explorer'],
];

function EmptyEditor(): ReactNode {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 font-mono text-xs text-site-faint">
      <span aria-hidden="true" className="text-6xl font-extrabold text-site-line">
        ~/p
      </span>
      <dl className="grid grid-cols-[auto_auto] gap-x-6 gap-y-2">
        {SHORTCUTS.map(([action, keys]) => (
          <div key={action} className="contents">
            <dt className="text-right">{action}</dt>
            <dd className="text-site-dim">{keys}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Sidebar({ snapshot, now }: EditorProps): ReactNode {
  const { view, isMobileSidebarOpen, isSidebarOpen } = useEditorState();
  return (
    <aside
      aria-label="Sidebar"
      className={`${isMobileSidebarOpen ? 'block' : 'hidden'} ${isSidebarOpen ? 'md:block' : 'md:hidden'} max-h-72 shrink-0 overflow-y-auto border-b border-site-line bg-site-panel py-3 md:h-full md:max-h-none md:w-[var(--sidebar-width)] md:border-b-0 md:border-r`}
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
      {tab && <span className="hidden sm:inline">{TAB_LANGUAGES[tab]}</span>}
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

function Breadcrumbs(): ReactNode {
  const { tab } = useEditorState();
  if (!tab) return null;
  return (
    <div className="px-5 py-2 font-mono text-xs text-site-faint">
      src › app › {tab}
      {tab === 'page.tsx' && (
        <>
          {' › '}
          <span className="text-site-fn">developer</span>
        </>
      )}
    </div>
  );
}

function EditorArea({ snapshot, now, isHidden }: EditorProps & { isHidden: boolean }): ReactNode {
  const { tab, isPreviewOpen, isMatrixOn } = useEditorState();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPreviewVisible = isPreviewOpen && tab === 'page.tsx';
  return (
    <div className={`${isHidden ? 'md:hidden' : ''} flex h-[380px] min-h-0 md:h-auto md:flex-1`}>
      <div ref={scrollRef} className="relative min-w-0 grow overflow-auto pb-6 pt-1">
        <TabContent snapshot={snapshot} now={now} />
        {isMatrixOn && <MatrixRain />}
      </div>
      {isPreviewVisible && <LivePreview />}
      {tab && (
        <Minimap scrollRef={scrollRef} contentKey={tab}>
          <TabContent snapshot={snapshot} now={now} />
        </Minimap>
      )}
    </div>
  );
}

function EditorColumn({ snapshot, now, layout }: EditorProps & { layout: EditorLayout }): ReactNode {
  const { isPanelOpen, setPanelOpen } = useEditorState();
  const isMaximized = isPanelOpen && layout.isPanelMaximized;
  return (
    <div className="flex min-w-0 grow flex-col md:h-full">
      <div className="flex items-stretch border-b border-site-line bg-site-panel">
        <EditorTabBar />
        <RunButton />
      </div>
      {!isMaximized && <Breadcrumbs />}
      <EditorArea snapshot={snapshot} now={now} isHidden={isMaximized} />
      {!isMaximized && (
        <Sash
          label="Resize panel"
          orientation="horizontal"
          isReversed
          value={isPanelOpen ? layout.panelHeight : 0}
          min={PANEL_SIZE.min}
          max={PANEL_SIZE.max}
          onResize={layout.resizePanel}
          onCollapse={() => setPanelOpen(false)}
          onReset={() => layout.resizePanel(PANEL_SIZE.initial)}
        />
      )}
      {isPanelOpen && <BottomPanel snapshot={snapshot} isMaximized={isMaximized} onToggleMaximize={() => layout.setPanelMaximized(!layout.isPanelMaximized)} />}
    </div>
  );
}

function EditorWindow({ snapshot, now }: EditorProps): ReactNode {
  const { tab, isSidebarOpen, setSidebarOpen } = useEditorState();
  const layout = useEditorLayout();
  useSiteEasterEggs();
  const sizes = { '--sidebar-width': `${layout.sidebarWidth}px`, '--panel-height': `${layout.panelHeight}px` } as CSSProperties;
  return (
    <section
      aria-label="Code editor"
      tabIndex={-1}
      onKeyDown={layout.handleShortcut}
      className="tile overflow-clip outline-none rounded-[14px] shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]"
      style={{ animationDelay: '1.1s', ...sizes }}
    >
      <div className="flex items-center gap-2 border-b border-site-line bg-site-panel px-3.5 py-2.5">
        <span className="h-[11px] w-[11px] rounded-full bg-site-mac-red" />
        <span className="h-[11px] w-[11px] rounded-full bg-site-mac-yellow" />
        <span className="h-[11px] w-[11px] rounded-full bg-site-mac-green" />
        <span className="grow text-center font-mono text-xs text-site-dim">pladsen.dev{tab && ` — ${tab}`}</span>
      </div>
      <div className="flex min-w-0 flex-col md:h-[600px] md:flex-row">
        <ActivityBar extensionCount={EXTENSION_COUNT} />
        <Sidebar snapshot={snapshot} now={now} />
        <Sash
          label="Resize side bar"
          orientation="vertical"
          value={isSidebarOpen ? layout.sidebarWidth : 0}
          min={SIDEBAR_SIZE.min}
          max={SIDEBAR_SIZE.max}
          onResize={layout.resizeSidebar}
          onCollapse={() => setSidebarOpen(false)}
          onReset={() => layout.resizeSidebar(SIDEBAR_SIZE.initial)}
        />
        <EditorColumn snapshot={snapshot} now={now} layout={layout} />
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
