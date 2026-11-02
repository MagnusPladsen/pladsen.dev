'use client';

import { useState, type ReactNode } from 'react';
import { formatRelative } from '@/lib/github/transform';
import type { Release } from '@/lib/github/types';

export function ReleaseToast({ release, now }: { release: Release | null; now: string }): ReactNode {
  const [isVisible, setIsVisible] = useState(true);
  if (!release || !isVisible) return null;

  return (
    <div role="status" className="absolute bottom-11 right-4 z-10 w-[min(340px,80%)] rounded-[10px] border border-site-tile-border bg-site-pop p-3.5 text-[13px] shadow-2xl" style={{ animation: 'toast-in .45s cubic-bezier(.2,.8,.2,1) 2.5s backwards' }}>
      <div className="flex items-start gap-2.5">
        <span aria-hidden="true" className="text-site-info">ⓘ</span>
        <span className="grow">
          <span className="font-semibold">{release.repo}</span>: {release.tag} released
          <span className="mt-0.5 block font-mono text-[11px] text-site-dim">Source: GitHub · {formatRelative(release.publishedAt, new Date(now))} ago</span>
        </span>
        <button type="button" aria-label="Dismiss notification" onClick={() => setIsVisible(false)} className="text-site-dim hover:text-site-fg">
          ✕
        </button>
      </div>
      <div className="mt-2.5 flex justify-end gap-2">
        <button type="button" onClick={() => setIsVisible(false)} className="rounded-md border border-site-tile-border px-2.5 py-1 text-xs text-site-muted hover:text-site-fg">
          Later
        </button>
        <a href={release.url} target="_blank" rel="noreferrer" onClick={() => setIsVisible(false)} className="rounded-md bg-site-accent px-3 py-1 text-xs font-semibold text-site-ink hover:opacity-90">
          View
        </a>
      </div>
    </div>
  );
}
