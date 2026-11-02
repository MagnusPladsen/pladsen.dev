import type { ReactNode } from 'react';

export function PanelHeading({ children }: { children: ReactNode }): ReactNode {
  return <h3 className="flex justify-between px-3.5 pb-2 pt-1 font-mono text-[11px] font-normal tracking-wider text-site-faint">{children}</h3>;
}

export const SIDEBAR_ROW =
  'flex w-full items-center gap-2 px-3.5 py-1 text-left font-mono text-[13px] text-site-muted transition-colors duration-150 hover:bg-site-hover hover:text-site-fg focus-visible:bg-site-hover focus-visible:text-site-fg';
