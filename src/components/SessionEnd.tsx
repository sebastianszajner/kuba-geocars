import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useSessionStore } from '../store/sessionStore';

const MOODS = [
  { emoji: '\ud83d\ude00', label: 'radosc' },
  { emoji: '\ud83d\ude0c', label: 'spokoj' },
  { emoji: '\ud83d\ude20', label: 'zlosc' },
  { emoji: '\ud83d\ude22', label: 'smutek' },
  { emoji: '\ud83e\udd71', label: 'zmeczenie' },
];

const OFFLINE = [
  'Zrob 10 skokow',
  'Odloz 3 rzeczy na miejsce',
  'Policz 10 przedmiotow w pokoju',
  'Pchnij sciane 20s x2',
  'Napij sie wody',
  'Narysuj flage z gry',
];

export default function SessionEnd() {
  const [mood, setMood] = useState<string | null>(null);
  const [mission, setMission] = useState<string | null>(null);

  const { quizResults } = useGameStore();
  const { elapsedSec } = useSessionStore();

  const totalTrials = quizResults.length;
  const correctTrials = quizResults.filter((r) => r.correct).length;
  const minutes = Math.floor(elapsedSec / 60);

  // Save stats
  const saveAndClose = () => {
    if (mood) localStorage.setItem('kubageo_lastMood', mood);
    if (mission) localStorage.setItem('kubageo_lastOffline', mission);

    // Build correctByType
    const byType: Record<string, { correct: number; total: number }> = {};
    for (const r of quizResults) {
      if (!byType[r.type]) byType[r.type] = { correct: 0, total: 0 };
      byType[r.type].total++;
      if (r.correct) byType[r.type].correct++;
    }

    useSessionStore.getState().saveTodayStats(totalTrials, byType);
  };

  return (
    <div className="space-y-5 py-2">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Koniec sesji!</h2>
        <p className="text-sm text-gray-500 mt-1">Swietna robota, Kuba!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-blue-50 rounded-xl">
          <p className="text-2xl font-bold text-geo-accent">{minutes}</p>
          <p className="text-xs text-gray-500">minut</p>
        </div>
        <div className="p-3 bg-green-50 rounded-xl">
          <p className="text-2xl font-bold text-geo-good">{correctTrials}</p>
          <p className="text-xs text-gray-500">dobrych</p>
        </div>
        <div className="p-3 bg-orange-50 rounded-xl">
          <p className="text-2xl font-bold text-geo-warm">{totalTrials}</p>
          <p className="text-xs text-gray-500">prob</p>
        </div>
      </div>

      {/* Mood */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">Jak sie czujesz?</p>
        <div className="flex justify-center gap-3">
          {MOODS.map((m) => (
            <button
              key={m.label}
              onClick={() => setMood(m.label)}
              className={`text-3xl p-1 rounded-xl transition-all ${
                mood === m.label ? 'bg-blue-100 scale-110' : 'hover:scale-110'
              }`}
              title={m.label}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Offline mission */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">Wybierz misje offline:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {OFFLINE.map((t) => (
            <button
              key={t}
              onClick={() => setMission(t)}
              className={`pill-btn text-sm ${mission === t ? 'selected' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={saveAndClose}
          className="px-6 py-3 rounded-xl font-medium text-white bg-geo-accent hover:bg-blue-700 transition-all"
        >
          Zapisz i zamknij
        </button>
      </div>
    </div>
  );
}
