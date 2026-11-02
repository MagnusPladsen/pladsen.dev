'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useSiteContent } from '@/components/site/SiteContentProvider.component';
import { AppPreview } from '@/components/apps/AppPreview.component';
import { FEATURED_APPS } from '@/lib/site-content';

export function FeaturedApps(): ReactNode {
  const { content } = useSiteContent();

  return (
    <section aria-labelledby="featured-title" className="mt-14">
      <div className="mb-3.5 flex items-baseline justify-between">
        <h2 id="featured-title" className="section-label">
          {'// '}
          {content.copy.featuredTitle}
        </h2>
        <Link href="/apps" className="text-sm text-site-accent hover:underline">
          {content.copy.allApps} →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED_APPS.map((app, index) => {
          const { name, desc } = content.featured[index];
          return (
            <a key={app.url} href={app.url} target="_blank" rel="noreferrer" className="group tile flex flex-col overflow-hidden" style={{ animationDelay: `${0.1 + index * 0.07}s` }}>
              <AppPreview app={app} name={name} />
              <div className="flex grow flex-col gap-1.5 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{name}</h3>
                  <span className="flex items-center gap-1.5 font-mono text-[11px] text-site-ok">
                    <span className="live-dot" />
                    live
                  </span>
                </div>
                {desc && (
                  <p data-testid="app-desc" className="grow text-[13px] text-site-muted">
                    {desc}
                  </p>
                )}
                <p className="mt-auto font-mono text-[11px] text-site-dim">{app.host}</p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
