import { useEffect, useRef } from 'react';

const KONAMI_SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export function useKonamiCode(onUnlock: () => void): void {
  const progress = useRef(0);
  const onUnlockRef = useRef(onUnlock);
  onUnlockRef.current = onUnlock;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      progress.current = key === KONAMI_SEQUENCE[progress.current] ? progress.current + 1 : key === KONAMI_SEQUENCE[0] ? 1 : 0;
      if (progress.current < KONAMI_SEQUENCE.length) return;
      progress.current = 0;
      onUnlockRef.current();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
