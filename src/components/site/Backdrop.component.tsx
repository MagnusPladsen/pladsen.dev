'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useSiteContent } from './SiteContentProvider.component';

export function Backdrop(): ReactNode {
  const { theme } = useSiteContent();
  const [spotlight, setSpotlight] = useState({ x: 640, y: 320 });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => setSpotlight({ x: event.pageX, y: event.pageY });
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {theme === 'CRT' && <div className="crt-scanlines" />}
      <div
        className="absolute -left-40 -top-52 h-[560px] w-[560px] rounded-full bg-site-accent blur-[110px]"
        style={{ opacity: 'var(--blob)', animation: 'drift1 20s ease-in-out infinite' }}
      />
      <div
        className="absolute -right-40 top-[520px] h-[520px] w-[520px] rounded-full bg-site-indigo blur-[110px]"
        style={{ opacity: 'var(--blob)', animation: 'drift2 24s ease-in-out infinite' }}
      />
      <div
        className="absolute h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ left: spotlight.x, top: spotlight.y, background: 'radial-gradient(circle, var(--hover), transparent 65%)' }}
      />
    </div>
  );
}
