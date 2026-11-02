'use client';

import { useEffect, useState, type PointerEvent, type ReactNode, type RefObject } from 'react';
import { useMediaQuery } from '@/lib/useMediaQuery';

const SCALE = 0.125;
const WIDTH = 80;

interface ScrollMetrics {
  top: number;
  height: number;
  viewport: number;
}

function useScrollMetrics(scrollRef: RefObject<HTMLDivElement | null>, contentKey: string): ScrollMetrics {
  const [metrics, setMetrics] = useState<ScrollMetrics>({ top: 0, height: 0, viewport: 0 });
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const update = () => setMetrics({ top: scroller.scrollTop, height: scroller.scrollHeight, viewport: scroller.clientHeight });
    update();
    scroller.addEventListener('scroll', update, { passive: true });
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(update) : null;
    observer?.observe(scroller);
    if (scroller.firstElementChild) observer?.observe(scroller.firstElementChild);
    return () => {
      scroller.removeEventListener('scroll', update);
      observer?.disconnect();
    };
  }, [scrollRef, contentKey]);
  return metrics;
}

interface MinimapProps {
  scrollRef: RefObject<HTMLDivElement | null>;
  contentKey: string;
  children: ReactNode;
}

export function Minimap({ scrollRef, contentKey, children }: MinimapProps): ReactNode {
  const isWide = useMediaQuery('(min-width: 1024px)');
  const { top, height, viewport } = useScrollMetrics(scrollRef, contentKey);
  const overflow = Math.max(0, height * SCALE - viewport);
  const progress = height > viewport ? top / (height - viewport) : 0;
  const offset = overflow * progress;

  const scrollToPointer = (event: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollRef.current;
    if (!scroller || (event.type === 'pointermove' && event.buttons !== 1)) return;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().top;
    scroller.scrollTop = (y + offset) / SCALE - viewport / 2;
  };

  if (!isWide) return null;
  return (
    <div
      aria-hidden="true"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        scrollToPointer(event);
      }}
      onPointerMove={scrollToPointer}
      className="group relative shrink-0 cursor-default touch-none overflow-hidden border-l border-site-line"
      style={{ width: WIDTH }}
    >
      <div inert className="pointer-events-none origin-top-left select-none opacity-80" style={{ width: WIDTH / SCALE, transform: `translateY(${-offset}px) scale(${SCALE})` }}>
        {children}
      </div>
      {height > viewport && (
        <span
          className="absolute inset-x-0 bg-site-tile-border opacity-50 transition-opacity duration-150 group-hover:opacity-90"
          style={{ top: top * SCALE - offset, height: viewport * SCALE }}
        />
      )}
    </div>
  );
}
