import { useEffect, useCallback, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePackStore } from '../store/packStore';
import { COUNTRIES } from '../data/countries';
import { CAR_FUN_FACTS, GENERIC_CAR_FACTS } from '../data/carFunFacts';
import type { CountryMeta } from '../types';
import { X, MapPin } from 'lucide-react';
import FlagImage from './FlagImage';
import EntityIcon from './EntityIcon';

const BASE = import.meta.env.BASE_URL;

// Resolve image URL from entity media
function resolveImgUrl(iconUrl?: string | null): string | null {
  if (!iconUrl) return null;
  return iconUrl.startsWith('http') ? iconUrl : `${BASE}${iconUrl.replace(/^\//, '')}`;
}

// UI asset paths
const BG_COSMIC = `${BASE}images/ui/geocars-bg-cosmic.png`;
const ARROW_LEFT = `${BASE}images/ui/geocars-arrow-left.png`;
const ARROW_RIGHT = `${BASE}images/ui/geocars-arrow-right.png`;
const FOX_FUNFACT = `${BASE}images/ui/geocars-fox-funfact.png`;

export default function CarFullscreen() {
  const { carViewerList, carViewerIndex, setCarViewerIndex, setOverlay } = useGameStore();
  const { byId, originCountry } = usePackStore();

  const car = carViewerList[carViewerIndex];
  const total = carViewerList.length;
  const hasPrev = carViewerIndex > 0;
  const hasNext = carViewerIndex < total - 1;

  // Animation direction: 'next' | 'prev' | null
  const [slideDir, setSlideDir] = useState<'next' | 'prev' | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showFact, setShowFact] = useState(0);

  // Touch/swipe
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => {
    if (carViewerIndex < total - 1) {
      setSlideDir('next');
      setImgLoaded(false);
      setShowFact(0);
      setCarViewerIndex(carViewerIndex + 1);
    }
  }, [carViewerIndex, total, setCarViewerIndex]);

  const goPrev = useCallback(() => {
    if (carViewerIndex > 0) {
      setSlideDir('prev');
      setImgLoaded(false);
      setShowFact(0);
      setCarViewerIndex(carViewerIndex - 1);
    }
  }, [carViewerIndex, setCarViewerIndex]);

  const close = useCallback(() => {
    setOverlay('none');
  }, [setOverlay]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, close]);

  // Touch/swipe handlers
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) goNext();
        else goPrev();
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [goNext, goPrev]);

  // Preload next/prev images
  useEffect(() => {
    const preload = (idx: number) => {
      const entity = carViewerList[idx];
      if (!entity) return;
      const url = resolveImgUrl(entity.media.iconUrl);
      if (url) {
        const img = new Image();
        img.src = url;
      }
    };
    preload(carViewerIndex + 1);
    preload(carViewerIndex - 1);
  }, [carViewerIndex, carViewerList]);

  // Clear slide animation after it plays
  useEffect(() => {
    if (slideDir) {
      const t = setTimeout(() => setSlideDir(null), 350);
      return () => clearTimeout(t);
    }
  }, [slideDir, carViewerIndex]);

  if (!car) return null;

  // Resolve brand
  const brandRel = car.relations.find((r) => r.type === 'brand');
  const brand = brandRel?.target ? byId(brandRel.target) : undefined;

  // Resolve country
  const entityForCountry = brand || car;
  const country = originCountry(entityForCountry);
  const countryMeta = country
    ? (Object.values(COUNTRIES).find((c) => c.namePl === country.titlePl) as CountryMeta | undefined)
    : undefined;

  // Fun facts
  const brandId = brand?.id || car.id;
  const brandFacts = CAR_FUN_FACTS[brandId];
  const facts = brandFacts && brandFacts.length > 0
    ? brandFacts
    : [GENERIC_CAR_FACTS[carViewerIndex % GENERIC_CAR_FACTS.length]];

  // Short model name
  const shortName = brand
    ? car.titlePl.replace(brand.titlePl + ' ', '')
    : car.titlePl;

  const imgSrc = resolveImgUrl(car.media.iconUrl);
  const progress = total > 1 ? ((carViewerIndex) / (total - 1)) * 100 : 100;

  const slideClass = slideDir === 'next'
    ? 'car-slide-in-right'
    : slideDir === 'prev'
    ? 'car-slide-in-left'
    : '';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[60] flex flex-col car-fullscreen-enter select-none overflow-hidden"
    >
      {/* Cosmic background image */}
      <img
        src={BG_COSMIC}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Progress bar at very top */}
        <div className="h-1.5 bg-white/5 w-full">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-2.5 pb-1">
          <div className="flex items-center gap-3 min-w-0">
            {brand && (
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                <EntityIcon emoji={brand.media.emoji} iconUrl={brand.media.iconUrl} size="sm" />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-white text-lg font-bold leading-tight truncate car-title-enter drop-shadow-lg">
                {shortName}
              </h1>
              {brand && (
                <p className="text-white/50 text-xs drop-shadow">{brand.titlePl}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs font-mono bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
              {carViewerIndex + 1}/{total}
            </span>
            <button
              onClick={close}
              className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-white/15 active:scale-90 transition-all border border-white/10"
            >
              <X size={20} className="text-white/80" />
            </button>
          </div>
        </div>

        {/* Main car image area */}
        <div className="flex-1 relative flex items-center justify-center px-2 min-h-0 overflow-hidden">
          {/* Ambient glow behind car */}
          <div
            className="absolute inset-0 opacity-30 blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.5), transparent 60%)',
            }}
          />

          {/* Left arrow — cartoon image */}
          <button
            onClick={goPrev}
            disabled={!hasPrev}
            className={`absolute left-1 sm:left-2 z-10 transition-all duration-200 ${
              hasPrev
                ? 'hover:scale-110 active:scale-90 car-arrow-pulse'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <img src={ARROW_LEFT} alt="Poprzednie" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-xl" draggable={false} />
          </button>

          {/* Car photo with transition */}
          <div className={`flex-1 flex items-center justify-center max-h-full ${slideClass}`}>
            {imgSrc ? (
              <div className="relative">
                {!imgLoaded && (
                  <div className="w-64 h-44 sm:w-80 sm:h-56 rounded-2xl bg-white/5 animate-pulse flex items-center justify-center">
                    <span className="text-6xl opacity-30">{car.media.emoji}</span>
                  </div>
                )}
                <img
                  key={car.id}
                  src={imgSrc}
                  alt={car.titlePl}
                  className={`max-w-[85vw] max-h-[45vh] sm:max-h-[50vh] object-contain rounded-2xl transition-opacity duration-300 ${
                    imgLoaded ? 'opacity-100' : 'opacity-0 absolute'
                  }`}
                  style={{
                    filter: imgLoaded ? 'drop-shadow(0 25px 50px rgba(0,0,0,0.6))' : undefined,
                  }}
                  draggable={false}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgLoaded(true)}
                />
              </div>
            ) : (
              <span className="text-[100px] sm:text-[140px] leading-none drop-shadow-2xl">
                {car.media.emoji}
              </span>
            )}
          </div>

          {/* Right arrow — cartoon image */}
          <button
            onClick={goNext}
            disabled={!hasNext}
            className={`absolute right-1 sm:right-2 z-10 transition-all duration-200 ${
              hasNext
                ? 'hover:scale-110 active:scale-90 car-arrow-pulse'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <img src={ARROW_RIGHT} alt="Nastepne" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-xl" draggable={false} />
          </button>
        </div>

        {/* Bottom info panel */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2 car-bottom-enter">
          {/* Country badge */}
          {country && countryMeta && (
            <div className="flex items-center gap-2.5 bg-black/30 backdrop-blur-md rounded-xl px-3.5 py-2 border border-white/10">
              <FlagImage code={countryMeta.code} fallbackEmoji={country.media.emoji} size="sm" className="flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-white font-bold text-sm leading-tight truncate drop-shadow">{country.titlePl}</p>
                <div className="flex items-center gap-1 text-white/40 text-[10px]">
                  <MapPin size={9} />
                  <span>{countryMeta.continentPl}</span>
                </div>
              </div>
            </div>
          )}

          {/* Fun fact card with fox */}
          <button
            onClick={() => setShowFact((f) => (f + 1) % facts.length)}
            className="w-full text-left group"
          >
            <div className="relative overflow-hidden rounded-xl border border-yellow-500/25 bg-gradient-to-br from-yellow-600/20 via-amber-600/10 to-orange-600/15 backdrop-blur-md px-4 py-3">
              <div className="flex items-start gap-3">
                {/* Fox with lightbulb */}
                <img
                  src={FOX_FUNFACT}
                  alt=""
                  className="w-10 h-10 flex-shrink-0 mt-0.5 drop-shadow-lg"
                  draggable={false}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-yellow-400/70 font-bold uppercase tracking-wider mb-0.5">
                    Czy wiesz, że...
                  </p>
                  <p className="text-white/90 text-sm leading-relaxed car-fact-enter drop-shadow" key={`${car.id}-${showFact}`}>
                    {facts[showFact]}
                  </p>
                  {facts.length > 1 && (
                    <div className="flex items-center gap-1 mt-1.5">
                      {facts.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            i === showFact ? 'w-4 bg-yellow-400/70' : 'w-1 bg-yellow-400/25'
                          }`}
                        />
                      ))}
                      <span className="text-[9px] text-yellow-400/35 ml-1 group-hover:text-yellow-400/60 transition-colors">
                        kliknij
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>

          {/* Swipe hint */}
          <p className="text-center text-white/25 text-[10px] tracking-wide drop-shadow">
            ← → strzalki · przesun palcem · ESC zamknij
          </p>
        </div>
      </div>
    </div>
  );
}
