import { useGameStore } from '../store/gameStore';
import type { QuizTopic } from '../types';
import { Map, Car, UtensilsCrossed, Layers, Flag, Compass } from 'lucide-react';

const TOPICS: { topic: QuizTopic; label: string; emoji: string; icon: typeof Map; hint: string }[] = [
  { topic: 'cars_geo', label: 'Auta', emoji: '\ud83d\ude97', icon: Car, hint: 'Skad jest ta marka auta?' },
  { topic: 'food_geo', label: 'Jedzenie', emoji: '\ud83c\udf55', icon: UtensilsCrossed, hint: 'Skad jest to jedzenie?' },
  { topic: 'flags', label: 'Flagi', emoji: '\ud83c\udff3\ufe0f', icon: Flag, hint: 'Ktory to kraj?' },
  { topic: 'direction', label: 'Kierunek', emoji: '\ud83e\udded', icon: Compass, hint: 'Gdzie jest ten kraj wzgledem Polski?' },
  { topic: 'categories', label: 'Rodziny', emoji: '\ud83e\uddf1', icon: Layers, hint: 'RC, LEGO czy Hot Wheels?' },
];

export default function ModeSwitch() {
  const { mode, setMode, activeTopic, setActiveTopic, setOverlay } = useGameStore();

  const isExplore = mode === 'explore';
  const currentHint = isExplore
    ? 'Klikaj kraje i odkrywaj!'
    : TOPICS.find((t) => t.topic === activeTopic)?.hint ?? '';

  return (
    <div className="space-y-3">
      {/* Explore / Quiz toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('explore')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all
            ${isExplore ? 'border-geo-accent bg-blue-50 text-geo-accent' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'}`}
        >
          <Map size={16} />
          Eksploruj
        </button>
        <button
          onClick={() => {
            setMode('quiz-brand'); // any quiz mode
            setOverlay('quiz');
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all
            ${!isExplore ? 'border-geo-accent bg-blue-50 text-geo-accent' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'}`}
        >
          Quiz
        </button>
      </div>

      {/* Topic selector (visible when in quiz mode or always for context) */}
      <div>
        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">Temat dzisiejszy:</p>
        <div className="flex flex-wrap gap-1.5">
          {TOPICS.map((t) => (
            <button
              key={t.topic}
              onClick={() => setActiveTopic(t.topic)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all
                ${activeTopic === t.topic
                  ? 'border-geo-accent bg-blue-50 text-geo-accent'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400'
                }`}
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">{currentHint}</p>
    </div>
  );
}
