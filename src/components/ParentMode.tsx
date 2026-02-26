import { useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { useSessionStore } from '../store/sessionStore';
import { useGameStore } from '../store/gameStore';
import { usePackStore } from '../store/packStore';
import type { GameMode, PackId } from '../types';
import { Lock, X } from 'lucide-react';

const MODE_LABELS: Record<GameMode, string> = {
  'explore': 'Eksploruj',
  'quiz-brand': 'Quiz: marka',
  'quiz-flag': 'Quiz: flaga',
  'quiz-direction': 'Quiz: kierunek',
  'quiz-food': 'Quiz: jedzenie',
  'quiz-category': 'Quiz: rodziny',
};

const PACK_LABELS: { id: PackId; label: string; emoji: string }[] = [
  { id: 'geo', label: 'Kraje', emoji: '\ud83c\udf0d' },
  { id: 'cars', label: 'Auta', emoji: '\ud83d\ude97' },
  { id: 'rc', label: 'RC', emoji: '\ud83c\udfce\ufe0f' },
  { id: 'lego', label: 'LEGO', emoji: '\ud83e\uddf1' },
  { id: 'hotwheels', label: 'Hot Wheels', emoji: '\ud83d\udd25' },
  { id: 'toys', label: 'Zabawki', emoji: '\ud83e\uddf8' },
  { id: 'food', label: 'Jedzenie', emoji: '\ud83c\udf55' },
];

export default function ParentMode() {
  const { settings, updateSettings } = useSettingsStore();
  const { stats } = useSessionStore();
  const { setOverlay } = useGameStore();
  const { loadPacks } = usePackStore();

  const [pinInput, setPinInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleUnlock = () => {
    if (pinInput === settings.pin) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPinInput('');
    }
  };

  const togglePack = (packId: PackId) => {
    const current = settings.enabledPacks;
    const enabled = current.includes(packId);
    if (packId === 'geo' && enabled) return;
    const next = enabled ? current.filter((p) => p !== packId) : [...current, packId];
    if (next.length === 0) return;
    updateSettings({ enabledPacks: next });
    loadPacks(next);
  };

  if (!unlocked) {
    return (
      <div className="space-y-4 py-4 text-center">
        <Lock size={40} className="mx-auto text-gray-300" />
        <h2 className="text-xl font-bold">Tryb rodzica</h2>
        <p className="text-sm text-gray-500">Podaj PIN (domyslnie: 1234)</p>
        <div className="flex justify-center gap-2">
          <input
            type="password"
            maxLength={6}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            className="w-32 px-4 py-2 border rounded-xl text-center text-lg tracking-widest"
            placeholder="****"
            autoFocus
          />
          <button
            onClick={handleUnlock}
            className="px-4 py-2 bg-geo-accent text-white rounded-xl font-medium"
          >
            OK
          </button>
        </div>
        {error && <p className="text-sm text-red-500">Bledny PIN</p>}
        <button
          onClick={() => setOverlay('none')}
          className="text-xs text-gray-400 underline"
        >
          Anuluj
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Ustawienia</h2>
        <button
          onClick={() => setOverlay('none')}
          className="p-1.5 rounded-lg hover:bg-gray-100"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Session limit */}
      <div>
        <label className="text-sm font-medium text-gray-600">
          Limit sesji: {settings.sessionLimitMin} min
        </label>
        <input
          type="range"
          min={5}
          max={15}
          value={settings.sessionLimitMin}
          onChange={(e) => updateSettings({ sessionLimitMin: Number(e.target.value) })}
          className="w-full mt-1"
        />
      </div>

      {/* Daily limit */}
      <div>
        <label className="text-sm font-medium text-gray-600">
          Limit dzienny: {settings.dailyLimitMin} min
        </label>
        <input
          type="range"
          min={10}
          max={40}
          value={settings.dailyLimitMin}
          onChange={(e) => updateSettings({ dailyLimitMin: Number(e.target.value) })}
          className="w-full mt-1"
        />
      </div>

      {/* Micro-trials before break */}
      <div>
        <label className="text-sm font-medium text-gray-600">
          Prob przed przerwa: {settings.microTrialsBeforeBreak}
        </label>
        <input
          type="range"
          min={4}
          max={12}
          value={settings.microTrialsBeforeBreak}
          onChange={(e) => updateSettings({ microTrialsBeforeBreak: Number(e.target.value) })}
          className="w-full mt-1"
        />
      </div>

      {/* Break duration */}
      <div>
        <label className="text-sm font-medium text-gray-600">
          Czas przerwy: {settings.breakDurationSec}s
        </label>
        <input
          type="range"
          min={15}
          max={60}
          value={settings.breakDurationSec}
          onChange={(e) => updateSettings({ breakDurationSec: Number(e.target.value) })}
          className="w-full mt-1"
        />
      </div>

      {/* Content packs */}
      <div>
        <label className="text-sm font-medium text-gray-600 block mb-2">Paczki tresci:</label>
        <div className="flex flex-wrap gap-2">
          {PACK_LABELS.map((p) => {
            const enabled = settings.enabledPacks.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => togglePack(p.id)}
                className={`pill-btn text-sm ${enabled ? 'selected' : ''}`}
              >
                <span>{p.emoji}</span> {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Enabled modes */}
      <div>
        <label className="text-sm font-medium text-gray-600 block mb-2">Wlaczone tryby:</label>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(MODE_LABELS) as [GameMode, string][]).map(([mode, label]) => {
            const enabled = settings.enabledModes.includes(mode);
            return (
              <button
                key={mode}
                onClick={() => {
                  const modes = enabled
                    ? settings.enabledModes.filter((m) => m !== mode)
                    : [...settings.enabledModes, mode];
                  if (modes.length === 0 || (mode === 'explore' && enabled)) return;
                  updateSettings({ enabledModes: modes });
                }}
                className={`pill-btn text-sm ${enabled ? 'selected' : ''}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Change PIN */}
      <div>
        <label className="text-sm font-medium text-gray-600 block mb-1">Zmien PIN:</label>
        <input
          type="password"
          maxLength={6}
          placeholder="Nowy PIN"
          className="w-32 px-3 py-1.5 border rounded-xl text-sm"
          onBlur={(e) => {
            if (e.target.value.length >= 4) {
              updateSettings({ pin: e.target.value });
            }
          }}
        />
      </div>

      {/* Stats (last 7 days) */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Statystyki (7 dni):</h3>
        {stats.length === 0 ? (
          <p className="text-xs text-gray-400">Brak danych</p>
        ) : (
          <div className="space-y-1">
            {stats.slice(-7).map((s) => (
              <div key={s.date} className="flex justify-between text-xs text-gray-500 p-1.5 bg-gray-50 rounded">
                <span>{s.date}</span>
                <span>{Math.floor(s.totalTimeSec / 60)} min</span>
                <span>{s.trials} prob</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
