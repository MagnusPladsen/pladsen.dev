import type { ReactNode } from 'react';
import type { FeaturedApp } from '@/lib/site-content';

interface AppPreviewProps {
  app: FeaturedApp;
  name: string;
  className?: string;
}

export function AppPreview({ app, name, className = 'h-40' }: AppPreviewProps): ReactNode {
  return (
    <div className="px-3.5 pt-3.5" style={{ background: `radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, ${app.tint} 16%, transparent), transparent 70%)` }}>
      <div data-testid="app-window" className={`${className} flex flex-col overflow-hidden rounded-t-[9px] border border-b-0 border-site-tile-border`}>
        <div className="flex items-center gap-1.5 border-b border-site-line bg-site-panel px-2.5 py-1.5">
          <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-site-faint" />
          <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-site-faint" />
          <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-site-faint" />
          <span className="ml-2 grow truncate rounded-[5px] bg-site-bg px-2 py-0.5 text-center font-mono text-[10px] text-site-dim">{app.host}</span>
        </div>
        {app.screenshot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={app.screenshot} alt={`${name} screenshot`} className="min-h-0 w-full grow object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="grid grow place-items-center bg-site-bg font-mono text-sm text-site-dim">{name}</div>
        )}
      </div>
    </div>
  );
}
