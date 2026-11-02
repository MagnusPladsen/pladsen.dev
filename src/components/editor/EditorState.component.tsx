'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { EASTER_EGG_COUNT, EASTER_EGGS, type EasterEggId } from './easter-eggs';
import type { TerminalLine } from './terminal-commands';

export const EDITOR_TABS = ['page.tsx', 'journey.md', 'settings.json', '.env', 'Git Graph'] as const;
export type EditorTab = (typeof EDITOR_TABS)[number];
export type SidebarView = 'explorer' | 'search' | 'scm' | 'extensions';
export type PanelTab = 'terminal' | 'problems' | 'output';

interface EditorStateValue {
  tab: EditorTab;
  setTab: (tab: EditorTab) => void;
  view: SidebarView;
  setView: (view: SidebarView) => void;
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (isOpen: boolean) => void;
  panel: PanelTab;
  setPanel: (panel: PanelTab) => void;
  selectedRepo: string | null;
  setSelectedRepo: (repo: string | null) => void;
  isPreviewOpen: boolean;
  setPreviewOpen: (isOpen: boolean) => void;
  terminalLines: TerminalLine[];
  print: (lines: TerminalLine[]) => void;
  clearTerminal: () => void;
  startRun: () => void;
  isMatrixOn: boolean;
  startMatrix: () => void;
  foundEggs: EasterEggId[];
  findEgg: (egg: EasterEggId) => void;
}

const MAX_TERMINAL_LINES = 40;
const COMPILE_DELAY_MS = 700;
const PREVIEW_DELAY_MS = 900;
const MATRIX_DURATION_MS = 5000;
const INITIAL_TERMINAL: TerminalLine[] = [
  { text: '$ bun run dev', tone: 'muted' },
  { text: '✓ Ready in 312ms', tone: 'success' },
  { text: "type 'help' for commands", tone: 'plain' },
];

const EGGS_KEY = 'pladsen.eggs';

function readFoundEggs(): EasterEggId[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(EGGS_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((egg): egg is EasterEggId => egg in EASTER_EGGS) : [];
  } catch {
    return [];
  }
}

function writeFoundEggs(eggs: EasterEggId[]): void {
  try {
    window.localStorage.setItem(EGGS_KEY, JSON.stringify(eggs));
  } catch {
    // Storage blocked (private mode); the count stays in memory.
  }
}

const EditorStateContext = createContext<EditorStateValue | null>(null);

export function EditorStateProvider({ children }: { children: ReactNode }): ReactNode {
  const [tab, setTab] = useState<EditorTab>('page.tsx');
  const [view, setView] = useState<SidebarView>('explorer');
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [panel, setPanel] = useState<PanelTab>('terminal');
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [isMatrixOn, setMatrixOn] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>(INITIAL_TERMINAL);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [foundEggs, setFoundEggs] = useState<EasterEggId[]>([]);
  const foundEggsRef = useRef(new Set<EasterEggId>());

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const print = useCallback((lines: TerminalLine[]) => setTerminalLines((current) => [...current, ...lines].slice(-MAX_TERMINAL_LINES)), []);

  useEffect(() => {
    readFoundEggs().forEach((egg) => foundEggsRef.current.add(egg));
    setFoundEggs([...foundEggsRef.current]);
  }, []);

  const findEgg = useCallback(
    (egg: EasterEggId) => {
      if (foundEggsRef.current.has(egg)) return;
      foundEggsRef.current.add(egg);
      const found = [...foundEggsRef.current];
      setFoundEggs(found);
      writeFoundEggs(found);
      print([{ text: `🥚 easter egg found: ${EASTER_EGGS[egg]} · ${found.length}/${EASTER_EGG_COUNT}`, tone: 'success' }]);
    },
    [print],
  );

  const startRun = useCallback(() => {
    setTab('page.tsx');
    setPanel('terminal');
    findEgg('run');
    print([
      { text: '$ bun run build', tone: 'plain' },
      { text: '▲ compiling src/app/page.tsx…', tone: 'muted' },
    ]);
    timers.current.push(
      setTimeout(() => print([{ text: '✓ compiled in 412ms · opening preview', tone: 'success' }]), COMPILE_DELAY_MS),
      setTimeout(() => setPreviewOpen(true), PREVIEW_DELAY_MS),
    );
  }, [print, findEgg]);

  const startMatrix = useCallback(() => {
    setMatrixOn(true);
    timers.current.push(setTimeout(() => setMatrixOn(false), MATRIX_DURATION_MS));
  }, []);

  const value = useMemo(
    () => ({
      tab, setTab, view, setView, isMobileSidebarOpen, setMobileSidebarOpen, panel, setPanel, selectedRepo, setSelectedRepo, isPreviewOpen, setPreviewOpen,
      terminalLines, print, clearTerminal: () => setTerminalLines([]), startRun, isMatrixOn, startMatrix, foundEggs, findEgg,
    }),
    [tab, view, isMobileSidebarOpen, panel, selectedRepo, isPreviewOpen, terminalLines, print, startRun, isMatrixOn, startMatrix, foundEggs, findEgg],
  );
  return <EditorStateContext.Provider value={value}>{children}</EditorStateContext.Provider>;
}

export function useEditorState(): EditorStateValue {
  const value = useContext(EditorStateContext);
  if (!value) throw new Error('useEditorState must be used inside EditorStateProvider');
  return value;
}
