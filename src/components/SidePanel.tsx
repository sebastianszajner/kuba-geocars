import ModeSwitch from './ModeSwitch';
import SessionBar from './SessionBar';
import CountryInfo from './CountryInfo';
import CountryTopics from './CountryTopics';
import { useGameStore } from '../store/gameStore';
import { Settings } from 'lucide-react';

export default function SidePanel() {
  const { setOverlay } = useGameStore();

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">GeoCars</h1>
            <p className="text-xs text-gray-400 mt-0.5">Mapa + auta + jedzenie + zabawki</p>
          </div>
          <button
            onClick={() => setOverlay('parent')}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title="Tryb rodzica"
          >
            <Settings size={18} />
          </button>
        </div>
        <div className="mt-3">
          <SessionBar />
        </div>
      </div>

      {/* Mode + topic switch */}
      <div className="p-4 border-b border-gray-100">
        <ModeSwitch />
      </div>

      {/* Country info */}
      <div className="p-4 border-b border-gray-100">
        <CountryInfo />
      </div>

      {/* Country topics (cars + food from packs) */}
      <div className="p-4 border-b border-gray-100">
        <CountryTopics />
      </div>

      {/* Mindfulness */}
      <div className="p-4 mt-auto">
        <RitualSection />
      </div>

      {/* Footer */}
      <div className="px-4 pb-3">
        <p className="text-[10px] text-gray-300 leading-tight">
          Zasady zdrowej gry: limit czasu, przerwy co chwile, brak losowych nagrod, brak strekow.
          Pochodzenie marki =/= miejsce produkcji.
        </p>
      </div>
    </div>
  );
}

const MOODS = [
  { emoji: '\ud83d\ude00', label: 'radosc' },
  { emoji: '\ud83d\ude0c', label: 'spokoj' },
  { emoji: '\ud83d\ude20', label: 'zlosc' },
  { emoji: '\ud83d\ude22', label: 'smutek' },
  { emoji: '\ud83e\udd71', label: 'zmeczenie' },
];

const OFFLINE_MISSIONS = [
  '10 skokow',
  'Odloz 3 rzeczy',
  'Policz 10 przedmiotow',
  'Pchnij sciane 20s x2',
  'Napij sie wody',
];

function RitualSection() {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs text-gray-500 font-medium mb-1.5">Jak sie czujesz?</p>
        <div className="flex gap-2">
          {MOODS.map((m) => (
            <button
              key={m.label}
              className="text-2xl hover:scale-110 transition-transform"
              title={m.label}
              onClick={() => localStorage.setItem('kubageo_lastMood', m.label)}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium mb-1.5">Misja offline (wybierz 1):</p>
        <div className="flex flex-wrap gap-1.5">
          {OFFLINE_MISSIONS.map((t) => (
            <button
              key={t}
              className="pill-btn text-xs"
              onClick={() => localStorage.setItem('kubageo_lastOffline', t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
