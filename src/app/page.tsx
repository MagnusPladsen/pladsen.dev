import type { ReactNode } from 'react';
import { Editor } from '@/components/editor/Editor.component';
import { FeaturedApps } from '@/components/home/FeaturedApps.component';
import { GitHubStats } from '@/components/home/GitHubStats.component';
import { Hero } from '@/components/home/Hero.component';
import { LatestPushes } from '@/components/home/LatestPushes.component';
import { SiteShell } from '@/components/site/SiteShell.component';
import { isCvAvailable } from '@/lib/cv';
import { fetchGitHubSnapshot } from '@/lib/github/fetch-snapshot';

export const revalidate = 3600;

export default async function Home(): Promise<ReactNode> {
  const snapshot = await fetchGitHubSnapshot();
  const now = new Date().toISOString();

  return (
    <SiteShell now={now}>
      <Hero isCvAvailable={isCvAvailable()} />
      <Editor snapshot={snapshot} now={now} />
      <FeaturedApps />
      <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <LatestPushes snapshot={snapshot} now={now} />
        <GitHubStats snapshot={snapshot} />
      </div>
    </SiteShell>
  );
}
