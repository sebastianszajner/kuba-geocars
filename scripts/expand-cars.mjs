#!/usr/bin/env node
/**
 * Expand cars.json with ~40 new brands and ~250+ new models.
 * Downloads images from Wikipedia API (batch queries).
 *
 * Usage: node scripts/expand-cars.mjs
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = new URL('..', import.meta.url).pathname;
const LOGOS_DIR = join(ROOT, 'public/images/logos');
const CARS_DIR = join(ROOT, 'public/images/cars');
const JSON_PATH = join(ROOT, 'public/data/packs/cars.json');

// ── NEW BRANDS ──────────────────────────────────────────
// [id, titlePl, country, category, emoji, wikiTitle]
const NEW_BRANDS = [
  ['subaru', 'Subaru', 'japan', 'mass-market', '🚗', 'Subaru'],
  ['mitsubishi', 'Mitsubishi', 'japan', 'mass-market', '🚗', 'Mitsubishi_Motors'],
  ['infiniti', 'Infiniti', 'japan', 'premium', '🚙', 'Infiniti'],
  ['daihatsu', 'Daihatsu', 'japan', 'mass-market', '🚗', 'Daihatsu'],
  ['mini', 'MINI', 'germany', 'mass-market', '🚗', 'Mini_(marque)'],
  ['cadillac', 'Cadillac', 'usa', 'premium', '🚙', 'Cadillac'],
  ['lincoln', 'Lincoln', 'usa', 'premium', '🚙', 'Lincoln_Motor_Company'],
  ['gmc', 'GMC', 'usa', 'mass-market', '🛻', 'GMC_(automobile)'],
  ['ram', 'Ram', 'usa', 'mass-market', '🛻', 'Ram_Trucks'],
  ['chrysler', 'Chrysler', 'usa', 'mass-market', '🚗', 'Chrysler'],
  ['rivian', 'Rivian', 'usa', 'electric', '⚡', 'Rivian'],
  ['pontiac', 'Pontiac', 'usa', 'sport', '🏎️', 'Pontiac_(automobile)'],
  ['buick', 'Buick', 'usa', 'premium', '🚙', 'Buick'],
  ['maserati', 'Maserati', 'italy', 'sport', '🏎️', 'Maserati'],
  ['pagani', 'Pagani', 'italy', 'sport', '🏎️', 'Pagani_(company)'],
  ['lancia', 'Lancia', 'italy', 'mass-market', '🚗', 'Lancia'],
  ['bugatti', 'Bugatti', 'france', 'sport', '🏎️', 'Bugatti'],
  ['alpine', 'Alpine', 'france', 'sport', '🏎️', 'Alpine_(automobile)'],
  ['ds', 'DS Automobiles', 'france', 'premium', '🚙', 'DS_Automobiles'],
  ['bentley', 'Bentley', 'uk', 'premium', '🚙', 'Bentley'],
  ['rollsroyce', 'Rolls-Royce', 'uk', 'premium', '🚙', 'Rolls-Royce_Motor_Cars'],
  ['astonmartin', 'Aston Martin', 'uk', 'sport', '🏎️', 'Aston_Martin'],
  ['mclaren', 'McLaren', 'uk', 'sport', '🏎️', 'McLaren_Automotive'],
  ['lotus', 'Lotus', 'uk', 'sport', '🏎️', 'Lotus_Cars'],
  ['mg', 'MG', 'uk', 'mass-market', '🚗', 'MG_(motor_company)'],
  ['koenigsegg', 'Koenigsegg', 'sweden', 'sport', '🏎️', 'Koenigsegg'],
  ['polestar', 'Polestar', 'sweden', 'electric', '⚡', 'Polestar_(company)'],
  ['genesis', 'Genesis', 'south_korea', 'premium', '🚙', 'Genesis_(automobile)'],
  ['ssangyong', 'SsangYong', 'south_korea', 'mass-market', '🚙', 'SsangYong_Motor'],
  ['nio', 'NIO', 'china', 'electric', '⚡', 'Nio_(car_company)'],
  ['geely', 'Geely', 'china', 'mass-market', '🚗', 'Geely'],
  ['greatwall', 'Great Wall', 'china', 'mass-market', '🚙', 'Great_Wall_Motors'],
  ['chery', 'Chery', 'china', 'mass-market', '🚗', 'Chery'],
  ['tata', 'Tata Motors', 'india', 'mass-market', '🚗', 'Tata_Motors'],
  ['mahindra', 'Mahindra', 'india', 'mass-market', '🚙', 'Mahindra_%26_Mahindra'],
  ['proton', 'Proton', 'malaysia', 'mass-market', '🚗', 'Proton_Holdings'],
  ['lada', 'Lada', 'russia', 'budget', '🚗', 'Lada'],
  ['cupra', 'Cupra', 'spain', 'sport', '🏎️', 'Cupra_(marque)'],
];

// ── ALL NEW MODELS ──────────────────────────────────────
// [id, brandId, titlePl, category, emoji, wikiTitle]
const ALL_NEW_MODELS = [
  // Toyota extras
  ['toyota-rav4', 'toyota', 'Toyota RAV4', 'suv', '🚙', 'Toyota_RAV4'],
  ['toyota-hilux', 'toyota', 'Toyota Hilux', 'offroad', '🛻', 'Toyota_Hilux'],
  ['toyota-camry', 'toyota', 'Toyota Camry', 'family', '🚗', 'Toyota_Camry'],
  ['toyota-yaris', 'toyota', 'Toyota Yaris', 'city', '🚗', 'Toyota_Yaris'],
  ['toyota-chr', 'toyota', 'Toyota C-HR', 'suv', '🚙', 'Toyota_C-HR'],
  // Honda extras
  ['honda-accord', 'honda', 'Honda Accord', 'family', '🚗', 'Honda_Accord'],
  ['honda-jazz', 'honda', 'Honda Jazz', 'city', '🚗', 'Honda_Fit'],
  ['honda-hrv', 'honda', 'Honda HR-V', 'suv', '🚙', 'Honda_HR-V'],
  ['honda-s2000', 'honda', 'Honda S2000', 'sport', '🏎️', 'Honda_S2000'],
  ['honda-e', 'honda', 'Honda e', 'electric', '⚡', 'Honda_e'],
  // Nissan extras
  ['nissan-juke', 'nissan', 'Nissan Juke', 'suv', '🚙', 'Nissan_Juke'],
  ['nissan-leaf', 'nissan', 'Nissan Leaf', 'electric', '⚡', 'Nissan_Leaf'],
  ['nissan-x-trail', 'nissan', 'Nissan X-Trail', 'suv', '🚙', 'Nissan_X-Trail'],
  ['nissan-370z', 'nissan', 'Nissan 370Z', 'sport', '🏎️', 'Nissan_370Z'],
  ['nissan-navara', 'nissan', 'Nissan Navara', 'offroad', '🛻', 'Nissan_Navara'],
  // Mazda extras
  ['mazda-cx5', 'mazda', 'Mazda CX-5', 'suv', '🚙', 'Mazda_CX-5'],
  ['mazda-cx30', 'mazda', 'Mazda CX-30', 'suv', '🚙', 'Mazda_CX-30'],
  ['mazda-6', 'mazda', 'Mazda 6', 'family', '🚗', 'Mazda6'],
  ['mazda-cx60', 'mazda', 'Mazda CX-60', 'suv', '🚙', 'Mazda_CX-60'],
  // Suzuki extras
  ['suzuki-s-cross', 'suzuki', 'Suzuki S-Cross', 'suv', '🚙', 'Suzuki_SX4_S-Cross'],
  ['suzuki-ignis', 'suzuki', 'Suzuki Ignis', 'city', '🚗', 'Suzuki_Ignis'],
  ['suzuki-across', 'suzuki', 'Suzuki Across', 'suv', '🚙', 'Suzuki_Across'],
  // Lexus extras
  ['lexus-nx', 'lexus', 'Lexus NX', 'suv', '🚙', 'Lexus_NX'],
  ['lexus-is', 'lexus', 'Lexus IS', 'sport', '🏎️', 'Lexus_IS'],
  ['lexus-es', 'lexus', 'Lexus ES', 'family', '🚗', 'Lexus_ES'],
  ['lexus-ux', 'lexus', 'Lexus UX', 'suv', '🚙', 'Lexus_UX'],
  // BMW extras
  ['bmw-3series', 'bmw', 'BMW Seria 3', 'family', '🚗', 'BMW_3_Series'],
  ['bmw-x3', 'bmw', 'BMW X3', 'suv', '🚙', 'BMW_X3'],
  ['bmw-i4', 'bmw', 'BMW i4', 'electric', '⚡', 'BMW_i4'],
  ['bmw-z4', 'bmw', 'BMW Z4', 'sport', '🏎️', 'BMW_Z4'],
  ['bmw-m5', 'bmw', 'BMW M5', 'sport', '🏎️', 'BMW_M5'],
  // Mercedes extras
  ['mercedes-gla', 'mercedes', 'Mercedes GLA', 'suv', '🚙', 'Mercedes-Benz_GLA-Class'],
  ['mercedes-eqs', 'mercedes', 'Mercedes EQS', 'electric', '⚡', 'Mercedes-Benz_EQS'],
  ['mercedes-cla', 'mercedes', 'Mercedes CLA', 'sport', '🏎️', 'Mercedes-Benz_CLA-Class'],
  ['mercedes-sl', 'mercedes', 'Mercedes SL', 'sport', '🏎️', 'Mercedes-Benz_SL-Class'],
  ['mercedes-gle', 'mercedes', 'Mercedes GLE', 'suv', '🚙', 'Mercedes-Benz_GLE-Class'],
  // VW extras
  ['vw-tiguan', 'volkswagen', 'Volkswagen Tiguan', 'suv', '🚙', 'Volkswagen_Tiguan'],
  ['vw-passat', 'volkswagen', 'Volkswagen Passat', 'family', '🚗', 'Volkswagen_Passat'],
  ['vw-t-roc', 'volkswagen', 'Volkswagen T-Roc', 'suv', '🚙', 'Volkswagen_T-Roc'],
  ['vw-id4', 'volkswagen', 'Volkswagen ID.4', 'electric', '⚡', 'Volkswagen_ID.4'],
  ['vw-touareg', 'volkswagen', 'Volkswagen Touareg', 'suv', '🚙', 'Volkswagen_Touareg'],
  // Audi extras
  ['audi-a4', 'audi', 'Audi A4', 'family', '🚗', 'Audi_A4'],
  ['audi-a6', 'audi', 'Audi A6', 'family', '🚗', 'Audi_A6'],
  ['audi-q7', 'audi', 'Audi Q7', 'suv', '🚙', 'Audi_Q7'],
  ['audi-etron-gt', 'audi', 'Audi e-tron GT', 'electric', '⚡', 'Audi_e-tron_GT'],
  ['audi-rs6', 'audi', 'Audi RS6', 'sport', '🏎️', 'Audi_RS_6'],
  // Porsche extras
  ['porsche-macan', 'porsche', 'Porsche Macan', 'suv', '🚙', 'Porsche_Macan'],
  ['porsche-panamera', 'porsche', 'Porsche Panamera', 'family', '🚗', 'Porsche_Panamera'],
  ['porsche-718', 'porsche', 'Porsche 718 Boxster', 'sport', '🏎️', 'Porsche_718'],
  ['porsche-356', 'porsche', 'Porsche 356', 'classic', '🚗', 'Porsche_356'],
  // Opel extras
  ['opel-grandland', 'opel', 'Opel Grandland', 'suv', '🚙', 'Opel_Grandland'],
  ['opel-crossland', 'opel', 'Opel Crossland', 'suv', '🚙', 'Opel_Crossland'],
  ['opel-insignia', 'opel', 'Opel Insignia', 'family', '🚗', 'Opel_Insignia'],
  // Ford extras
  ['ford-focus', 'ford', 'Ford Focus', 'family', '🚗', 'Ford_Focus'],
  ['ford-ranger', 'ford', 'Ford Ranger', 'offroad', '🛻', 'Ford_Ranger'],
  ['ford-puma', 'ford', 'Ford Puma', 'suv', '🚙', 'Ford_Puma'],
  ['ford-explorer', 'ford', 'Ford Explorer', 'suv', '🚙', 'Ford_Explorer'],
  ['ford-gt', 'ford', 'Ford GT', 'sport', '🏎️', 'Ford_GT'],
  // Chevrolet extras
  ['chevrolet-tahoe', 'chevrolet', 'Chevrolet Tahoe', 'suv', '🚙', 'Chevrolet_Tahoe'],
  ['chevrolet-blazer', 'chevrolet', 'Chevrolet Blazer', 'suv', '🚙', 'Chevrolet_Blazer'],
  ['chevrolet-bolt', 'chevrolet', 'Chevrolet Bolt', 'electric', '⚡', 'Chevrolet_Bolt'],
  ['chevrolet-impala', 'chevrolet', 'Chevrolet Impala', 'classic', '🚗', 'Chevrolet_Impala'],
  // Tesla extras
  ['tesla-model-y', 'tesla', 'Tesla Model Y', 'suv', '⚡', 'Tesla_Model_Y'],
  ['tesla-model-x', 'tesla', 'Tesla Model X', 'suv', '⚡', 'Tesla_Model_X'],
  ['tesla-roadster', 'tesla', 'Tesla Roadster', 'sport', '⚡', 'Tesla_Roadster_(second_generation)'],
  // Jeep extras
  ['jeep-compass', 'jeep', 'Jeep Compass', 'suv', '🚙', 'Jeep_Compass'],
  ['jeep-renegade', 'jeep', 'Jeep Renegade', 'suv', '🚙', 'Jeep_Renegade_(BU)'],
  ['jeep-cherokee', 'jeep', 'Jeep Cherokee', 'offroad', '🚙', 'Jeep_Cherokee_(KL)'],
  // Dodge extras
  ['dodge-durango', 'dodge', 'Dodge Durango', 'suv', '🚙', 'Dodge_Durango'],
  ['dodge-hornet', 'dodge', 'Dodge Hornet', 'suv', '🚙', 'Dodge_Hornet'],
  // Hyundai extras
  ['hyundai-santa-fe', 'hyundai', 'Hyundai Santa Fe', 'suv', '🚙', 'Hyundai_Santa_Fe'],
  ['hyundai-kona', 'hyundai', 'Hyundai Kona', 'suv', '🚙', 'Hyundai_Kona'],
  ['hyundai-i10', 'hyundai', 'Hyundai i10', 'city', '🚗', 'Hyundai_i10'],
  ['hyundai-ioniq6', 'hyundai', 'Hyundai IONIQ 6', 'electric', '⚡', 'Hyundai_Ioniq_6'],
  // Kia extras
  ['kia-sorento', 'kia', 'Kia Sorento', 'suv', '🚙', 'Kia_Sorento'],
  ['kia-niro', 'kia', 'Kia Niro', 'electric', '⚡', 'Kia_Niro'],
  ['kia-ceed', 'kia', 'Kia Ceed', 'family', '🚗', 'Kia_Ceed'],
  ['kia-picanto', 'kia', 'Kia Picanto', 'city', '🚗', 'Kia_Picanto'],
  // Renault extras
  ['renault-megane', 'renault', 'Renault Megane', 'family', '🚗', 'Renault_Mégane'],
  ['renault-scenic', 'renault', 'Renault Scenic', 'family', '🚗', 'Renault_Scénic'],
  ['renault-austral', 'renault', 'Renault Austral', 'suv', '🚙', 'Renault_Austral'],
  ['renault-zoe', 'renault', 'Renault Zoe', 'electric', '⚡', 'Renault_Zoe'],
  // Peugeot extras
  ['peugeot-308', 'peugeot', 'Peugeot 308', 'family', '🚗', 'Peugeot_308'],
  ['peugeot-508', 'peugeot', 'Peugeot 508', 'family', '🚗', 'Peugeot_508'],
  ['peugeot-2008', 'peugeot', 'Peugeot 2008', 'suv', '🚙', 'Peugeot_2008'],
  ['peugeot-5008', 'peugeot', 'Peugeot 5008', 'suv', '🚙', 'Peugeot_5008'],
  // Citroën extras
  ['citroen-c4', 'citroen', 'Citroën C4', 'family', '🚗', 'Citroën_C4'],
  ['citroen-berlingo', 'citroen', 'Citroën Berlingo', 'family', '🚗', 'Citroën_Berlingo'],
  ['citroen-c5-aircross', 'citroen', 'Citroën C5 Aircross', 'suv', '🚙', 'Citroën_C5_Aircross'],
  ['citroen-ami', 'citroen', 'Citroën Ami', 'electric', '⚡', 'Citroën_Ami_(electric)'],
  // Ferrari extras
  ['ferrari-296gtb', 'ferrari', 'Ferrari 296 GTB', 'sport', '🏎️', 'Ferrari_296_GTB'],
  ['ferrari-sf90', 'ferrari', 'Ferrari SF90 Stradale', 'sport', '🏎️', 'Ferrari_SF90_Stradale'],
  ['ferrari-roma', 'ferrari', 'Ferrari Roma', 'sport', '🏎️', 'Ferrari_Roma'],
  ['ferrari-250gto', 'ferrari', 'Ferrari 250 GTO', 'classic', '🏎️', 'Ferrari_250_GTO'],
  ['ferrari-purosangue', 'ferrari', 'Ferrari Purosangue', 'suv', '🏎️', 'Ferrari_Purosangue'],
  // Lamborghini extras
  ['lamborghini-revuelto', 'lamborghini', 'Lamborghini Revuelto', 'sport', '🏎️', 'Lamborghini_Revuelto'],
  ['lamborghini-urus', 'lamborghini', 'Lamborghini Urus', 'suv', '🏎️', 'Lamborghini_Urus'],
  ['lamborghini-diablo', 'lamborghini', 'Lamborghini Diablo', 'sport', '🏎️', 'Lamborghini_Diablo'],
  ['lamborghini-gallardo', 'lamborghini', 'Lamborghini Gallardo', 'sport', '🏎️', 'Lamborghini_Gallardo'],
  // Fiat extras
  ['fiat-tipo', 'fiat', 'Fiat Tipo', 'family', '🚗', 'Fiat_Tipo_(2015)'],
  ['fiat-doblo', 'fiat', 'Fiat Doblo', 'family', '🚗', 'Fiat_Doblò'],
  ['fiat-124-spider', 'fiat', 'Fiat 124 Spider', 'sport', '🏎️', 'Fiat_124_Sport_Spider'],
  ['fiat-126p', 'fiat', 'Fiat 126p', 'classic', '🚗', 'Fiat_126'],
  // Alfa Romeo extras
  ['alfa-romeo-tonale', 'alfaromeo', 'Alfa Romeo Tonale', 'suv', '🚙', 'Alfa_Romeo_Tonale'],
  ['alfa-romeo-gtv', 'alfaromeo', 'Alfa Romeo GTV', 'sport', '🏎️', 'Alfa_Romeo_GTV_and_Spider'],
  ['alfa-romeo-spider', 'alfaromeo', 'Alfa Romeo Spider', 'classic', '🏎️', 'Alfa_Romeo_Spider'],
  // Volvo extras
  ['volvo-xc60', 'volvo', 'Volvo XC60', 'suv', '🚙', 'Volvo_XC60'],
  ['volvo-v60', 'volvo', 'Volvo V60', 'family', '🚗', 'Volvo_V60'],
  ['volvo-s60', 'volvo', 'Volvo S60', 'family', '🚗', 'Volvo_S60'],
  ['volvo-c40', 'volvo', 'Volvo C40', 'electric', '⚡', 'Volvo_C40_Recharge'],
  // Škoda extras
  ['skoda-superb', 'skoda', 'Škoda Superb', 'family', '🚗', 'Škoda_Superb'],
  ['skoda-enyaq', 'skoda', 'Škoda Enyaq', 'electric', '⚡', 'Škoda_Enyaq_iV'],
  ['skoda-kamiq', 'skoda', 'Škoda Kamiq', 'suv', '🚙', 'Škoda_Kamiq'],
  ['skoda-scala', 'skoda', 'Škoda Scala', 'family', '🚗', 'Škoda_Scala'],
  // SEAT extras
  ['seat-arona', 'seat', 'SEAT Arona', 'suv', '🚙', 'SEAT_Arona'],
  ['seat-ateca', 'seat', 'SEAT Ateca', 'suv', '🚙', 'SEAT_Ateca'],
  // Dacia extras
  ['dacia-jogger', 'dacia', 'Dacia Jogger', 'family', '🚗', 'Dacia_Jogger'],
  ['dacia-spring', 'dacia', 'Dacia Spring', 'electric', '⚡', 'Dacia_Spring'],
  ['dacia-logan', 'dacia', 'Dacia Logan', 'family', '🚗', 'Dacia_Logan'],
  // BYD extras
  ['byd-han', 'byd', 'BYD Han', 'electric', '⚡', 'BYD_Han'],
  ['byd-tang', 'byd', 'BYD Tang', 'suv', '⚡', 'BYD_Tang'],
  ['byd-atto3', 'byd', 'BYD Atto 3', 'suv', '⚡', 'BYD_Atto_3'],
  // Jaguar extras
  ['jaguar-i-pace', 'jaguar', 'Jaguar I-Pace', 'electric', '⚡', 'Jaguar_I-Pace'],
  ['jaguar-xe', 'jaguar', 'Jaguar XE', 'sport', '🏎️', 'Jaguar_XE'],
  ['jaguar-xf', 'jaguar', 'Jaguar XF', 'family', '🚗', 'Jaguar_XF_(X250)'],
  // Land Rover extras
  ['land-rover-evoque', 'landrover', 'Range Rover Evoque', 'suv', '🚙', 'Range_Rover_Evoque'],
  ['land-rover-velar', 'landrover', 'Range Rover Velar', 'suv', '🚙', 'Range_Rover_Velar'],
  ['land-rover-sport', 'landrover', 'Range Rover Sport', 'suv', '🚙', 'Range_Rover_Sport'],
  // ── NEW BRAND MODELS ──
  // Subaru
  ['subaru-wrx', 'subaru', 'Subaru WRX', 'sport', '🏎️', 'Subaru_WRX'],
  ['subaru-impreza', 'subaru', 'Subaru Impreza', 'family', '🚗', 'Subaru_Impreza'],
  ['subaru-forester', 'subaru', 'Subaru Forester', 'suv', '🚙', 'Subaru_Forester'],
  ['subaru-outback', 'subaru', 'Subaru Outback', 'suv', '🚙', 'Subaru_Outback'],
  ['subaru-brz', 'subaru', 'Subaru BRZ', 'sport', '🏎️', 'Subaru_BRZ'],
  // Mitsubishi
  ['mitsubishi-outlander', 'mitsubishi', 'Mitsubishi Outlander', 'suv', '🚙', 'Mitsubishi_Outlander'],
  ['mitsubishi-eclipse-cross', 'mitsubishi', 'Mitsubishi Eclipse Cross', 'suv', '🚙', 'Mitsubishi_Eclipse_Cross'],
  ['mitsubishi-lancer-evo', 'mitsubishi', 'Mitsubishi Lancer Evo', 'sport', '🏎️', 'Mitsubishi_Lancer_Evolution'],
  ['mitsubishi-pajero', 'mitsubishi', 'Mitsubishi Pajero', 'offroad', '🚙', 'Mitsubishi_Pajero'],
  ['mitsubishi-l200', 'mitsubishi', 'Mitsubishi L200', 'offroad', '🛻', 'Mitsubishi_Triton'],
  // Infiniti
  ['infiniti-q50', 'infiniti', 'Infiniti Q50', 'sport', '🏎️', 'Infiniti_Q50'],
  ['infiniti-qx60', 'infiniti', 'Infiniti QX60', 'suv', '🚙', 'Infiniti_QX60'],
  ['infiniti-qx80', 'infiniti', 'Infiniti QX80', 'suv', '🚙', 'Infiniti_QX80'],
  // Daihatsu
  ['daihatsu-copen', 'daihatsu', 'Daihatsu Copen', 'sport', '🏎️', 'Daihatsu_Copen'],
  ['daihatsu-rocky', 'daihatsu', 'Daihatsu Rocky', 'suv', '🚙', 'Daihatsu_Rocky'],
  ['daihatsu-terios', 'daihatsu', 'Daihatsu Terios', 'suv', '🚙', 'Daihatsu_Terios'],
  // MINI
  ['mini-cooper', 'mini', 'MINI Cooper', 'city', '🚗', 'Mini_Hatch'],
  ['mini-countryman', 'mini', 'MINI Countryman', 'suv', '🚙', 'Mini_Countryman'],
  ['mini-clubman', 'mini', 'MINI Clubman', 'family', '🚗', 'Mini_Clubman'],
  ['mini-jcw', 'mini', 'MINI John Cooper Works', 'sport', '🏎️', 'John_Cooper_Works'],
  // Cadillac
  ['cadillac-escalade', 'cadillac', 'Cadillac Escalade', 'suv', '🚙', 'Cadillac_Escalade'],
  ['cadillac-ct5', 'cadillac', 'Cadillac CT5', 'family', '🚗', 'Cadillac_CT5'],
  ['cadillac-lyriq', 'cadillac', 'Cadillac Lyriq', 'electric', '⚡', 'Cadillac_Lyriq'],
  ['cadillac-deville', 'cadillac', 'Cadillac DeVille', 'classic', '🚗', 'Cadillac_de_Ville_series'],
  // Lincoln
  ['lincoln-navigator', 'lincoln', 'Lincoln Navigator', 'suv', '🚙', 'Lincoln_Navigator'],
  ['lincoln-continental', 'lincoln', 'Lincoln Continental', 'classic', '🚗', 'Lincoln_Continental'],
  ['lincoln-aviator', 'lincoln', 'Lincoln Aviator', 'suv', '🚙', 'Lincoln_Aviator'],
  // GMC
  ['gmc-sierra', 'gmc', 'GMC Sierra', 'offroad', '🛻', 'GMC_Sierra'],
  ['gmc-yukon', 'gmc', 'GMC Yukon', 'suv', '🚙', 'GMC_Yukon'],
  ['gmc-hummer-ev', 'gmc', 'GMC Hummer EV', 'electric', '⚡', 'GMC_Hummer_EV'],
  // Ram
  ['ram-1500', 'ram', 'Ram 1500', 'offroad', '🛻', 'Ram_1500'],
  ['ram-2500', 'ram', 'Ram 2500', 'offroad', '🛻', 'Ram_2500'],
  ['ram-trx', 'ram', 'Ram TRX', 'sport', '🏎️', 'Ram_TRX'],
  // Chrysler
  ['chrysler-300', 'chrysler', 'Chrysler 300', 'family', '🚗', 'Chrysler_300_(2011)'],
  ['chrysler-pacifica', 'chrysler', 'Chrysler Pacifica', 'family', '🚗', 'Chrysler_Pacifica_(minivan)'],
  // Rivian
  ['rivian-r1t', 'rivian', 'Rivian R1T', 'offroad', '⚡', 'Rivian_R1T'],
  ['rivian-r1s', 'rivian', 'Rivian R1S', 'suv', '⚡', 'Rivian_R1S'],
  // Pontiac
  ['pontiac-firebird', 'pontiac', 'Pontiac Firebird', 'sport', '🏎️', 'Pontiac_Firebird'],
  ['pontiac-gto', 'pontiac', 'Pontiac GTO', 'sport', '🏎️', 'Pontiac_GTO'],
  // Buick
  ['buick-enclave', 'buick', 'Buick Enclave', 'suv', '🚙', 'Buick_Enclave'],
  ['buick-riviera', 'buick', 'Buick Riviera', 'classic', '🚗', 'Buick_Riviera'],
  // Maserati
  ['maserati-ghibli', 'maserati', 'Maserati Ghibli', 'sport', '🏎️', 'Maserati_Ghibli_(M157)'],
  ['maserati-levante', 'maserati', 'Maserati Levante', 'suv', '🏎️', 'Maserati_Levante'],
  ['maserati-granturismo', 'maserati', 'Maserati GranTurismo', 'sport', '🏎️', 'Maserati_GranTurismo'],
  ['maserati-mc20', 'maserati', 'Maserati MC20', 'sport', '🏎️', 'Maserati_MC20'],
  // Pagani
  ['pagani-huayra', 'pagani', 'Pagani Huayra', 'sport', '🏎️', 'Pagani_Huayra'],
  ['pagani-zonda', 'pagani', 'Pagani Zonda', 'sport', '🏎️', 'Pagani_Zonda'],
  ['pagani-utopia', 'pagani', 'Pagani Utopia', 'sport', '🏎️', 'Pagani_Utopia'],
  // Lancia
  ['lancia-delta', 'lancia', 'Lancia Delta', 'sport', '🏎️', 'Lancia_Delta'],
  ['lancia-stratos', 'lancia', 'Lancia Stratos', 'sport', '🏎️', 'Lancia_Stratos'],
  ['lancia-ypsilon', 'lancia', 'Lancia Ypsilon', 'city', '🚗', 'Lancia_Ypsilon'],
  // Bugatti
  ['bugatti-chiron', 'bugatti', 'Bugatti Chiron', 'sport', '🏎️', 'Bugatti_Chiron'],
  ['bugatti-veyron', 'bugatti', 'Bugatti Veyron', 'sport', '🏎️', 'Bugatti_Veyron'],
  ['bugatti-eb110', 'bugatti', 'Bugatti EB110', 'classic', '🏎️', 'Bugatti_EB110'],
  // Alpine
  ['alpine-a110', 'alpine', 'Alpine A110', 'sport', '🏎️', 'Alpine_A110_(2017)'],
  ['alpine-a310', 'alpine', 'Alpine A310', 'classic', '🏎️', 'Alpine_A310'],
  // DS
  ['ds-3', 'ds', 'DS 3', 'city', '🚗', 'DS_3_(2019)'],
  ['ds-7', 'ds', 'DS 7', 'suv', '🚙', 'DS_7'],
  // Bentley
  ['bentley-continental-gt', 'bentley', 'Bentley Continental GT', 'sport', '🏎️', 'Bentley_Continental_GT'],
  ['bentley-bentayga', 'bentley', 'Bentley Bentayga', 'suv', '🚙', 'Bentley_Bentayga'],
  ['bentley-flying-spur', 'bentley', 'Bentley Flying Spur', 'family', '🚗', 'Bentley_Flying_Spur_(2019)'],
  // Rolls-Royce
  ['rollsroyce-phantom', 'rollsroyce', 'Rolls-Royce Phantom', 'family', '🚗', 'Rolls-Royce_Phantom_(VIII)'],
  ['rollsroyce-ghost', 'rollsroyce', 'Rolls-Royce Ghost', 'family', '🚗', 'Rolls-Royce_Ghost'],
  ['rollsroyce-cullinan', 'rollsroyce', 'Rolls-Royce Cullinan', 'suv', '🚙', 'Rolls-Royce_Cullinan'],
  // Aston Martin
  ['astonmartin-db11', 'astonmartin', 'Aston Martin DB11', 'sport', '🏎️', 'Aston_Martin_DB11'],
  ['astonmartin-vantage', 'astonmartin', 'Aston Martin Vantage', 'sport', '🏎️', 'Aston_Martin_Vantage_(2018)'],
  ['astonmartin-dbx', 'astonmartin', 'Aston Martin DBX', 'suv', '🚙', 'Aston_Martin_DBX'],
  ['astonmartin-db5', 'astonmartin', 'Aston Martin DB5', 'classic', '🏎️', 'Aston_Martin_DB5'],
  // McLaren
  ['mclaren-720s', 'mclaren', 'McLaren 720S', 'sport', '🏎️', 'McLaren_720S'],
  ['mclaren-p1', 'mclaren', 'McLaren P1', 'sport', '🏎️', 'McLaren_P1'],
  ['mclaren-f1', 'mclaren', 'McLaren F1', 'classic', '🏎️', 'McLaren_F1'],
  ['mclaren-artura', 'mclaren', 'McLaren Artura', 'sport', '🏎️', 'McLaren_Artura'],
  // Lotus
  ['lotus-emira', 'lotus', 'Lotus Emira', 'sport', '🏎️', 'Lotus_Emira'],
  ['lotus-elise', 'lotus', 'Lotus Elise', 'sport', '🏎️', 'Lotus_Elise'],
  ['lotus-esprit', 'lotus', 'Lotus Esprit', 'classic', '🏎️', 'Lotus_Esprit'],
  ['lotus-evija', 'lotus', 'Lotus Evija', 'electric', '⚡', 'Lotus_Evija'],
  // MG
  ['mg-4', 'mg', 'MG 4', 'electric', '⚡', 'MG_4'],
  ['mg-zs', 'mg', 'MG ZS', 'suv', '🚙', 'MG_ZS_(crossover)'],
  ['mg-hs', 'mg', 'MG HS', 'suv', '🚙', 'MG_HS'],
  ['mg-cyberster', 'mg', 'MG Cyberster', 'sport', '🏎️', 'MG_Cyberster'],
  // Koenigsegg
  ['koenigsegg-jesko', 'koenigsegg', 'Koenigsegg Jesko', 'sport', '🏎️', 'Koenigsegg_Jesko'],
  ['koenigsegg-gemera', 'koenigsegg', 'Koenigsegg Gemera', 'sport', '🏎️', 'Koenigsegg_Gemera'],
  ['koenigsegg-agera', 'koenigsegg', 'Koenigsegg Agera', 'sport', '🏎️', 'Koenigsegg_Agera'],
  // Polestar
  ['polestar-2', 'polestar', 'Polestar 2', 'electric', '⚡', 'Polestar_2'],
  ['polestar-3', 'polestar', 'Polestar 3', 'electric', '⚡', 'Polestar_3'],
  // Genesis
  ['genesis-g70', 'genesis', 'Genesis G70', 'sport', '🏎️', 'Genesis_G70'],
  ['genesis-g80', 'genesis', 'Genesis G80', 'family', '🚗', 'Genesis_G80'],
  ['genesis-gv60', 'genesis', 'Genesis GV60', 'electric', '⚡', 'Genesis_GV60'],
  ['genesis-gv80', 'genesis', 'Genesis GV80', 'suv', '🚙', 'Genesis_GV80'],
  // SsangYong
  ['ssangyong-rexton', 'ssangyong', 'SsangYong Rexton', 'suv', '🚙', 'SsangYong_Rexton'],
  ['ssangyong-tivoli', 'ssangyong', 'SsangYong Tivoli', 'suv', '🚙', 'SsangYong_Tivoli'],
  ['ssangyong-korando', 'ssangyong', 'SsangYong Korando', 'suv', '🚙', 'SsangYong_Korando'],
  // NIO
  ['nio-et7', 'nio', 'NIO ET7', 'electric', '⚡', 'Nio_ET7'],
  ['nio-es6', 'nio', 'NIO ES6', 'electric', '⚡', 'Nio_ES6'],
  ['nio-ep9', 'nio', 'NIO EP9', 'sport', '⚡', 'Nio_EP9'],
  // Geely
  ['geely-coolray', 'geely', 'Geely Coolray', 'suv', '🚙', 'Geely_Binyue'],
  ['geely-atlas', 'geely', 'Geely Atlas', 'suv', '🚙', 'Geely_Boyue'],
  // Great Wall
  ['greatwall-tank500', 'greatwall', 'Tank 500', 'suv', '🚙', 'Tank_500'],
  ['greatwall-haval-jolion', 'greatwall', 'Haval Jolion', 'suv', '🚙', 'Haval_Jolion'],
  // Chery
  ['chery-tiggo7', 'chery', 'Chery Tiggo 7', 'suv', '🚙', 'Chery_Tiggo_7'],
  ['chery-omoda5', 'chery', 'Chery Omoda 5', 'suv', '🚙', 'Chery_Omoda_5'],
  // Tata
  ['tata-nexon', 'tata', 'Tata Nexon', 'suv', '🚙', 'Tata_Nexon'],
  ['tata-harrier', 'tata', 'Tata Harrier', 'suv', '🚙', 'Tata_Harrier'],
  ['tata-punch', 'tata', 'Tata Punch', 'suv', '🚙', 'Tata_Punch'],
  ['tata-safari', 'tata', 'Tata Safari', 'offroad', '🚙', 'Tata_Safari'],
  // Mahindra
  ['mahindra-xuv700', 'mahindra', 'Mahindra XUV700', 'suv', '🚙', 'Mahindra_XUV700'],
  ['mahindra-thar', 'mahindra', 'Mahindra Thar', 'offroad', '🚙', 'Mahindra_Thar'],
  ['mahindra-scorpio', 'mahindra', 'Mahindra Scorpio', 'offroad', '🚙', 'Mahindra_Scorpio'],
  // Proton
  ['proton-saga', 'proton', 'Proton Saga', 'family', '🚗', 'Proton_Saga'],
  ['proton-x50', 'proton', 'Proton X50', 'suv', '🚙', 'Proton_X50'],
  ['proton-x70', 'proton', 'Proton X70', 'suv', '🚙', 'Proton_X70'],
  // Lada
  ['lada-vesta', 'lada', 'Lada Vesta', 'family', '🚗', 'Lada_Vesta'],
  ['lada-niva', 'lada', 'Lada Niva', 'offroad', '🚙', 'Lada_Niva'],
  ['lada-granta', 'lada', 'Lada Granta', 'family', '🚗', 'Lada_Granta'],
  // Cupra
  ['cupra-formentor', 'cupra', 'Cupra Formentor', 'sport', '🏎️', 'Cupra_Formentor'],
  ['cupra-born', 'cupra', 'Cupra Born', 'electric', '⚡', 'Cupra_Born'],
  ['cupra-leon', 'cupra', 'Cupra León', 'sport', '🏎️', 'Cupra_León'],
];

// ── HELPERS ─────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function batchFetchWikiImages(wikiTitles, size = 400) {
  const result = new Map(); // wikiTitle -> imageUrl
  const BATCH_SIZE = 50;

  for (let i = 0; i < wikiTitles.length; i += BATCH_SIZE) {
    const batch = wikiTitles.slice(i, i + BATCH_SIZE);
    const titles = batch.join('|');
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=pageimages&format=json&pithumbsize=${size}&redirects=1&origin=*`;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const resp = await fetch(url, {
          headers: { 'User-Agent': 'KubaGeoCars/1.0 (educational app; geocars@example.com)' },
        });
        if (!resp.ok) { await sleep(2000); continue; }
        const data = await resp.json();
        const pages = data?.query?.pages || {};

        // Build reverse mapping: final title → original query title
        const normalizeMap = {};
        for (const n of data?.query?.normalized || []) {
          normalizeMap[n.to] = n.from; // normalized title → original query
        }
        const redirectMap = {};
        for (const r of data?.query?.redirects || []) {
          redirectMap[r.to] = r.from; // redirect target → redirect source
        }

        for (const page of Object.values(pages)) {
          if (page.thumbnail?.source) {
            // Walk back: final title → redirect source → normalized source → original query
            let title = page.title;
            if (redirectMap[title]) title = redirectMap[title];
            if (normalizeMap[title]) title = normalizeMap[title];
            const origTitle = title.replace(/ /g, '_');
            result.set(origTitle, page.thumbnail.source);
          }
        }
        break;
      } catch (err) {
        console.error(`  Batch error: ${err.message}`);
        await sleep(2000);
      }
    }

    if (i + BATCH_SIZE < wikiTitles.length) {
      process.stdout.write(`  Queried ${Math.min(i + BATCH_SIZE, wikiTitles.length)}/${wikiTitles.length}\n`);
      await sleep(500);
    }
  }

  return result;
}

/**
 * Fallback: for wiki titles without pageimage, search page images for logos/photos.
 * Returns Map of wikiTitle -> imageUrl for titles that were missing.
 */
async function fallbackFetchImages(missingTitles, size = 400) {
  const result = new Map();
  const UA = 'KubaGeoCars/1.0 (educational app; geocars@example.com)';

  for (const wikiTitle of missingTitles) {
    try {
      // Get list of all images on the page
      const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=images&imlimit=30&format=json&redirects=1&origin=*`;
      const resp = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!resp.ok) { await sleep(500); continue; }
      const data = await resp.json();
      const pages = data?.query?.pages || {};

      let bestFile = null;
      for (const page of Object.values(pages)) {
        const images = (page.images || []).map(i => i.title);
        const brand = wikiTitle.split('_')[0].split('(')[0].trim().toLowerCase();

        // Priority 1: logo SVG with brand name
        bestFile = images.find(f => {
          const fl = f.toLowerCase();
          return fl.includes('logo') && fl.includes('.svg') && fl.includes(brand);
        });
        // Priority 2: any logo SVG
        if (!bestFile) bestFile = images.find(f => {
          const fl = f.toLowerCase();
          return fl.includes('logo') && fl.endsWith('.svg');
        });
        // Priority 3: SVG with brand name (often the logo)
        if (!bestFile) bestFile = images.find(f => {
          const fl = f.toLowerCase();
          return fl.includes(brand) && fl.endsWith('.svg') && !fl.includes('flag') && !fl.includes('commons');
        });
        // Priority 4: any image with brand name (JPG/PNG - good for car models)
        if (!bestFile) bestFile = images.find(f => {
          const fl = f.toLowerCase();
          return fl.includes(brand) && (fl.endsWith('.jpg') || fl.endsWith('.png')) && !fl.includes('flag');
        });
      }

      if (bestFile) {
        // Get actual image URL from Commons
        const fileUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(bestFile)}&prop=imageinfo&iiprop=url&iiurlwidth=${size}&format=json&origin=*`;
        const fileResp = await fetch(fileUrl, { headers: { 'User-Agent': UA } });
        if (fileResp.ok) {
          const fileData = await fileResp.json();
          const filePages = fileData?.query?.pages || {};
          for (const fp of Object.values(filePages)) {
            const thumbUrl = fp.imageinfo?.[0]?.thumburl || fp.imageinfo?.[0]?.url;
            if (thumbUrl) {
              result.set(wikiTitle, thumbUrl);
              process.stdout.write('+');
            }
          }
        }
      } else {
        process.stdout.write('-');
      }

      await sleep(500);
    } catch {
      process.stdout.write('!');
      await sleep(500);
    }
  }

  return result;
}

function downloadImage(imageUrl, destPath) {
  if (existsSync(destPath)) return true;
  try {
    execSync(
      `curl -sS -L -f -o "${destPath}" -H "User-Agent: KubaGeoCars/1.0 (educational app)" "${imageUrl}"`,
      { timeout: 30000, stdio: 'pipe' }
    );
    // Verify file is valid (>500 bytes)
    if (existsSync(destPath)) {
      const size = statSync(destPath).size;
      if (size < 500) {
        execSync(`rm "${destPath}"`, { stdio: 'pipe' });
        return false;
      }
      return true;
    }
    return false;
  } catch {
    // Clean up partial file
    try { execSync(`rm -f "${destPath}"`, { stdio: 'pipe' }); } catch {}
    return false;
  }
}

// ── MAIN ────────────────────────────────────────────────

async function main() {
  console.log('Reading existing cars.json...');
  const existing = JSON.parse(await readFile(JSON_PATH, 'utf-8'));
  const existingIds = new Set(existing.entities.map((e) => e.id));

  await mkdir(LOGOS_DIR, { recursive: true });
  await mkdir(CARS_DIR, { recursive: true });

  // ── Build new entities ──
  const newBrandEntities = [];
  for (const [id, name, country, category, emoji] of NEW_BRANDS) {
    const entityId = `car:${id}`;
    if (existingIds.has(entityId)) continue;
    newBrandEntities.push({
      id: entityId, kind: 'car_brand', titlePl: name,
      media: { emoji, iconUrl: `images/logos/${id}.png` },
      tags: ['cars'],
      relations: [
        { type: 'origin_country', target: `country:${country}` },
        { type: 'category', value: category },
        { type: 'examples', value: [] },
      ],
    });
  }

  const newModelEntities = [];
  for (const [id, brandId, name, category, emoji] of ALL_NEW_MODELS) {
    const entityId = `model:${id}`;
    if (existingIds.has(entityId)) continue;
    newModelEntities.push({
      id: entityId, kind: 'car_model', titlePl: name,
      media: { emoji, iconUrl: `images/cars/${id}.png` },
      tags: ['cars', category],
      relations: [
        { type: 'brand', target: `car:${brandId}` },
        { type: 'category', value: category },
      ],
    });
  }

  // Update examples for new brands
  for (const brand of newBrandEntities) {
    const brandId = brand.id.replace('car:', '');
    const models = ALL_NEW_MODELS
      .filter(([, bid]) => bid === brandId)
      .map(([, , name]) => {
        const prefix = brand.titlePl + ' ';
        return name.startsWith(prefix) ? name.slice(prefix.length) : name;
      });
    const exRel = brand.relations.find((r) => r.type === 'examples');
    if (exRel) exRel.value = models.slice(0, 3);
  }

  console.log(`New brands: ${newBrandEntities.length}`);
  console.log(`New models: ${newModelEntities.length}`);

  // ── Batch query Wikipedia for image URLs ──
  console.log('\nQuerying Wikipedia for image URLs (batch mode)...');

  const brandWikiTitles = NEW_BRANDS.map(([, , , , , wiki]) => wiki);
  const modelWikiTitles = ALL_NEW_MODELS.map(([, , , , , wiki]) => wiki);

  const allWikiTitles = [...brandWikiTitles, ...modelWikiTitles];
  const imageUrlMap = await batchFetchWikiImages(allWikiTitles, 400);
  console.log(`\nFound ${imageUrlMap.size}/${allWikiTitles.length} image URLs from Wikipedia`);

  // ── Fallback for missing images ──
  const missingBrands = brandWikiTitles.filter(t => !imageUrlMap.has(t));
  const missingModels = modelWikiTitles.filter(t => !imageUrlMap.has(t));
  console.log(`Missing: ${missingBrands.length} brands, ${missingModels.length} models`);

  if (missingBrands.length + missingModels.length > 0) {
    console.log('\nFallback: searching page images for missing entries...');
    const fallbackBrands = await fallbackFetchImages(missingBrands, 400);
    console.log(`\nFallback brands: ${fallbackBrands.size}/${missingBrands.length}`);

    const fallbackModels = await fallbackFetchImages(missingModels.slice(0, 100), 400);
    console.log(`\nFallback models: ${fallbackModels.size}/${Math.min(missingModels.length, 100)}`);

    // Merge fallback into main map
    for (const [k, v] of fallbackBrands) imageUrlMap.set(k, v);
    for (const [k, v] of fallbackModels) imageUrlMap.set(k, v);
    console.log(`Total URLs after fallback: ${imageUrlMap.size}`);
  }

  // ── Download images (using curl) ──
  console.log('\nDownloading brand logos...');
  let logoOk = 0, logoSkip = 0;
  for (const [id, , , , , wiki] of NEW_BRANDS) {
    const dest = join(LOGOS_DIR, `${id}.png`);
    if (existsSync(dest)) { logoSkip++; continue; }
    const imgUrl = imageUrlMap.get(wiki);
    if (!imgUrl) { process.stdout.write('x'); continue; }
    const ok = downloadImage(imgUrl, dest);
    process.stdout.write(ok ? '✓' : 'x');
    if (ok) logoOk++;
    await sleep(300);
  }
  console.log(`\nLogos: ${logoOk} new + ${logoSkip} existing = ${logoOk + logoSkip} total`);

  console.log('\nDownloading car model images...');
  let modelOk = 0, modelSkip = 0;
  for (const [id, , , , , wiki] of ALL_NEW_MODELS) {
    const dest = join(CARS_DIR, `${id}.png`);
    if (existsSync(dest)) { modelSkip++; continue; }
    const imgUrl = imageUrlMap.get(wiki);
    if (!imgUrl) { process.stdout.write('x'); continue; }
    const ok = downloadImage(imgUrl, dest);
    process.stdout.write(ok ? '✓' : 'x');
    if (ok) modelOk++;
    await sleep(300);
  }
  console.log(`\nModels: ${modelOk} new + ${modelSkip} existing = ${modelOk + modelSkip} total`);

  // ── Filter entities to only those with images ──
  const finalBrands = newBrandEntities.filter((e) => {
    const f = e.media.iconUrl.split('/').pop();
    return existsSync(join(LOGOS_DIR, f));
  });
  const finalModels = newModelEntities.filter((e) => {
    const f = e.media.iconUrl.split('/').pop();
    return existsSync(join(CARS_DIR, f));
  });

  console.log(`\nBrands with images: ${finalBrands.length}/${newBrandEntities.length}`);
  console.log(`Models with images: ${finalModels.length}/${newModelEntities.length}`);

  // ── Merge and write ──
  // Reset to ORIGINAL cars.json (remove previous run's additions)
  const origEntities = existing.entities.filter((e) => {
    // Keep only entities that were in the original set OR are from this run
    return !e.id.startsWith('model:') || existingIds.has(e.id);
  });
  // Actually, just re-read the ORIGINAL file
  existing.entities = [...existing.entities.filter(e => existingIds.has(e.id) || (!e.id.startsWith('car:') && !e.id.startsWith('model:'))), ...finalBrands, ...finalModels];

  await writeFile(JSON_PATH, JSON.stringify(existing));
  console.log(`\nFinal cars.json: ${existing.entities.length} entities`);
  console.log('Done!');
}

main().catch((err) => { console.error(err); process.exit(1); });
