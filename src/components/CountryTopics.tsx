import { useGameStore } from '../store/gameStore';
import { usePackStore } from '../store/packStore';
import { getCountryMeta } from '../data/countries';
import type { Entity } from '../types';
import { Car, UtensilsCrossed } from 'lucide-react';

export default function CountryTopics() {
  const selectedCountry = useGameStore((s) => s.selectedCountry);
  const { setSelectedEntity, setOverlay } = useGameStore();
  const { relatedToCountry, byKind } = usePackStore();

  if (!selectedCountry) return null;

  const meta = getCountryMeta(selectedCountry);
  if (!meta) return null;

  // Find country entity ID by matching Polish name
  const countries = byKind('country');
  const countryEntity = countries.find((c) => c.titlePl === meta.namePl);
  if (!countryEntity) return null;

  const cars = relatedToCountry(countryEntity.id).filter((e) => e.kind === 'car_brand').slice(0, 4);
  const foods = relatedToCountry(countryEntity.id).filter((e) => e.kind === 'food_item').slice(0, 4);

  if (cars.length === 0 && foods.length === 0) return null;

  const handleEntityClick = (e: Entity) => {
    setSelectedEntity(e);
    setOverlay('entity-detail');
  };

  return (
    <div className="space-y-3">
      {cars.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Car size={14} className="text-gray-400" />
            <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Auta ({cars.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cars.map((c) => (
              <button key={c.id} onClick={() => handleEntityClick(c)} className="pill-btn hover:bg-green-50">
                <span>{c.media.emoji}</span>
                <span className="font-medium text-xs">{c.titlePl}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {foods.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <UtensilsCrossed size={14} className="text-gray-400" />
            <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Jedzenie ({foods.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {foods.map((f) => (
              <button key={f.id} onClick={() => handleEntityClick(f)} className="pill-btn hover:bg-orange-50">
                <span>{f.media.emoji}</span>
                <span className="font-medium text-xs">{f.titlePl}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
