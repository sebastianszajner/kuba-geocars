import { useGameStore } from '../store/gameStore';
import { usePackStore } from '../store/packStore';
import { COUNTRIES } from '../data/countries';
import { distanceFromPoland, directionFromPoland } from '../utils/geography';
import type { CountryMeta } from '../types';
import { X } from 'lucide-react';
import FlagImage from './FlagImage';
import EntityIcon from './EntityIcon';

export default function EntityDetail() {
  const { selectedEntity, setOverlay } = useGameStore();
  const { originCountry, getRelation } = usePackStore();

  if (!selectedEntity) return null;

  const country = originCountry(selectedEntity);
  const countryMeta = country
    ? Object.values(COUNTRIES).find((c) => c.namePl === country.titlePl) as CountryMeta | undefined
    : undefined;

  const km = countryMeta ? distanceFromPoland(countryMeta.lat, countryMeta.lng) : null;
  const dir = countryMeta ? directionFromPoland(countryMeta.lat, countryMeta.lng) : null;

  const examples = getRelation(selectedEntity, 'examples');
  const category = getRelation(selectedEntity, 'category');
  const does = getRelation(selectedEntity, 'does');

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <EntityIcon emoji={selectedEntity.media.emoji} iconUrl={selectedEntity.media.iconUrl} size="xl" />
          <div>
            <h2 className="text-2xl font-bold">{selectedEntity.titlePl}</h2>
            {category && (
              <span className="text-xs text-gray-400">
                {typeof category === 'string' ? category : (category as string[]).join(', ')}
              </span>
            )}
          </div>
        </div>
        <button onClick={() => setOverlay('none')} className="p-1.5 rounded-lg hover:bg-gray-100">
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Country of origin */}
      {country && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <FlagImage code={countryMeta?.code || ''} fallbackEmoji={country.media.emoji} size="lg" />
          <div>
            <p className="font-bold">{country.titlePl}</p>
            {km && dir && (
              <p className="text-xs text-gray-500">
                {dir.label} od Polski, ok. {km.toLocaleString('pl-PL')} km
              </p>
            )}
          </div>
        </div>
      )}

      {/* What it does (RC, LEGO, HW) */}
      {does && (
        <div className="p-3 bg-blue-50 rounded-xl">
          <p className="text-xs text-gray-500 font-medium mb-1">Co to robi?</p>
          <p className="text-sm">{typeof does === 'string' ? does : (does as string[]).join(', ')}</p>
        </div>
      )}

      {/* Examples */}
      {examples && Array.isArray(examples) && examples.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1.5">Przyklady:</p>
          <div className="flex flex-wrap gap-1.5">
            {(examples as string[]).map((ex) => (
              <span key={ex} className="pill-btn text-xs">{ex}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
