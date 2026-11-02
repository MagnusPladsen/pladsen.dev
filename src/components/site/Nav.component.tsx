'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from 'react';
import type { Repo } from '@/lib/github/types';
import { CommandPalette } from './CommandPalette.component';
import { getPaletteItems } from './palette-items';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/apps', label: 'Apps' },
  { href: '/repos', label: 'Repos' },
];

export function Nav({ repos = [] }: { repos?: Repo[] }): ReactNode {
  const pathname = usePathname();
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const paletteItems = useMemo(() => getPaletteItems(repos), [repos]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((isOpen) => !isOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBarClick = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('a, button')) return;
    setPaletteOpen(true);
  };

  return (
    <>
      <header onClick={handleBarClick} className="tile flex cursor-pointer flex-wrap items-center gap-4 rounded-full py-2.5 pl-5 pr-3 text-sm sm:gap-6">
        <Link href="/" className="font-mono font-medium">
          ~/pladsen<span className="text-site-accent">.dev</span>
        </Link>
        <span className="grow" />
        <nav aria-label="Main" className="flex gap-4 sm:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.href === pathname ? 'page' : undefined}
              className="text-site-muted transition-colors duration-150 hover:text-site-fg focus-visible:text-site-fg aria-[current=page]:text-site-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Search (⌘K)"
          onClick={() => setPaletteOpen(true)}
          className="rounded-full border border-site-tile-border px-3 py-1 font-mono text-xs text-site-muted transition-colors duration-150 hover:text-site-fg focus-visible:text-site-fg"
        >
          ⌘K
        </button>
      </header>
      {isPaletteOpen && <CommandPalette items={paletteItems} onClose={() => setPaletteOpen(false)} />}
    </>
  );
}
