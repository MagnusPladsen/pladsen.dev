'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export const EDITOR_TABS = ['page.tsx', 'journey.md', 'settings.json', '.env', 'Git Graph'] as const;
export type EditorTab = (typeof EDITOR_TABS)[number];
export type SidebarView = 'explorer' | 'search' | 'scm' | 'extensions';
export type PanelTab = 'terminal' | 'problems' | 'output';

interface EditorStateValue {
  tab: EditorTab;
  setTab: (tab: EditorTab) => void;
  view: SidebarView;
  setView: (view: SidebarView) => void;
  panel: PanelTab;
  setPanel: (panel: PanelTab) => void;
  selectedRepo: string | null;
  setSelectedRepo: (repo: string | null) => void;
  isPreviewOpen: boolean;
  setPreviewOpen: (isOpen: boolean) => void;
}

const EditorStateContext = createContext<EditorStateValue | null>(null);

export function EditorStateProvider({ children }: { children: ReactNode }): ReactNode {
  const [tab, setTab] = useState<EditorTab>('page.tsx');
  const [view, setView] = useState<SidebarView>('explorer');
  const [panel, setPanel] = useState<PanelTab>('terminal');
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [isPreviewOpen, setPreviewOpen] = useState(false);

  const value = useMemo(
    () => ({ tab, setTab, view, setView, panel, setPanel, selectedRepo, setSelectedRepo, isPreviewOpen, setPreviewOpen }),
    [tab, view, panel, selectedRepo, isPreviewOpen],
  );
  return <EditorStateContext.Provider value={value}>{children}</EditorStateContext.Provider>;
}

export function useEditorState(): EditorStateValue {
  const value = useContext(EditorStateContext);
  if (!value) throw new Error('useEditorState must be used inside EditorStateProvider');
  return value;
}
