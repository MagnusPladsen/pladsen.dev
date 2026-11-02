'use client';

import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { useSiteContent } from '@/components/site/SiteContentProvider.component';
import { FEATURED_APPS, MORE_APPS, type ListedApp } from '@/lib/site-content';
import { AppPreview } from './AppPreview.component';

type AppFilter = 'all' | 'live' | 'discontinued';

const FILTERS: { id: AppFilter; label: string; matches: (app: ListedApp) => boolean }[] = [
  { id: 'all', label: 'All', matches: () => true },
  { id: 'live', label: 'Live', matches: (app) => !app.isDiscontinued },
  { id: 'discontinued', label: 'Discontinued', matches: (app) => app.isDiscontinued },
];

const LINK_CLASS = 'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs transition-opacity duration-150 hover:opacity-80';

function AppStatus({ isDiscontinued }: { isDiscontinued: boolean }): ReactNode {
  if (isDiscontinued) return <span className="rounded-full border border-site-tile-border px-2 font-mono text-[11px] text-site-muted">discontinued</span>;
  return (
    <span className="flex items-center gap-1.5 font-mono text-[11px] text-site-ok">
      <span className="live-dot" />
      live
    </span>
  );
}

function AppCard({ app }: { app: ListedApp }): ReactNode {
  return (
    <article className={`group tile flex flex-col overflow-hidden rounded-2xl ${app.isDiscontinued ? 'opacity-70 grayscale' : ''}`}>
      <AppPreview app={app} name={app.name} className="h-56" />
      <div className="flex grow flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{app.name}</h2>
          <AppStatus isDiscontinued={app.isDiscontinued} />
        </div>
        {app.desc && <p className="text-sm text-site-muted">{app.desc}</p>}
        <p className="font-mono text-[11px] text-site-dim">{app.host}</p>
        <div className="mt-auto flex gap-2 pt-2">
          {!app.isDiscontinued && (
            <a href={app.url} target="_blank" rel="noreferrer" className={`${LINK_CLASS} bg-site-accent text-site-ink`}>
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
              Open app
            </a>
          )}
          <a href={app.repo} target="_blank" rel="noreferrer" className={`${LINK_CLASS} border border-site-tile-border text-site-fg`}>
            <Github aria-hidden="true" className="h-3.5 w-3.5" />
            Source
          </a>
        </div>
      </div>
    </article>
  );
}

export function AppGallery(): ReactNode {
  const { content } = useSiteContent();
  const [filter, setFilter] = useState<AppFilter>('all');
  const featured: ListedApp[] = FEATURED_APPS.map((app, index) => ({ ...app, ...content.featured[index], isDiscontinued: false }));
  const apps = [...featured, ...MORE_APPS];
  const liveCount = apps.filter((app) => !app.isDiscontinued).length;
  const visible = apps.filter(FILTERS.find((option) => option.id === filter)!.matches);

  return (
    <section aria-labelledby="apps-title" className="mt-10">
      <h1 id="apps-title" className="text-3xl font-semibold tracking-tight">
        Apps <span className="font-mono text-base text-site-dim">{liveCount} live</span>
      </h1>
      <p className="mt-2 text-sm text-site-muted">Things I&apos;ve built and shipped, and a few that have been retired. Everything else lives in the repos.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((option) => {
          const isActive = option.id === filter;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setFilter(option.id)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-150 ${isActive ? 'border-site-fg bg-site-fg text-site-bg' : 'border-site-tile-border text-site-muted hover:text-site-fg'}`}
            >
              {option.label} <span className="opacity-60">{apps.filter(option.matches).length}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((app) => (
          <AppCard key={app.url} app={app} />
        ))}
      </div>
      <Link href="/repos" className="mt-8 inline-block text-sm text-site-accent hover:underline">
        {content.copy.browseRepos} →
      </Link>
    </section>
  );
}
