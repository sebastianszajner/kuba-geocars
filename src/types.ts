// =============================================
// Content Pack Entity — unified data model (v2)
// =============================================

export type EntityKind =
  | 'country'
  | 'car_brand'
  | 'rc_model'
  | 'lego_theme'
  | 'hotwheels_line'
  | 'toy_brand'
  | 'food_item';

export interface EntityMedia {
  emoji: string;
  iconUrl?: string | null;
  imageUrl?: string | null;
}

export interface EntityRelation {
  type: string;       // "origin_country" | "category" | "examples" | "does"
  target?: string;    // entity ID reference (e.g. "country:japan")
  value?: string | string[];
}

export interface Entity {
  id: string;
  kind: EntityKind;
  titlePl: string;
  titleAlt?: string[];
  media: EntityMedia;
  tags: string[];
  relations: EntityRelation[];
}

export type PackId = 'geo' | 'cars' | 'rc' | 'lego' | 'hotwheels' | 'toys' | 'food';

export interface ContentPack {
  id: PackId;
  label: string;
  emoji: string;
  entities: Entity[];
}

// =============================================
// Legacy Brand type (kept for backward compat)
// =============================================

export interface Brand {
  brand: string;
  originCountry: string;
  originCountryPl: string;
  flagEmoji: string;
  category: string[];
  examples: string[];
}

// =============================================
// Country metadata (for map GeoJSON matching)
// =============================================

export interface CountryMeta {
  namePl: string;
  nameEn: string;
  flag: string;
  continent: string;
  continentPl: string;
  lat: number;
  lng: number;
}

// =============================================
// Game state
// =============================================

export type GameMode = 'explore' | 'quiz-brand' | 'quiz-flag' | 'quiz-direction' | 'quiz-food' | 'quiz-category';

export type QuizTopic = 'cars_geo' | 'food_geo' | 'categories' | 'flags' | 'direction';

export type QuizDifficulty = 2 | 3 | 4;

export interface QuizOption {
  id: string;
  label: string;
  emoji: string;
}

export interface QuizQuestion {
  type: GameMode;
  topic: QuizTopic;
  prompt: string;
  promptEmoji?: string;
  options: QuizOption[];
  correctId: string;
  meta?: Record<string, string>;
}

export interface QuizResult {
  correct: boolean;
  type: GameMode;
  entityId?: string;   // what was asked about
  timestamp: number;
}

// =============================================
// Session & Settings
// =============================================

export interface SessionStats {
  date: string;
  totalTimeSec: number;
  trials: number;
  correctByType: Record<string, { correct: number; total: number }>;
}

export interface ParentSettings {
  pin: string;
  sessionLimitMin: number;
  dailyLimitMin: number;
  enabledModes: GameMode[];
  enabledPacks: PackId[];
  activeTopic: QuizTopic;
  microTrialsBeforeBreak: number;
  breakDurationSec: number;
}

export type OverlayType = 'none' | 'quiz' | 'break' | 'session-end' | 'parent' | 'entity-detail';
