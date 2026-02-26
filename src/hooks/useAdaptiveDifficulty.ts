import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import type { QuizDifficulty } from '../types';

const WINDOW_SIZE = 8;
const TARGET_LOW = 0.70;
const TARGET_HIGH = 0.85;

export function useAdaptiveDifficulty() {
  const { quizResults, difficulty, setDifficulty } = useGameStore();

  useEffect(() => {
    if (quizResults.length < WINDOW_SIZE) return;

    const recent = quizResults.slice(-WINDOW_SIZE);
    const correctCount = recent.filter((r) => r.correct).length;
    const rate = correctCount / WINDOW_SIZE;

    let next: QuizDifficulty = difficulty;

    if (rate > TARGET_HIGH && difficulty < 4) {
      next = (difficulty + 1) as QuizDifficulty;
    } else if (rate < TARGET_LOW && difficulty > 2) {
      next = (difficulty - 1) as QuizDifficulty;
    }

    if (next !== difficulty) {
      setDifficulty(next);
    }
  }, [quizResults, difficulty, setDifficulty]);
}
