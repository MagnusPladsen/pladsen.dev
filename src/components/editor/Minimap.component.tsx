import type { ReactNode } from 'react';

const LINE_WIDTHS = [70, 0, 82, 40, 55, 64, 90, 96, 72, 30, 0, 60, 50, 20, 0, 75, 44, 66, 30, 0, 58, 80, 36, 50, 0, 64, 42, 70, 28, 52];
const LINE_COLORS = ['bg-site-kw', 'bg-site-str', 'bg-site-fn', 'bg-site-muted', 'bg-site-com'];

export function Minimap(): ReactNode {
  return (
    <div aria-hidden="true" className="relative hidden w-16 shrink-0 flex-col gap-[3px] overflow-hidden border-l border-site-line p-2 lg:flex">
      {LINE_WIDTHS.map((width, index) => (
        <span
          key={`minimap-${index}-${width}`}
          className={`h-0.5 rounded-sm opacity-55 ${width ? LINE_COLORS[index % LINE_COLORS.length] : ''}`}
          style={{ width: `${width}%`, marginLeft: index % 4 === 1 ? '10%' : 0 }}
        />
      ))}
      <span className="absolute inset-x-0 h-[30%] border-y border-site-tile-border bg-site-hover" style={{ animation: 'viewport 10s ease-in-out infinite' }} />
    </div>
  );
}
