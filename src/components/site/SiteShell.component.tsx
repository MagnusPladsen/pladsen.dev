import type { ReactNode } from 'react';
import { HomeFooter } from '@/components/home/HomeFooter.component';
import { Backdrop } from './Backdrop.component';
import { Nav } from './Nav.component';
import { SiteContentProvider } from './SiteContentProvider.component';

export function SiteShell({ now, children }: { now: string; children: ReactNode }): ReactNode {
  return (
    <SiteContentProvider>
      <Backdrop />
      <div className="relative mx-auto w-full max-w-[1180px] px-4 pt-5 sm:px-6">
        <Nav />
        {children}
        <HomeFooter deployedAt={process.env.BUILD_TIME ?? now} now={now} />
      </div>
    </SiteContentProvider>
  );
}
