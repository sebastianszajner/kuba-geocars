import { useEffect } from 'react';
import WorldMap from './components/WorldMap';
import SidePanel from './components/SidePanel';
import OverlayManager from './components/OverlayManager';
import { useSessionTimer } from './hooks/useSessionTimer';
import { useAdaptiveDifficulty } from './hooks/useAdaptiveDifficulty';
import { useSessionStore } from './store/sessionStore';
import { useSettingsStore } from './store/settingsStore';
import { usePackStore } from './store/packStore';

export default function App() {
  useSessionTimer();
  useAdaptiveDifficulty();

  useEffect(() => {
    const settings = useSettingsStore.getState().settings;
    usePackStore.getState().loadPacks(settings.enabledPacks);
    useSessionStore.getState().loadDailyElapsed();
    useSessionStore.getState().loadStats();
    useSessionStore.getState().startSession();
  }, []);

  return (
    <div className="h-full grid grid-cols-[1fr_380px] max-lg:grid-cols-1 max-lg:grid-rows-[60%_40%]">
      <WorldMap />
      <SidePanel />
      <OverlayManager />
    </div>
  );
}
