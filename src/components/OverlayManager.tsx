import { useGameStore } from '../store/gameStore';
import QuizModal from './QuizModal';
import BreathBreak from './BreathBreak';
import SessionEnd from './SessionEnd';
import ParentMode from './ParentMode';
import EntityDetail from './EntityDetail';
import CarFullscreen from './CarFullscreen';

export default function OverlayManager() {
  const { overlay, setOverlay } = useGameStore();

  if (overlay === 'none') return null;

  // Car fullscreen renders its own full-viewport overlay
  if (overlay === 'car-fullscreen') return <CarFullscreen />;

  const handleBackdropClick = () => {
    if (overlay === 'quiz' || overlay === 'entity-detail') {
      setOverlay('none');
    }
  };

  return (
    <div
      className="overlay-backdrop fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="modal-content bg-white rounded-2xl p-5 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {overlay === 'quiz' && <QuizModal />}
        {overlay === 'break' && <BreathBreak />}
        {overlay === 'session-end' && <SessionEnd />}
        {overlay === 'parent' && <ParentMode />}
        {overlay === 'entity-detail' && <EntityDetail />}
      </div>
    </div>
  );
}
