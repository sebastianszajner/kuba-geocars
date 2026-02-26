import { create } from 'zustand';
import type { GameMode, PackId, ParentSettings, QuizTopic } from '../types';

const STORAGE_KEY = 'kubageo_settings';

const DEFAULT_SETTINGS: ParentSettings = {
  pin: '1234',
  sessionLimitMin: 12,
  dailyLimitMin: 25,
  enabledModes: ['explore', 'quiz-brand', 'quiz-flag', 'quiz-direction', 'quiz-food', 'quiz-category'],
  enabledPacks: ['geo', 'cars', 'rc', 'lego', 'hotwheels', 'toys', 'food'],
  activeTopic: 'cars_geo',
  microTrialsBeforeBreak: 8,
  breakDurationSec: 25,
};

function load(): ParentSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

interface SettingsState {
  settings: ParentSettings;
  loadSettings: () => void;
  updateSettings: (partial: Partial<ParentSettings>) => void;
  isModeEnabled: (mode: GameMode) => boolean;
  isPackEnabled: (pack: PackId) => boolean;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: load(),
  loadSettings: () => set({ settings: load() }),
  updateSettings: (partial) => {
    const updated = { ...get().settings, ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ settings: updated });
  },
  isModeEnabled: (mode) => get().settings.enabledModes.includes(mode),
  isPackEnabled: (pack) => get().settings.enabledPacks.includes(pack),
}));
