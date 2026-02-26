import { create } from 'zustand';
import type { SessionStats } from '../types';

const STORAGE_KEY = 'kubageo_stats';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadStats(): SessionStats[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SessionStats[];
  } catch {
    return [];
  }
}

function saveStats(stats: SessionStats[]) {
  // Keep only last 7 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const filtered = stats.filter((s) => s.date >= cutoffStr);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

interface SessionState {
  // Timer
  sessionStartMs: number;
  elapsedSec: number;
  setElapsedSec: (s: number) => void;
  sessionActive: boolean;
  startSession: () => void;
  endSession: () => void;

  // Micro-cycle tracking
  trialsSinceBreak: number;
  incrementTrials: () => void;
  resetTrialsSinceBreak: () => void;

  // Break state
  isOnBreak: boolean;
  setIsOnBreak: (v: boolean) => void;

  // Session ended flag
  sessionEnded: boolean;
  setSessionEnded: (v: boolean) => void;

  // Daily tracking
  dailyElapsedSec: number;
  loadDailyElapsed: () => void;

  // Stats persistence
  stats: SessionStats[];
  loadStats: () => void;
  saveTodayStats: (trials: number, correctByType: Record<string, { correct: number; total: number }>) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessionStartMs: Date.now(),
  elapsedSec: 0,
  setElapsedSec: (s) => set({ elapsedSec: s }),
  sessionActive: false,
  startSession: () => set({ sessionStartMs: Date.now(), sessionActive: true, sessionEnded: false, elapsedSec: 0, trialsSinceBreak: 0 }),
  endSession: () => set({ sessionActive: false, sessionEnded: true }),

  trialsSinceBreak: 0,
  incrementTrials: () => set((s) => ({ trialsSinceBreak: s.trialsSinceBreak + 1 })),
  resetTrialsSinceBreak: () => set({ trialsSinceBreak: 0 }),

  isOnBreak: false,
  setIsOnBreak: (v) => set({ isOnBreak: v }),

  sessionEnded: false,
  setSessionEnded: (v) => set({ sessionEnded: v }),

  dailyElapsedSec: 0,
  loadDailyElapsed: () => {
    const stats = loadStats();
    const today = stats.find((s) => s.date === todayKey());
    set({ dailyElapsedSec: today?.totalTimeSec ?? 0 });
  },

  stats: [],
  loadStats: () => set({ stats: loadStats() }),
  saveTodayStats: (trials, correctByType) => {
    const allStats = loadStats();
    const key = todayKey();
    const existing = allStats.find((s) => s.date === key);
    const elapsed = get().elapsedSec;

    if (existing) {
      existing.totalTimeSec += elapsed;
      existing.trials += trials;
      for (const [type, data] of Object.entries(correctByType)) {
        if (!existing.correctByType[type]) {
          existing.correctByType[type] = { correct: 0, total: 0 };
        }
        existing.correctByType[type].correct += data.correct;
        existing.correctByType[type].total += data.total;
      }
    } else {
      allStats.push({
        date: key,
        totalTimeSec: elapsed,
        trials,
        correctByType,
      });
    }
    saveStats(allStats);
    set({ stats: allStats, dailyElapsedSec: (existing?.totalTimeSec ?? 0) + elapsed });
  },
}));
