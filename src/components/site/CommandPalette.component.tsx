'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, type KeyboardEvent, type ReactNode } from 'react';
import { fuzzyMatch } from '@/lib/fuzzy';
import type { PaletteItem } from './palette-items';

const MAX_RESULTS = 12;
const LISTBOX_ID = 'command-palette-results';

interface CommandPaletteProps {
  items: PaletteItem[];
  onClose: () => void;
}

export function CommandPalette({ items, onClose }: CommandPaletteProps): ReactNode {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const results = useMemo(() => items.filter((item) => fuzzyMatch(item.label, query)).slice(0, MAX_RESULTS), [items, query]);

  const openItem = (item: PaletteItem) => {
    onClose();
    if (item.isExternal) window.open(item.href, '_blank', 'noopener,noreferrer');
    else router.push(item.href);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') onClose();
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((current) => (current + step + results.length) % Math.max(results.length, 1));
    }
    if (event.key === 'Enter' && results[activeIndex]) openItem(results[activeIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-site-tile-border bg-site-pop shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)]"
      >
        <div className="flex items-center gap-2 border-b border-site-line px-4">
          <span aria-hidden="true" className="font-mono text-site-ok">➜</span>
          <input
            autoFocus
            role="combobox"
            aria-label="Search pages, apps and repos"
            aria-expanded="true"
            aria-controls={LISTBOX_ID}
            aria-activedescendant={results[activeIndex] ? `palette-${results[activeIndex].id}` : undefined}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="fuzzy search… try “gmdv”"
            spellCheck={false}
            className="grow bg-transparent py-3.5 font-mono text-sm text-site-fg outline-none placeholder:text-site-faint"
          />
          <kbd className="rounded border border-site-tile-border px-1.5 font-mono text-[10px] text-site-dim">esc</kbd>
        </div>
        {results.length === 0 ? (
          <p className="px-4 py-6 font-mono text-sm text-site-faint">nothing matches “{query}”</p>
        ) : (
          <ul id={LISTBOX_ID} role="listbox" aria-label="Results" className="max-h-[50vh] overflow-y-auto py-2">
            {results.map((item, index) => (
              <li
                key={item.id}
                id={`palette-${item.id}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => openItem(item)}
                className={`mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm ${index === activeIndex ? 'bg-site-hover text-site-fg' : 'text-site-text2'}`}
              >
                <span className="w-12 shrink-0 font-mono text-[10px] uppercase text-site-faint">{item.group}</span>
                <span className="grow truncate">{item.label}</span>
                <span className="truncate font-mono text-[11px] text-site-dim">{item.hint}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
