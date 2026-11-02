import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { RepoBrowser } from '@/components/repos/RepoBrowser.component';
import { SiteShell } from '@/components/site/SiteShell.component';
import { fetchGitHubSnapshot } from '@/lib/github/fetch-snapshot';

export const revalidate = 3600;

export const metadata: Metadata = { title: 'Repos · Magnus Pladsen' };

export default async function ReposPage(): Promise<ReactNode> {
  const snapshot = await fetchGitHubSnapshot();
  const now = new Date().toISOString();
  return (
    <SiteShell now={now}>
      <RepoBrowser repos={snapshot.repos} now={now} />
    </SiteShell>
  );
}
