import { useEffect, useRef, useCallback } from 'react';
import { useSessionStore } from '../store/sessionStore';

export function useSessionTimer() {
  const rafRef = useRef<number>(0);
  const { sessionStartMs, sessionActive, setElapsedSec } = useSessionStore();

  const tick = useCallback(() => {
    if (!sessionActive) return;
    const elapsed = Math.floor((Date.now() - sessionStartMs) / 1000);
    setElapsedSec(elapsed);

    // Timer counts but never auto-blocks — parent decides when to stop
    rafRef.current = requestAnimationFrame(tick);
  }, [sessionActive, sessionStartMs, setElapsedSec]);

  useEffect(() => {
    if (sessionActive) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [sessionActive, tick]);
}
