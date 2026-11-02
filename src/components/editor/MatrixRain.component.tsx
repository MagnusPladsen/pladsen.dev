'use client';

import { useMemo, type ReactNode } from 'react';

const COLUMN_COUNT = 28;
const COLUMN_LENGTH = 22;
const GLYPHS = 'アカサタナハマヤラワ0123456789ABCDEF<>/{}$#';

function getRandomColumn(): string {
  return Array.from({ length: COLUMN_LENGTH }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join('\n');
}

export function MatrixRain(): ReactNode {
  const columns = useMemo(
    () => Array.from({ length: COLUMN_COUNT }, (_, index) => ({ id: index, glyphs: getRandomColumn(), delay: Math.random() * 1.5, duration: 2 + Math.random() * 2 })),
    [],
  );
  return (
    <div data-testid="matrix-rain" aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 flex justify-between overflow-hidden bg-black/80 font-mono text-xs leading-4 text-site-ok">
      {columns.map((column) => (
        <span key={column.id} className="whitespace-pre" style={{ animation: `matrix-fall ${column.duration}s linear ${column.delay}s infinite`, transform: 'translateY(-100%)' }}>
          {column.glyphs}
        </span>
      ))}
    </div>
  );
}
