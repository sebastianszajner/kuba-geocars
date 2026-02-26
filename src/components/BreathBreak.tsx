import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useSessionStore } from '../store/sessionStore';
import { useSettingsStore } from '../store/settingsStore';

export default function BreathBreak() {
  const { setOverlay } = useGameStore();
  const { resetTrialsSinceBreak, setIsOnBreak } = useSessionStore();
  const { settings } = useSettingsStore();

  const [countdown, setCountdown] = useState(settings.breakDurationSec);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleDone = () => {
    resetTrialsSinceBreak();
    setIsOnBreak(false);
    setOverlay('none');
  };

  return (
    <div className="text-center space-y-6 py-4">
      <h2 className="text-2xl font-bold text-gray-800">Przerwa</h2>

      {/* Breathing circle */}
      <div className="flex justify-center">
        <div className="breath-circle w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center">
          <span className="text-4xl font-bold text-geo-accent">{countdown}</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base text-gray-600">Wstaw, poruszaj sie!</p>
        <p className="text-sm text-gray-400">Oddychaj spokojnie: wdech 4s, wydech 4s</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 text-sm">
        <span className="pill-btn">10 skokow</span>
        <span className="pill-btn">Napij sie wody</span>
        <span className="pill-btn">Rozciagnij rece</span>
      </div>

      <button
        onClick={handleDone}
        disabled={countdown > 0}
        className={`px-6 py-3 rounded-xl font-medium text-white transition-all ${
          countdown > 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-geo-accent hover:bg-blue-700 cursor-pointer'
        }`}
      >
        {countdown > 0 ? `Poczekaj ${countdown}s` : 'Gotowe, gram dalej!'}
      </button>
    </div>
  );
}
