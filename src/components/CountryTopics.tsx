import { useGameStore } from '../store/gameStore';
import { usePackStore } from '../store/packStore';
import { getCountryMeta } from '../data/countries';
import type { Entity } from '../types';
import { Car, UtensilsCrossed } from 'lucide-react';
import EntityIcon from './EntityIcon';

export default function CountryTopics() {
  const selectedCountry = useGameStore((s) => s.selectedCountry);
  const { setSelectedEntity, setOverlay } = useGameStore();
  const { relatedToCountry, byKind, modelsForBrand } = usePackStore();

  if (!selectedCountry) return null;

  const meta = getCountryMeta(selectedCountry);
  if (!meta) return null;

  // Find country entity ID by matching Polish name
  const countries = byKind('country');
  const countryEntity = countries.find((c) => c.titlePl === meta.namePl);
  if (!countryEntity) return null;

  const cars = relatedToCountry(countryEntity.id).filter((e) => e.kind === 'car_brand');
  const foods = relatedToCountry(countryEntity.id).filter((e) => e.kind === 'food_item').slice(0, 4);

  if (cars.length === 0 && foods.length === 0) return null;

  const handleEntityClick = (e: Entity) => {
    setSelectedEntity(e);
    setOverlay('entity-detail');
  };

  return (
    <div className="space-y-4">
      {cars.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Car size={14} className="text-gray-400" />
            <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
              Marki aut ({cars.length})
            </span>
          </div>
          <div className="space-y-3">
            {cars.map((brand) => {
              const models = modelsForBrand(brand.id);
              return (
                <div key={brand.id} className="bg-gray-50 rounded-xl p-2.5">
                  {/* Brand header with logo */}
                  <button
                    onClick={() => handleEntityClick(brand)}
                    className="flex items-center gap-2 w-full hover:bg-gray-100 rounded-lg p-1 -m-1 transition-colors"
                  >
                    <EntityIcon emoji={brand.media.emoji} iconUrl={brand.media.iconUrl} size="sm" />
                    <span className="font-bold text-sm">{brand.titlePl}</span>
                  </button>
                  {/* Car models grid */}
                  {models.length > 0 && (
                    <div className="grid grid-cols-3 gap-1.5 mt-2">
                      {models.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => handleEntityClick(model)}
                          className="flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-white transition-colors"
                        >
                          <EntityIcon emoji={model.media.emoji} iconUrl={model.media.iconUrl} size="md" />
                          <span className="text-[10px] text-gray-600 leading-tight text-center line-clamp-2">
                            {model.titlePl.replace(brand.titlePl + ' ', '')}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
