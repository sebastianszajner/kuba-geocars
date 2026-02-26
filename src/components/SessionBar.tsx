import { useSessionStore } from '../store/sessionStore';
import { useSettingsStore } from '../store/settingsStore';
import { Clock, Zap } from 'lucide-react';

function fmtTime(sec: number): string {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function SessionBar() {
  const { elapsedSec, sessionActive, trialsSinceBreak } = useSessionStore();
  const { settings } = useSettingsStore();

  const limitSec = settings.sessionLimitMin * 60;
  const progress = Math.min(elapsedSec / limitSec, 1);
  const remaining = Math.max(limitSec - elapsedSec, 0);

  // Break proximity indicator
  const breakProgress = trialsSinceBreak / settings.microTrialsBeforeBreak;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-sm">
        <Clock size={14} className="text-gray-400" />
        <span className="font-mono text-gray-700">{fmtTime(elapsedSec)}</span>
        <span className="text-xs text-gray-400">/ {fmtTime(limitSec)}</span>
      </div>

      {/* Session progress bar */}
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: progress < 0.7 ? '#2563eb' : progress < 0.9 ? '#f97316' : '#dc2626',
          }}
        />
      </div>

      {/* Break indicator dots */}
      <div className="flex gap-0.5">
        {Array.from({ length: settings.microTrialsBeforeBreak }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i < trialsSinceBreak ? 'bg-geo-warm' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
