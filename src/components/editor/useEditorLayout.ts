import { useState, type KeyboardEvent } from 'react';
import { useEditorState } from './EditorState.component';

export const SIDEBAR_SIZE = { min: 170, max: 480, initial: 260 };
export const PANEL_SIZE = { min: 100, max: 480, initial: 190 };

export interface EditorLayout {
  sidebarWidth: number;
  resizeSidebar: (width: number) => void;
  panelHeight: number;
  resizePanel: (height: number) => void;
  isPanelMaximized: boolean;
  setPanelMaximized: (isMaximized: boolean) => void;
  handleShortcut: (event: KeyboardEvent) => void;
}

function isTogglePanelKey(event: KeyboardEvent): boolean {
  return (event.ctrlKey && event.key === '`') || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j');
}

export function useEditorLayout(): EditorLayout {
  const { isSidebarOpen, setSidebarOpen, isPanelOpen, setPanelOpen } = useEditorState();
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_SIZE.initial);
  const [panelHeight, setPanelHeight] = useState(PANEL_SIZE.initial);
  const [isPanelMaximized, setPanelMaximized] = useState(false);

  const handleShortcut = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'b') setSidebarOpen(!isSidebarOpen);
    else if (isTogglePanelKey(event)) setPanelOpen(!isPanelOpen);
    else return;
    event.preventDefault();
  };

  return {
    sidebarWidth,
    resizeSidebar: (width) => {
      setSidebarWidth(width);
      setSidebarOpen(true);
    },
    panelHeight,
    resizePanel: (height) => {
      setPanelHeight(height);
      setPanelMaximized(false);
      setPanelOpen(true);
    },
    isPanelMaximized,
    setPanelMaximized,
    handleShortcut,
  };
}
