import type { Entity, QuizDifficulty, QuizOption, QuizQuestion, QuizTopic } from '../types';
import { COUNTRIES, POLAND } from '../data/countries';

// ---- Helpers ----

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomN<T>(arr: T[], n: number, exclude?: T): T[] {
  const filtered = exclude != null ? arr.filter((x) => x !== exclude) : [...arr];
  return shuffle(filtered).slice(0, n);
}

// Lookup ISO country code from COUNTRIES by Polish name
function findCountryCode(titlePl: string): string | undefined {
  const entry = Object.values(COUNTRIES).find((c) => c.namePl === titlePl);
  return entry?.code;
}

function entityToOption(e: Entity): QuizOption {
  return {
    id: e.id,
    label: e.titlePl,
    emoji: e.media.emoji,
    iconUrl: e.media.iconUrl,
    countryCode: e.kind === 'country' ? findCountryCode(e.titlePl) : undefined,
  };
}

// ---- Spaced repetition light ----
// Entities answered wrong get 2x weight in selection

export function pickWeighted(entities: Entity[], wrongIds: Set<string>): Entity {
  const weighted: Entity[] = [];
  for (const e of entities) {
    weighted.push(e);
    if (wrongIds.has(e.id)) weighted.push(e);
  }
  return pickRandom(weighted);
}

// ---- Quiz generators (age 5-6 adapted) ----

export function generateBrandToCountryQuiz(
  carBrands: Entity[],
  countries: Entity[],
  difficulty: QuizDifficulty,
  wrongIds: Set<string>,
): QuizQuestion | null {
  if (carBrands.length === 0 || countries.length < 2) return null;

  const brand = pickWeighted(carBrands, wrongIds);
  const originRel = brand.relations.find((r) => r.type === 'origin_country');
  if (!originRel?.target) return null;

  const correctCountry = countries.find((c) => c.id === originRel.target);
  if (!correctCountry) return null;

  const distractors = pickRandomN(countries, difficulty - 1, correctCountry);
  const options = shuffle([correctCountry, ...distractors]).map(entityToOption);

  return {
    type: 'quiz-brand',
    topic: 'cars_geo',
    prompt: brand.titlePl,
    promptEmoji: brand.media.emoji,
    options,
    correctId: correctCountry.id,
    meta: { entityId: brand.id },
  };
}

export function generateFoodToCountryQuiz(
  foods: Entity[],
  countries: Entity[],
  difficulty: QuizDifficulty,
  wrongIds: Set<string>,
): QuizQuestion | null {
  if (foods.length === 0 || countries.length < 2) return null;

  const food = pickWeighted(foods, wrongIds);
  const originRel = food.relations.find((r) => r.type === 'origin_country');
  if (!originRel?.target) return null;

  const correctCountry = countries.find((c) => c.id === originRel.target);
  if (!correctCountry) return null;

  const distractors = pickRandomN(countries, difficulty - 1, correctCountry);
  const options = shuffle([correctCountry, ...distractors]).map(entityToOption);

  return {
    type: 'quiz-food',
    topic: 'food_geo',
    prompt: food.titlePl,
    promptEmoji: food.media.emoji,
    options,
    correctId: correctCountry.id,
    meta: { entityId: food.id },
  };
}

export function generateFlagQuiz(
  countries: Entity[],
  difficulty: QuizDifficulty,
): QuizQuestion | null {
  if (countries.length < 2) return null;

  const target = pickRandom(countries);
  const distractors = pickRandomN(countries, difficulty - 1, target);
  const options = shuffle([target, ...distractors]).map(entityToOption);

  return {
    type: 'quiz-flag',
    topic: 'flags',
    prompt: 'Ktory to kraj?',
    promptEmoji: target.media.emoji,
    options,
    correctId: target.id,
    meta: { promptCode: findCountryCode(target.titlePl) || '' },
  };
}

export function generateDirectionQuiz(countries: Entity[]): QuizQuestion | null {
  const withCoords = countries.filter((c) => {
    const meta = Object.values(COUNTRIES).find((m) => m.namePl === c.titlePl);
    return meta && !(meta.lat === POLAND.lat && meta.lng === POLAND.lng);
  });
  if (withCoords.length < 2) return null;

  const [a, b] = shuffle(withCoords).slice(0, 2);
  const metaA = Object.values(COUNTRIES).find((m) => m.namePl === a.titlePl)!;
  const metaB = Object.values(COUNTRIES).find((m) => m.namePl === b.titlePl)!;

  const axes = ['west', 'east', 'north', 'south'] as const;
  const axis = pickRandom([...axes]);
  const labels: Record<string, string> = {
    west: 'bardziej na zachod', east: 'bardziej na wschod',
    north: 'bardziej na polnoc', south: 'bardziej na poludnie',
  };

  let correctEntity: Entity;
  if (axis === 'west') correctEntity = metaA.lng < metaB.lng ? a : b;
  else if (axis === 'east') correctEntity = metaA.lng > metaB.lng ? a : b;
  else if (axis === 'north') correctEntity = metaA.lat > metaB.lat ? a : b;
  else correctEntity = metaA.lat < metaB.lat ? a : b;

  return {
    type: 'quiz-direction',
    topic: 'direction',
    prompt: `Ktory kraj jest ${labels[axis]} od Polski?`,
    options: [a, b].map(entityToOption),
    correctId: correctEntity.id,
    meta: { flagA: a.media.emoji, flagB: b.media.emoji, codeA: metaA.code, codeB: metaB.code },
  };
}

export function generateCategoryQuiz(
  rcModels: Entity[],
  legoThemes: Entity[],
  hwLines: Entity[],
  difficulty: QuizDifficulty,
): QuizQuestion | null {
  const pool = shuffle([...rcModels, ...legoThemes, ...hwLines]);
  if (pool.length === 0) return null;

  const item = pool[0];
  const kindMap: Record<string, { label: string; id: string; emoji: string }> = {
    rc_model: { label: 'RC', id: 'cat:rc', emoji: '\ud83c\udfce\ufe0f' },
    lego_theme: { label: 'LEGO', id: 'cat:lego', emoji: '\ud83e\uddf1' },
    hotwheels_line: { label: 'Hot Wheels', id: 'cat:hw', emoji: '\ud83d\udd25' },
  };

  const correct = kindMap[item.kind];
  if (!correct) return null;

  const allCats = Object.values(kindMap);
  const distractors = pickRandomN(
    allCats.filter((c) => c.id !== correct.id),
    Math.min(difficulty - 1, allCats.length - 1),
  );
  const options = shuffle([correct, ...distractors]).map((c) => ({
    id: c.id, label: c.label, emoji: c.emoji,
  }));

  return {
    type: 'quiz-category',
    topic: 'categories',
    prompt: item.titlePl,
    promptEmoji: item.media.emoji,
    options,
    correctId: correct.id,
    meta: { entityId: item.id },
  };
}

// ---- Master generator ----

export function generateQuestion(
  topic: QuizTopic,
  entities: {
    countries: Entity[];
    carBrands: Entity[];
    foods: Entity[];
    rcModels: Entity[];
    legoThemes: Entity[];
    hwLines: Entity[];
  },
  difficulty: QuizDifficulty,
  wrongIds: Set<string>,
): QuizQuestion | null {
  switch (topic) {
    case 'cars_geo':
      return generateBrandToCountryQuiz(entities.carBrands, entities.countries, difficulty, wrongIds);
    case 'food_geo':
      return generateFoodToCountryQuiz(entities.foods, entities.countries, difficulty, wrongIds);
    case 'flags':
      return generateFlagQuiz(entities.countries, difficulty);
    case 'direction':
      return generateDirectionQuiz(entities.countries);
    case 'categories':
      return generateCategoryQuiz(entities.rcModels, entities.legoThemes, entities.hwLines, difficulty);
    default:
      return null;
  }
}
