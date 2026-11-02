import { X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useEditorState, type EditorTab } from './EditorState.component';

interface EditorTabItemProps {
  label: EditorTab;
  isActive: boolean;
  onDragStart: () => void;
  onDrop: () => void;
}

function EditorTabItem({ label, isActive, onDragStart, onDrop }: EditorTabItemProps): ReactNode {
  const { setTab, closeTab } = useEditorState();
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
      onAuxClick={(event) => event.button === 1 && closeTab(label)}
      className={`group flex shrink-0 items-center border-r border-site-line transition-colors duration-150 ${
        isActive ? 'bg-site-hover text-site-fg shadow-[inset_0_2px_0_var(--site-accent)]' : 'text-site-dim hover:text-site-text2'
      }`}
    >
      <button type="button" role="tab" aria-selected={isActive} onClick={() => setTab(label)} className="whitespace-nowrap py-2.5 pl-4 pr-1.5 font-mono text-[13px] focus-visible:text-site-fg">
        {label}
      </button>
      <button
        type="button"
        aria-label={`Close ${label}`}
        title="Close"
        onClick={() => closeTab(label)}
        className={`mr-2 rounded p-0.5 transition-opacity duration-150 hover:bg-site-line focus-visible:opacity-100 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <X aria-hidden="true" size={14} />
      </button>
    </div>
  );
}

export function EditorTabBar(): ReactNode {
  const { tab, openTabs, moveTab } = useEditorState();
  const [dragged, setDragged] = useState<EditorTab | null>(null);
  return (
    <div role="tablist" aria-label="Open files" className="flex grow overflow-x-auto [scrollbar-width:none]">
      {openTabs.map((label) => (
        <EditorTabItem
          key={label}
          label={label}
          isActive={label === tab}
          onDragStart={() => setDragged(label)}
          onDrop={() => {
            if (dragged && dragged !== label) moveTab(dragged, label);
            setDragged(null);
          }}
        />
      ))}
    </div>
  );
}
