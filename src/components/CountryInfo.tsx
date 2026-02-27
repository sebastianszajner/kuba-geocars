import { useGameStore } from '../store/gameStore';
import { getCountryMeta, POLAND } from '../data/countries';
import { distanceFromPoland, directionFromPoland, cardinalToDeg } from '../utils/geography';
import { MapPin, Navigation } from 'lucide-react';
import FlagImage from './FlagImage';

export default function CountryInfo() {
  const selectedCountry = useGameStore((s) => s.selectedCountry);

  if (!selectedCountry) {
    return (
      <div className="text-center py-6 text-gray-400">
        <MapPin size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">Kliknij kraj na mapie</p>
      </div>
    );
  }

  const meta = getCountryMeta(selectedCountry);

  if (!meta) {
    return (
      <div className="py-4">
        <h3 className="text-lg font-bold">{selectedCountry}</h3>
        <p className="text-xs text-gray-400 mt-1">Brak dodatkowych informacji</p>
      </div>
    );
  }

  const km = distanceFromPoland(meta.lat, meta.lng);
  const dir = directionFromPoland(meta.lat, meta.lng);
  const arrowDeg = cardinalToDeg(dir.cardinal);
  const isPoland = meta.namePl === 'Polska';

  return (
    <div className="py-2">
      <div className="flex items-center gap-3">
        <FlagImage code={meta.code} fallbackEmoji={meta.flag} size="xl" />
        <div>
          <h3 className="text-xl font-bold leading-tight">{meta.namePl}</h3>
          <p className="text-sm text-gray-500">{meta.continentPl}</p>
        </div>
      </div>

      {!isPoland && (
        <div className="mt-3 flex items-center gap-3 p-2.5 bg-blue-50 rounded-xl">
          <div className="compass-arrow" style={{ transform: `rotate(${arrowDeg}deg)` }}>
            <Navigation size={24} className="text-geo-accent" />
          </div>
          <div>
            <p className="text-sm font-medium">{dir.label} od Polski</p>
            <p className="text-xs text-gray-500">ok. {km.toLocaleString('pl-PL')} km</p>
          </div>
        </div>
      )}

      {isPoland && (
        <div className="mt-3 p-2.5 bg-red-50 rounded-xl text-center">
          <p className="text-sm font-medium">To Twoj kraj!</p>
          <p className="text-xs text-gray-500">Tutaj mieszkasz</p>
        </div>
      )}
    </div>
  );
}
