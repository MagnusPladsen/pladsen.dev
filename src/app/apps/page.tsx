import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppGallery } from '@/components/apps/AppGallery.component';
import { SiteShell } from '@/components/site/SiteShell.component';
import { fetchGitHubSnapshot } from '@/lib/github/fetch-snapshot';

export const revalidate = 3600;

export const metadata: Metadata = { title: 'Apps · Magnus Pladsen' };

export default async function AppsPage(): Promise<ReactNode> {
  const snapshot = await fetchGitHubSnapshot();
  return (
    <SiteShell now={new Date().toISOString()} repos={snapshot.repos}>
      <AppGallery />
    </SiteShell>
  );
}
