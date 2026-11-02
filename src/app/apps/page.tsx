import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppGallery } from '@/components/apps/AppGallery.component';
import { SiteShell } from '@/components/site/SiteShell.component';

export const metadata: Metadata = { title: 'Apps · Magnus Pladsen' };

export default function AppsPage(): ReactNode {
  return (
    <SiteShell now={new Date().toISOString()}>
      <AppGallery />
    </SiteShell>
  );
}
