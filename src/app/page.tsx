import { existsSync } from 'node:fs';
import path from 'node:path';
import type { ReactNode } from 'react';
import { FeaturedApps } from '@/components/home/FeaturedApps.component';
import { GitHubStats } from '@/components/home/GitHubStats.component';
import { Hero } from '@/components/home/Hero.component';
import { HomeFooter } from '@/components/home/HomeFooter.component';
import { LatestPushes } from '@/components/home/LatestPushes.component';
import { Backdrop } from '@/components/site/Backdrop.component';
import { Nav } from '@/components/site/Nav.component';
import { SiteContentProvider } from '@/components/site/SiteContentProvider.component';
import { fetchGitHubSnapshot } from '@/lib/github/fetch-snapshot';

export const revalidate = 3600;

export default async function Home(): Promise<ReactNode> {
  const snapshot = await fetchGitHubSnapshot();
  const now = new Date().toISOString();
  const isCvAvailable = existsSync(path.join(process.cwd(), 'public', 'cv.pdf'));

  return (
    <SiteContentProvider>
      <Backdrop />
      <div className="relative mx-auto w-full max-w-[1180px] px-4 pt-5 sm:px-6">
        <Nav />
        <Hero isCvAvailable={isCvAvailable} />
        <div data-testid="editor-slot" />
        <FeaturedApps />
        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <LatestPushes snapshot={snapshot} now={now} />
          <GitHubStats snapshot={snapshot} />
        </div>
        <HomeFooter deployedAt={process.env.BUILD_TIME ?? now} now={now} />
      </div>
    </SiteContentProvider>
  );
}
