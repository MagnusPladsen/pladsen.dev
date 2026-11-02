import type { ReactNode } from 'react';
import type { FeaturedApp } from '@/lib/site-content';

interface AppPreviewProps {
  app: FeaturedApp;
  name: string;
  className?: string;
}

export function AppPreview({ app, name, className = 'h-36' }: AppPreviewProps): ReactNode {
  return (
    <div className={`${className} px-3 pt-3`} style={{ background: app.tint }}>
      <div className="flex h-full flex-col overflow-hidden rounded-t-lg bg-site-bg">
        <div className="flex items-center gap-1 border-b border-site-line px-2 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-site-mac-red" />
          <span className="h-1.5 w-1.5 rounded-full bg-site-mac-yellow" />
          <span className="h-1.5 w-1.5 rounded-full bg-site-mac-green" />
          <span className="ml-2 truncate font-mono text-[9px] text-site-faint">{app.host}</span>
        </div>
        {app.screenshot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={app.screenshot} alt={`${name} screenshot`} className="min-h-0 w-full grow object-cover object-top" />
        ) : (
          <div className="grid grow place-items-center font-mono text-sm text-site-dim">{name}</div>
        )}
      </div>
    </div>
  );
}
