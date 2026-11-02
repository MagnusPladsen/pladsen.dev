import { useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';

const KEY_STEP = 20;

interface SashProps {
  label: string;
  orientation: 'vertical' | 'horizontal';
  value: number;
  min: number;
  max: number;
  isReversed?: boolean;
  onResize: (value: number) => void;
  onCollapse: () => void;
  onReset: () => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const KEY_DIRECTIONS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

export function Sash({ label, orientation, value, min, max, isReversed = false, onResize, onCollapse, onReset }: SashProps): ReactNode {
  const dragStart = useRef<{ pointer: number; value: number } | null>(null);
  const sign = isReversed ? -1 : 1;
  const getPointer = (event: PointerEvent) => (orientation === 'vertical' ? event.clientX : event.clientY);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { pointer: getPointer(event), value };
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!dragStart.current) return;
    const next = dragStart.current.value + (getPointer(event) - dragStart.current.pointer) * sign;
    if (next < min / 2) onCollapse();
    else onResize(clamp(next, min, max));
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const direction = KEY_DIRECTIONS[event.key];
    if (event.key === 'Home') onResize(min);
    else if (event.key === 'End') onResize(max);
    else if (direction) onResize(clamp(value + direction * sign * KEY_STEP, min, max));
    else return;
    event.preventDefault();
  };

  const shape = orientation === 'vertical' ? 'relative z-10 -mx-0.5 w-1 cursor-col-resize' : 'relative z-10 -my-0.5 h-1 cursor-row-resize';
  return (
    <div
      role="separator"
      aria-label={label}
      aria-orientation={orientation}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => (dragStart.current = null)}
      onDoubleClick={onReset}
      onKeyDown={handleKeyDown}
      className={`${shape} hidden shrink-0 touch-none outline-none transition-colors delay-150 duration-150 hover:bg-site-accent focus-visible:bg-site-accent md:block`}
    />
  );
}
