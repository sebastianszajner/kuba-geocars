import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useSessionStore } from '../store/sessionStore';
import { useSettingsStore } from '../store/settingsStore';
import { usePackStore } from '../store/packStore';
import { generateQuestion } from '../utils/quiz';
import type { QuizQuestion, QuizOption } from '../types';
import { Check, X } from 'lucide-react';
import EntityIcon from './EntityIcon';
import FlagImage from './FlagImage';

export default function QuizModal() {
  const { activeTopic, difficulty, addQuizResult, setOverlay, wrongIds, addWrongId, removeWrongId } = useGameStore();
  const { trialsSinceBreak, incrementTrials, setIsOnBreak } = useSessionStore();
  const { settings } = useSettingsStore();
  const { byKind } = usePackStore();

  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [answeredId, setAnsweredId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const nextQuestion = useCallback(() => {
    const entities = {
      countries: byKind('country'),
      carBrands: byKind('car_brand'),
      foods: byKind('food_item'),
      rcModels: byKind('rc_model'),
      legoThemes: byKind('lego_theme'),
      hwLines: byKind('hotwheels_line'),
    };

    const q = generateQuestion(activeTopic, entities, difficulty, wrongIds);
    setQuestion(q);
    setAnsweredId(null);
    setIsCorrect(null);
  }, [activeTopic, difficulty, wrongIds, byKind]);

  useEffect(() => {
    nextQuestion();
  }, [nextQuestion]);

  const handleAnswer = (opt: QuizOption) => {
    if (answeredId !== null || !question) return;

    const correct = opt.id === question.correctId;
    setAnsweredId(opt.id);
    setIsCorrect(correct);

    // Spaced repetition light
    const entityId = question.meta?.entityId;
    if (entityId) {
      if (correct) removeWrongId(entityId);
      else addWrongId(entityId);
    }

    addQuizResult({ correct, type: question.type, entityId, timestamp: Date.now() });
    incrementTrials();

    setTimeout(() => {
      if (trialsSinceBreak + 1 >= settings.microTrialsBeforeBreak) {
        setIsOnBreak(true);
        setOverlay('break');
      } else {
        nextQuestion();
      }
    }, correct ? 600 : 1200);
  };

  if (!question) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Ladowanie pytania...</p>
        <button onClick={() => setOverlay('none')} className="mt-4 text-xs text-gray-400 underline">
          Wroc do mapy
        </button>
      </div>
    );
  }

  const topicLabels: Record<string, string> = {
    cars_geo: 'Marka \u2192 Kraj',
    food_geo: 'Jedzenie \u2192 Kraj',
    flags: 'Flaga \u2192 Kraj',
    direction: 'Kierunek',
    categories: 'Rodzina',
  };

  return (
    <div className="space-y-5">
      {/* Topic label */}
      <div className="text-center">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {topicLabels[question.topic] || 'Quiz'}
        </span>
      </div>

      {/* Prompt — big emoji + short text */}
      <div className="text-center">
        {question.promptEmoji && (
          <div className="mb-3 flex justify-center">
            {question.meta?.promptCode ? (
              <FlagImage code={question.meta.promptCode} fallbackEmoji={question.promptEmoji} size="xl" />
            ) : (
              <EntityIcon emoji={question.promptEmoji} iconUrl={undefined} size="xl" />
            )}
          </div>
        )}
        {(question.topic === 'direction') ? (
          <p className="text-lg font-medium">{question.prompt}</p>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              {question.topic === 'cars_geo' && 'Skad jest ta marka?'}
              {question.topic === 'food_geo' && 'Skad jest to jedzenie?'}
              {question.topic === 'flags' && 'Ktory to kraj?'}
              {question.topic === 'categories' && 'Do jakiej rodziny nalezy?'}
            </p>
            <p className="text-2xl font-bold mt-1">{question.prompt}</p>
          </>
        )}
        {question.meta?.flagA && question.meta?.flagB && (
          <div className="flex justify-center items-center gap-4 mt-3">
            <FlagImage code={question.meta.codeA || ''} fallbackEmoji={question.meta.flagA} size="lg" />
            <span className="text-gray-300 text-2xl font-bold">vs</span>
            <FlagImage code={question.meta.codeB || ''} fallbackEmoji={question.meta.flagB} size="lg" />
          </div>
        )}
      </div>

      {/* Options — big emoji tiles for 5-6 year olds */}
      <div className={`grid gap-3 ${question.options.length <= 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {question.options.map((opt) => {
          let style = 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50';
          if (answeredId !== null) {
            if (opt.id === question.correctId) {
              style = 'border-geo-good bg-green-50';
            } else if (opt.id === answeredId && !isCorrect) {
              style = 'border-geo-bad bg-red-50';
            } else {
              style = 'border-gray-100 bg-gray-50 opacity-50';
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleAnswer(opt)}
              disabled={answeredId !== null}
              className={`quiz-option relative flex flex-col items-center gap-1 p-5 rounded-2xl border-2 text-center font-medium transition-all min-h-[80px] ${style}`}
            >
              {opt.countryCode ? (
                <FlagImage code={opt.countryCode} fallbackEmoji={opt.emoji} size="lg" />
              ) : (
                <EntityIcon emoji={opt.emoji} iconUrl={opt.iconUrl} size="lg" />
              )}
              <span className="text-sm">{opt.label}</span>
              {answeredId !== null && opt.id === question.correctId && (
                <Check size={20} className="absolute top-2 right-2 text-green-600" />
              )}
              {answeredId !== null && opt.id === answeredId && !isCorrect && (
                <X size={20} className="absolute top-2 right-2 text-red-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answeredId !== null && (
        <div className="text-center">
          {isCorrect ? (
            <p className="text-base text-green-600 font-bold">Super!</p>
          ) : (
            <p className="text-sm text-red-500">
              To: {question.options.find((o) => o.id === question.correctId)?.label}
            </p>
          )}
        </div>
      )}

      {/* Close */}
      <div className="text-center">
        <button onClick={() => setOverlay('none')} className="text-xs text-gray-400 hover:text-gray-600 underline">
          Wroc do mapy
        </button>
      </div>
    </div>
  );
}
