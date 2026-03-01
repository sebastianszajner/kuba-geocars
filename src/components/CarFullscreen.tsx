import { useEffect, useCallback, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePackStore } from '../store/packStore';
import { COUNTRIES } from '../data/countries';
import { CAR_FUN_FACTS, GENERIC_CAR_FACTS } from '../data/carFunFacts';
import type { CountryMeta } from '../types';
import { X, ChevronLeft, ChevronRight, Lightbulb, MapPin } from 'lucide-react';
import FlagImage from './FlagImage';
import EntityIcon from './EntityIcon';

// Resolve image URL from entity media
function resolveImgUrl(iconUrl?: string | null): string | null {
  if (!iconUrl) return null;
  return iconUrl.startsWith('http') ? iconUrl : `${import.meta.env.BASE_URL}${iconUrl.replace(/^\//, '')}`;
}

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
  const [showFact, setShowFact] = useState(0); // which fact to show (0 or 1)

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
      // Only count horizontal swipes (more horizontal than vertical, min 50px)
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

  // Slide animation class
  const slideClass = slideDir === 'next'
    ? 'car-slide-in-right'
    : slideDir === 'prev'
    ? 'car-slide-in-left'
    : '';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[60] flex flex-col car-fullscreen-enter select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #1a2332 0%, #0d1117 50%, #000000 100%)',
      }}
    >
      {/* Progress bar at very top */}
      <div className="h-1 bg-white/5 w-full">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 transition-all duration-500 ease-out rounded-r-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-2.5 pb-1">
        <div className="flex items-center gap-3 min-w-0">
          {brand && (
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <EntityIcon emoji={brand.media.emoji} iconUrl={brand.media.iconUrl} size="sm" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-white text-lg font-bold leading-tight truncate car-title-enter">
              {shortName}
            </h1>
            {brand && (
              <p className="text-white/40 text-xs">{brand.titlePl}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Counter pill */}
          <span className="text-white/30 text-xs font-mono bg-white/5 px-2.5 py-1 rounded-full">
            {carViewerIndex + 1}/{total}
          </span>
          <button
            onClick={close}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 active:scale-90 transition-all border border-white/10"
          >
            <X size={20} className="text-white/70" />
          </button>
        </div>
      </div>

      {/* Main car image area */}
      <div className="flex-1 relative flex items-center justify-center px-2 min-h-0 overflow-hidden">
        {/* Ambient glow behind car */}
        <div
          className="absolute inset-0 opacity-20 blur-3xl pointer-events-none"
          style={{
            background: countryMeta
              ? 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.4), transparent 70%)'
              : 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 70%)',
          }}
        />

        {/* Left arrow */}
        <button
          onClick={goPrev}
          disabled={!hasPrev}
          className={`absolute left-1 sm:left-3 z-10 p-3 rounded-2xl transition-all duration-200 ${
            hasPrev
              ? 'bg-white/10 hover:bg-white/20 active:scale-90 backdrop-blur-sm border border-white/10 car-arrow-pulse'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronLeft size={28} className="text-white" />
        </button>

        {/* Car photo with transition */}
        <div className={`flex-1 flex items-center justify-center max-h-full ${slideClass}`}>
          {imgSrc ? (
            <div className="relative">
              {/* Skeleton loader */}
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
                  filter: imgLoaded ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' : undefined,
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

        {/* Right arrow */}
        <button
          onClick={goNext}
          disabled={!hasNext}
          className={`absolute right-1 sm:right-3 z-10 p-3 rounded-2xl transition-all duration-200 ${
            hasNext
              ? 'bg-white/10 hover:bg-white/20 active:scale-90 backdrop-blur-sm border border-white/10 car-arrow-pulse'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronRight size={28} className="text-white" />
        </button>
      </div>

      {/* Bottom info panel */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2.5 car-bottom-enter">
        {/* Country + Brand strip */}
        <div className="flex items-center gap-2">
          {/* Country badge */}
          {country && countryMeta && (
            <div className="flex items-center gap-2.5 bg-white/8 backdrop-blur-sm rounded-xl px-3.5 py-2 border border-white/8 flex-1 min-w-0">
              <FlagImage code={countryMeta.code} fallbackEmoji={country.media.emoji} size="sm" className="flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-white font-bold text-sm leading-tight truncate">{country.titlePl}</p>
                <div className="flex items-center gap-1 text-white/35 text-[10px]">
                  <MapPin size={9} />
                  <span>{countryMeta.continentPl}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fun fact card */}
        <button
          onClick={() => setShowFact((f) => (f + 1) % facts.length)}
          className="w-full text-left group"
        >
          <div className="relative overflow-hidden rounded-xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-orange-500/10 px-4 py-3">
            {/* Decorative sparkle */}
            <div className="absolute -top-2 -right-2 text-yellow-400/20 text-4xl pointer-events-none">✦</div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lightbulb size={16} className="text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-yellow-400/60 font-medium uppercase tracking-wider mb-0.5">
                  Czy wiesz, że...
                </p>
                <p className="text-white/85 text-sm leading-relaxed car-fact-enter" key={`${car.id}-${showFact}`}>
                  {facts[showFact]}
                </p>
                {facts.length > 1 && (
                  <div className="flex items-center gap-1 mt-1.5">
                    {facts.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          i === showFact ? 'w-4 bg-yellow-400/60' : 'w-1 bg-yellow-400/20'
                        }`}
                      />
                    ))}
                    <span className="text-[9px] text-yellow-400/30 ml-1 group-hover:text-yellow-400/50 transition-colors">
                      kliknij
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </button>

        {/* Swipe hint */}
        <p className="text-center text-white/20 text-[10px] tracking-wide">
          ← → strzałki · przesuń palcem · ESC zamknij
        </p>
      </div>
    </div>
  );
}
