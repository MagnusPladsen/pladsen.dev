'use client';

import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useSiteContent } from '@/components/site/SiteContentProvider.component';
import { FEATURED_APPS } from '@/lib/site-content';
import { AppPreview } from './AppPreview.component';

const LINK_CLASS = 'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs transition-opacity duration-150 hover:opacity-80';

export function AppGallery(): ReactNode {
  const { content } = useSiteContent();
  return (
    <section aria-labelledby="apps-title" className="mt-10">
      <h1 id="apps-title" className="text-3xl font-semibold tracking-tight">
        Apps <span className="font-mono text-base text-site-dim">{FEATURED_APPS.length} live</span>
      </h1>
      <p className="mt-2 text-sm text-site-muted">Things I&apos;ve built and shipped. Everything else lives in the repos.</p>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {FEATURED_APPS.map((app, index) => {
          const { name, desc } = content.featured[index];
          return (
            <article key={app.url} className="tile flex flex-col overflow-hidden rounded-2xl">
              <AppPreview app={app} name={name} className="h-64" />
              <div className="flex grow flex-col gap-2 p-5">
                <h2 className="text-lg font-semibold">{name}</h2>
                {desc && <p className="text-sm text-site-muted">{desc}</p>}
                <p className="font-mono text-[11px] text-site-dim">{app.host}</p>
                <div className="mt-auto flex gap-2 pt-2">
                  <a href={app.url} target="_blank" rel="noreferrer" className={`${LINK_CLASS} bg-site-accent text-site-ink`}>
                    <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                    Open app
                  </a>
                  <a href={app.repo} target="_blank" rel="noreferrer" className={`${LINK_CLASS} border border-site-tile-border text-site-fg`}>
                    <Github aria-hidden="true" className="h-3.5 w-3.5" />
                    Source
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <Link href="/repos" className="mt-8 inline-block text-sm text-site-accent hover:underline">
        {content.copy.browseRepos} →
      </Link>
    </section>
  );
}
