import { useEffect, useRef, useCallback } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { useSettingsStore } from '../store/settingsStore';
import { useGameStore } from '../store/gameStore';

export function useSessionTimer() {
  const rafRef = useRef<number>(0);
  const { sessionStartMs, sessionActive, setElapsedSec, endSession, dailyElapsedSec } = useSessionStore();
  const { settings } = useSettingsStore();
  const { setOverlay } = useGameStore();

  const sessionLimitSec = settings.sessionLimitMin * 60;
  const dailyLimitSec = settings.dailyLimitMin * 60;

  const tick = useCallback(() => {
    if (!sessionActive) return;
    const elapsed = Math.floor((Date.now() - sessionStartMs) / 1000);
    setElapsedSec(elapsed);

    // Check session limit
    if (elapsed >= sessionLimitSec) {
      endSession();
      setOverlay('session-end');
      return;
    }

    // Check daily limit
    if (dailyElapsedSec + elapsed >= dailyLimitSec) {
      endSession();
      setOverlay('session-end');
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [sessionActive, sessionStartMs, setElapsedSec, sessionLimitSec, dailyLimitSec, dailyElapsedSec, endSession, setOverlay]);

  useEffect(() => {
    if (sessionActive) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [sessionActive, tick]);
}
