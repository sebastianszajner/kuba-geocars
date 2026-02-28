import { useGameStore } from '../store/gameStore';
import { usePackStore } from '../store/packStore';
import { COUNTRIES } from '../data/countries';
import { distanceFromPoland, directionFromPoland } from '../utils/geography';
import type { CountryMeta, Entity } from '../types';
import { X } from 'lucide-react';
import FlagImage from './FlagImage';
import EntityIcon from './EntityIcon';

export default function EntityDetail() {
  const { selectedEntity, setSelectedEntity, setOverlay } = useGameStore();
  const { originCountry, getRelation, modelsForBrand, byId } = usePackStore();

  if (!selectedEntity) return null;

  const isBrand = selectedEntity.kind === 'car_brand';
  const isModel = selectedEntity.kind === 'car_model';

  // For car_model, resolve parent brand
  const brandEntity = isModel
    ? (() => {
        const brandRel = selectedEntity.relations.find((r) => r.type === 'brand');
        return brandRel?.target ? byId(brandRel.target) : undefined;
      })()
    : undefined;

  // Country of origin — from brand (for models) or directly (for brands/others)
  const entityForCountry = isModel && brandEntity ? brandEntity : selectedEntity;
  const country = originCountry(entityForCountry);
  const countryMeta = country
    ? Object.values(COUNTRIES).find((c) => c.namePl === country.titlePl) as CountryMeta | undefined
    : undefined;

  const km = countryMeta ? distanceFromPoland(countryMeta.lat, countryMeta.lng) : null;
  const dir = countryMeta ? directionFromPoland(countryMeta.lat, countryMeta.lng) : null;

  // For brands: get car_model entities instead of text examples
  const models = isBrand ? modelsForBrand(selectedEntity.id) : [];

  // For non-car entities: text examples
  const examples = !isBrand && !isModel ? getRelation(selectedEntity, 'examples') : undefined;
  const category = getRelation(selectedEntity, 'category');
  const does = getRelation(selectedEntity, 'does');

  const handleModelClick = (e: Entity) => {
    setSelectedEntity(e);
  };

  const handleBrandClick = () => {
    if (brandEntity) setSelectedEntity(brandEntity);
  };

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

      {/* For car_model: show parent brand */}
      {isModel && brandEntity && (
        <button
          onClick={handleBrandClick}
          className="flex items-center gap-2 p-2 bg-green-50 rounded-xl w-full hover:bg-green-100 transition-colors"
        >
          <EntityIcon emoji={brandEntity.media.emoji} iconUrl={brandEntity.media.iconUrl} size="sm" />
          <span className="text-sm font-medium">{brandEntity.titlePl}</span>
        </button>
      )}

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

      {/* Car models with real photos (for car_brand) */}
      {isBrand && models.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 font-medium mb-2">Modele ({models.length}):</p>
          <div className="grid grid-cols-3 gap-2">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelClick(model)}
                className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors"
              >
                <EntityIcon emoji={model.media.emoji} iconUrl={model.media.iconUrl} size="lg" />
                <span className="text-[11px] text-gray-700 font-medium leading-tight text-center line-clamp-2">
                  {model.titlePl.replace(selectedEntity.titlePl + ' ', '')}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Text examples (for non-car entities) */}
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
