'use client';

import type { ReactNode } from 'react';
import { useSiteContent } from '@/components/site/SiteContentProvider.component';
import { useEditorState } from './EditorState.component';

export function LivePreview(): ReactNode {
  const { content } = useSiteContent();
  const { setPreviewOpen } = useEditorState();
  const { developer, ctas } = content;

  return (
    <section aria-label="Live preview" className="hidden w-[44%] min-w-0 shrink-0 flex-col border-l border-site-line bg-site-bg lg:flex" style={{ animation: 'slide .35s ease' }}>
      <div className="flex items-center gap-2 border-b border-site-line px-2.5 py-1.5 font-mono text-[11px] text-site-dim">
        <span className="grow rounded-md bg-site-hover px-2 py-0.5">localhost:3000</span>
        <button type="button" aria-label="Close preview" onClick={() => setPreviewOpen(false)} className="px-1.5 hover:text-site-fg">
          ✕
        </button>
      </div>
      <div className="overflow-auto px-5 py-6">
        <p className="font-mono text-[10px] text-site-dim">$ curl pladsen.dev/api/me</p>
        <p className="shine mt-2 text-[34px] font-extrabold leading-none tracking-tight">{developer.name}</p>
        <p className="mt-1.5 text-sm text-site-accent">{developer.role}</p>
        <p className="mt-2.5 text-xs leading-relaxed text-site-muted">{developer.tagline}</p>
        <div className="mt-3.5 flex gap-1.5 text-[11px]">
          <span className="rounded-lg bg-site-accent px-2.5 py-1.5 font-semibold text-site-ink">{ctas.primary} →</span>
          <span className="rounded-lg border border-site-tile-border px-2.5 py-1.5">{ctas.cv}</span>
        </div>
      </div>
    </section>
  );
}
