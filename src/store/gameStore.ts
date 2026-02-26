import { create } from 'zustand';
import type { Entity, GameMode, OverlayType, QuizDifficulty, QuizQuestion, QuizResult, QuizTopic } from '../types';

interface GameState {
  // Mode
  mode: GameMode;
  setMode: (m: GameMode) => void;

  // Active topic (for quiz)
  activeTopic: QuizTopic;
  setActiveTopic: (t: QuizTopic) => void;

  // Selected country on map
  selectedCountry: string | null;
  setSelectedCountry: (name: string | null) => void;

  // Overlay
  overlay: OverlayType;
  setOverlay: (o: OverlayType) => void;

  // Quiz state
  currentQuestion: QuizQuestion | null;
  setCurrentQuestion: (q: QuizQuestion | null) => void;
  quizResults: QuizResult[];
  addQuizResult: (r: QuizResult) => void;

  // Adaptive difficulty (age 5-6: start at 2 options, go up to 4)
  difficulty: QuizDifficulty;
  setDifficulty: (d: QuizDifficulty) => void;

  // Spaced repetition light: track wrong answers
  wrongIds: Set<string>;
  addWrongId: (id: string) => void;
  removeWrongId: (id: string) => void;

  // Entity detail overlay
  selectedEntity: Entity | null;
  setSelectedEntity: (e: Entity | null) => void;

  // GeoJSON loaded
  geoJsonLoaded: boolean;
  setGeoJsonLoaded: (v: boolean) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  mode: 'explore',
  setMode: (m) => set({ mode: m }),

  activeTopic: 'cars_geo',
  setActiveTopic: (t) => set({ activeTopic: t }),

  selectedCountry: null,
  setSelectedCountry: (name) => set({ selectedCountry: name }),

  overlay: 'none',
  setOverlay: (o) => set({ overlay: o }),

  currentQuestion: null,
  setCurrentQuestion: (q) => set({ currentQuestion: q }),
  quizResults: [],
  addQuizResult: (r) => set((s) => ({ quizResults: [...s.quizResults, r] })),

  difficulty: 2, // Start with 2 options for 5-6 year olds
  setDifficulty: (d) => set({ difficulty: d }),

  wrongIds: new Set(),
  addWrongId: (id) => set((s) => {
    const next = new Set(s.wrongIds);
    next.add(id);
    return { wrongIds: next };
  }),
  removeWrongId: (id) => set((s) => {
    const next = new Set(s.wrongIds);
    next.delete(id);
    return { wrongIds: next };
  }),

  selectedEntity: null,
  setSelectedEntity: (e) => set({ selectedEntity: e }),

  geoJsonLoaded: false,
  setGeoJsonLoaded: (v) => set({ geoJsonLoaded: v }),
}));
