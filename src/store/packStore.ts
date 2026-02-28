import { create } from 'zustand';
import type { ContentPack, Entity, EntityKind, PackId } from '../types';

const ALL_PACK_IDS: PackId[] = ['geo', 'cars', 'rc', 'lego', 'hotwheels', 'toys', 'food'];

interface PackState {
  // Raw packs
  packs: ContentPack[];
  loading: boolean;

  // Indexed data
  allEntities: Entity[];
  indexById: Map<string, Entity>;

  // Actions
  loadPacks: (enabledIds?: PackId[]) => Promise<void>;
  reindex: () => void;

  // Queries
  byKind: (kind: EntityKind) => Entity[];
  byId: (id: string) => Entity | undefined;
  relatedToCountry: (countryId: string) => Entity[];
  originCountry: (entity: Entity) => Entity | undefined;
  getRelation: (entity: Entity, type: string) => string | string[] | undefined;
  modelsForBrand: (brandId: string) => Entity[];
  countriesWithContent: () => Entity[];
}

export const usePackStore = create<PackState>((set, get) => ({
  packs: [],
  loading: false,
  allEntities: [],
  indexById: new Map(),

  loadPacks: async (enabledIds = ALL_PACK_IDS) => {
    set({ loading: true });
    const loaded: ContentPack[] = [];

    for (const id of enabledIds) {
      try {
        const resp = await fetch(`${import.meta.env.BASE_URL}data/packs/${id}.json`);
        if (resp.ok) {
          const pack: ContentPack = await resp.json();
          loaded.push(pack);
        }
      } catch (err) {
        console.warn(`Failed to load pack: ${id}`, err);
      }
    }

    const allEntities = loaded.flatMap((p) => p.entities);
    const indexById = new Map(allEntities.map((e) => [e.id, e]));

    set({ packs: loaded, allEntities, indexById, loading: false });
  },

  reindex: () => {
    const all = get().packs.flatMap((p) => p.entities);
    set({ allEntities: all, indexById: new Map(all.map((e) => [e.id, e])) });
  },

  byKind: (kind) => get().allEntities.filter((e) => e.kind === kind),

  byId: (id) => get().indexById.get(id),

  relatedToCountry: (countryId) =>
    get().allEntities.filter((e) =>
      e.relations.some((r) => r.type === 'origin_country' && r.target === countryId),
    ),

  originCountry: (entity) => {
    const rel = entity.relations.find((r) => r.type === 'origin_country');
    return rel?.target ? get().indexById.get(rel.target) : undefined;
  },

  getRelation: (entity, type) => {
    const rel = entity.relations.find((r) => r.type === type);
    return rel?.value ?? rel?.target;
  },

  modelsForBrand: (brandId) =>
    get().allEntities.filter(
      (e) => e.kind === 'car_model' && e.relations.some((r) => r.type === 'brand' && r.target === brandId),
    ),

  countriesWithContent: () => {
    const countryIds = new Set<string>();
    for (const e of get().allEntities) {
      for (const r of e.relations) {
        if (r.type === 'origin_country' && r.target) {
          countryIds.add(r.target);
        }
      }
    }
    return [...countryIds]
      .map((id) => get().indexById.get(id))
      .filter(Boolean) as Entity[];
  },
}));
