#!/usr/bin/env node
/**
 * Second expansion: add ~600 more car models to reach 1000 total entities.
 * Downloads images from Wikipedia using curl.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = new URL('..', import.meta.url).pathname;
const CARS_DIR = join(ROOT, 'public/images/cars');
const JSON_PATH = join(ROOT, 'public/data/packs/cars.json');

// ── MORE MODELS (wave 2) ──
// [id, brandId, titlePl, category, emoji, wikiTitle]
const WAVE2_MODELS = [
  // Toyota (more classics & popular)
  ['toyota-86', 'toyota', 'Toyota 86', 'sport', '🏎️', 'Toyota_86'],
  ['toyota-prius', 'toyota', 'Toyota Prius', 'electric', '⚡', 'Toyota_Prius'],
  ['toyota-fortuner', 'toyota', 'Toyota Fortuner', 'suv', '🚙', 'Toyota_Fortuner'],
  ['toyota-tundra', 'toyota', 'Toyota Tundra', 'offroad', '🛻', 'Toyota_Tundra'],
  ['toyota-avalon', 'toyota', 'Toyota Avalon', 'family', '🚗', 'Toyota_Avalon'],
  ['toyota-celica', 'toyota', 'Toyota Celica', 'sport', '🏎️', 'Toyota_Celica'],
  ['toyota-mr2', 'toyota', 'Toyota MR2', 'sport', '🏎️', 'Toyota_MR2'],
  ['toyota-highlander', 'toyota', 'Toyota Highlander', 'suv', '🚙', 'Toyota_Highlander'],
  // Honda
  ['honda-pilot', 'honda', 'Honda Pilot', 'suv', '🚙', 'Honda_Pilot'],
  ['honda-city', 'honda', 'Honda City', 'city', '🚗', 'Honda_City'],
  ['honda-ridgeline', 'honda', 'Honda Ridgeline', 'offroad', '🛻', 'Honda_Ridgeline'],
  ['honda-del-sol', 'honda', 'Honda Del Sol', 'sport', '🏎️', 'Honda_CR-X_del_Sol'],
  ['honda-prelude', 'honda', 'Honda Prelude', 'sport', '🏎️', 'Honda_Prelude'],
  // Nissan
  ['nissan-altima', 'nissan', 'Nissan Altima', 'family', '🚗', 'Nissan_Altima'],
  ['nissan-pathfinder', 'nissan', 'Nissan Pathfinder', 'suv', '🚙', 'Nissan_Pathfinder'],
  ['nissan-titan', 'nissan', 'Nissan Titan', 'offroad', '🛻', 'Nissan_Titan'],
  ['nissan-micra', 'nissan', 'Nissan Micra', 'city', '🚗', 'Nissan_Micra'],
  ['nissan-ariya', 'nissan', 'Nissan Ariya', 'electric', '⚡', 'Nissan_Ariya'],
  ['nissan-z', 'nissan', 'Nissan Z', 'sport', '🏎️', 'Nissan_Z_(RZ34)'],
  ['nissan-skyline', 'nissan', 'Nissan Skyline', 'sport', '🏎️', 'Nissan_Skyline'],
  // BMW
  ['bmw-7series', 'bmw', 'BMW Seria 7', 'family', '🚗', 'BMW_7_Series'],
  ['bmw-x1', 'bmw', 'BMW X1', 'suv', '🚙', 'BMW_X1'],
  ['bmw-x7', 'bmw', 'BMW X7', 'suv', '🚙', 'BMW_X7_(G07)'],
  ['bmw-m2', 'bmw', 'BMW M2', 'sport', '🏎️', 'BMW_M2'],
  ['bmw-ix', 'bmw', 'BMW iX', 'electric', '⚡', 'BMW_iX'],
  ['bmw-2002', 'bmw', 'BMW 2002', 'classic', '🚗', 'BMW_02_Series'],
  ['bmw-1series', 'bmw', 'BMW Seria 1', 'city', '🚗', 'BMW_1_Series'],
  // Mercedes
  ['mercedes-a-class', 'mercedes', 'Mercedes Klasa A', 'city', '🚗', 'Mercedes-Benz_A-Class'],
  ['mercedes-c-class', 'mercedes', 'Mercedes Klasa C', 'family', '🚗', 'Mercedes-Benz_C-Class'],
  ['mercedes-e-class', 'mercedes', 'Mercedes Klasa E', 'family', '🚗', 'Mercedes-Benz_E-Class'],
  ['mercedes-glb', 'mercedes', 'Mercedes GLB', 'suv', '🚙', 'Mercedes-Benz_GLB-Class'],
  ['mercedes-eqe', 'mercedes', 'Mercedes EQE', 'electric', '⚡', 'Mercedes-Benz_EQE'],
  ['mercedes-maybach', 'mercedes', 'Mercedes-Maybach S', 'premium', '🚗', 'Mercedes-Maybach_S-Class'],
  ['mercedes-300sl', 'mercedes', 'Mercedes 300 SL', 'classic', '🏎️', 'Mercedes-Benz_300_SL'],
  // Volkswagen
  ['vw-polo', 'volkswagen', 'Volkswagen Polo', 'city', '🚗', 'Volkswagen_Polo'],
  ['vw-arteon', 'volkswagen', 'Volkswagen Arteon', 'family', '🚗', 'Volkswagen_Arteon'],
  ['vw-taos', 'volkswagen', 'Volkswagen Taos', 'suv', '🚙', 'Volkswagen_Taos'],
  ['vw-id3', 'volkswagen', 'Volkswagen ID.3', 'electric', '⚡', 'Volkswagen_ID.3'],
  ['vw-scirocco', 'volkswagen', 'Volkswagen Scirocco', 'sport', '🏎️', 'Volkswagen_Scirocco'],
  ['vw-transporter', 'volkswagen', 'Volkswagen Transporter', 'family', '🚗', 'Volkswagen_Transporter_(T6)'],
  // Audi
  ['audi-a3', 'audi', 'Audi A3', 'city', '🚗', 'Audi_A3'],
  ['audi-a8', 'audi', 'Audi A8', 'premium', '🚗', 'Audi_A8'],
  ['audi-q3', 'audi', 'Audi Q3', 'suv', '🚙', 'Audi_Q3'],
  ['audi-q8', 'audi', 'Audi Q8', 'suv', '🚙', 'Audi_Q8'],
  ['audi-etron', 'audi', 'Audi e-tron', 'electric', '⚡', 'Audi_e-tron_(2018)'],
  ['audi-s5', 'audi', 'Audi S5', 'sport', '🏎️', 'Audi_A5'],
  // Porsche
  ['porsche-gt3', 'porsche', 'Porsche 911 GT3', 'sport', '🏎️', 'Porsche_911_GT3'],
  ['porsche-carrera-gt', 'porsche', 'Porsche Carrera GT', 'sport', '🏎️', 'Porsche_Carrera_GT'],
  ['porsche-918', 'porsche', 'Porsche 918 Spyder', 'sport', '🏎️', 'Porsche_918'],
  ['porsche-944', 'porsche', 'Porsche 944', 'classic', '🏎️', 'Porsche_944'],
  ['porsche-928', 'porsche', 'Porsche 928', 'classic', '🏎️', 'Porsche_928'],
  // Ford
  ['ford-escape', 'ford', 'Ford Escape', 'suv', '🚙', 'Ford_Escape'],
  ['ford-maverick', 'ford', 'Ford Maverick', 'offroad', '🛻', 'Ford_Maverick_(2022)'],
  ['ford-edge', 'ford', 'Ford Edge', 'suv', '🚙', 'Ford_Edge'],
  ['ford-fiesta', 'ford', 'Ford Fiesta', 'city', '🚗', 'Ford_Fiesta'],
  ['ford-mondeo', 'ford', 'Ford Mondeo', 'family', '🚗', 'Ford_Mondeo'],
  ['ford-gt40', 'ford', 'Ford GT40', 'classic', '🏎️', 'Ford_GT40'],
  // Chevrolet
  ['chevrolet-equinox', 'chevrolet', 'Chevrolet Equinox', 'suv', '🚙', 'Chevrolet_Equinox'],
  ['chevrolet-malibu', 'chevrolet', 'Chevrolet Malibu', 'family', '🚗', 'Chevrolet_Malibu'],
  ['chevrolet-trax', 'chevrolet', 'Chevrolet Trax', 'suv', '🚙', 'Chevrolet_Trax'],
  ['chevrolet-colorado', 'chevrolet', 'Chevrolet Colorado', 'offroad', '🛻', 'Chevrolet_Colorado'],
  ['chevrolet-bel-air', 'chevrolet', 'Chevrolet Bel Air', 'classic', '🚗', 'Chevrolet_Bel_Air'],
  ['chevrolet-el-camino', 'chevrolet', 'Chevrolet El Camino', 'classic', '🛻', 'Chevrolet_El_Camino'],
  // Hyundai
  ['hyundai-elantra', 'hyundai', 'Hyundai Elantra', 'family', '🚗', 'Hyundai_Elantra'],
  ['hyundai-venue', 'hyundai', 'Hyundai Venue', 'city', '🚗', 'Hyundai_Venue'],
  ['hyundai-palisade', 'hyundai', 'Hyundai Palisade', 'suv', '🚙', 'Hyundai_Palisade'],
  ['hyundai-sonata', 'hyundai', 'Hyundai Sonata', 'family', '🚗', 'Hyundai_Sonata'],
  ['hyundai-n-vision', 'hyundai', 'Hyundai IONIQ 5 N', 'sport', '⚡', 'Hyundai_Ioniq_5'],
  // Kia
  ['kia-carnival', 'kia', 'Kia Carnival', 'family', '🚗', 'Kia_Carnival'],
  ['kia-soul', 'kia', 'Kia Soul', 'city', '🚗', 'Kia_Soul'],
  ['kia-seltos', 'kia', 'Kia Seltos', 'suv', '🚙', 'Kia_Seltos'],
  ['kia-telluride', 'kia', 'Kia Telluride', 'suv', '🚙', 'Kia_Telluride'],
  ['kia-forte', 'kia', 'Kia Forte', 'family', '🚗', 'Kia_Forte'],
  // Renault
  ['renault-kangoo', 'renault', 'Renault Kangoo', 'family', '🚗', 'Renault_Kangoo'],
  ['renault-koleos', 'renault', 'Renault Koleos', 'suv', '🚙', 'Renault_Koleos'],
  ['renault-twizy', 'renault', 'Renault Twizy', 'electric', '⚡', 'Renault_Twizy'],
  ['renault-twingo', 'renault', 'Renault Twingo', 'city', '🚗', 'Renault_Twingo'],
  ['renault-4', 'renault', 'Renault 4', 'classic', '🚗', 'Renault_4'],
  // Peugeot
  ['peugeot-108', 'peugeot', 'Peugeot 108', 'city', '🚗', 'Peugeot_108'],
  ['peugeot-e-208', 'peugeot', 'Peugeot e-208', 'electric', '⚡', 'Peugeot_208'],
  ['peugeot-4008', 'peugeot', 'Peugeot 4008', 'suv', '🚙', 'Peugeot_4008'],
  ['peugeot-rcz', 'peugeot', 'Peugeot RCZ', 'sport', '🏎️', 'Peugeot_RCZ'],
  ['peugeot-504', 'peugeot', 'Peugeot 504', 'classic', '🚗', 'Peugeot_504'],
  // Ferrari
  ['ferrari-812', 'ferrari', 'Ferrari 812 Superfast', 'sport', '🏎️', 'Ferrari_812_Superfast'],
  ['ferrari-488', 'ferrari', 'Ferrari 488', 'sport', '🏎️', 'Ferrari_488'],
  ['ferrari-458', 'ferrari', 'Ferrari 458', 'sport', '🏎️', 'Ferrari_458'],
  ['ferrari-599', 'ferrari', 'Ferrari 599', 'sport', '🏎️', 'Ferrari_599_GTB_Fiorano'],
  ['ferrari-f50', 'ferrari', 'Ferrari F50', 'sport', '🏎️', 'Ferrari_F50'],
  ['ferrari-enzo', 'ferrari', 'Ferrari Enzo', 'sport', '🏎️', 'Enzo_Ferrari_(automobile)'],
  // Lamborghini
  ['lamborghini-sian', 'lamborghini', 'Lamborghini Sián', 'sport', '🏎️', 'Lamborghini_Sián_FKP_37'],
  ['lamborghini-veneno', 'lamborghini', 'Lamborghini Veneno', 'sport', '🏎️', 'Lamborghini_Veneno'],
  ['lamborghini-murcielago', 'lamborghini', 'Lamborghini Murciélago', 'sport', '🏎️', 'Lamborghini_Murciélago'],
  ['lamborghini-miura', 'lamborghini', 'Lamborghini Miura', 'classic', '🏎️', 'Lamborghini_Miura'],
  ['lamborghini-centenario', 'lamborghini', 'Lamborghini Centenario', 'sport', '🏎️', 'Lamborghini_Centenario'],
  // Fiat
  ['fiat-600', 'fiat', 'Fiat 600', 'classic', '🚗', 'Fiat_600'],
  ['fiat-multipla', 'fiat', 'Fiat Multipla', 'family', '🚗', 'Fiat_Multipla'],
  ['fiat-x19', 'fiat', 'Fiat X1/9', 'sport', '🏎️', 'Fiat_X1/9'],
  ['fiat-topolino', 'fiat', 'Fiat Topolino', 'electric', '⚡', 'Fiat_Topolino_(2023)'],
  // Volvo
  ['volvo-xc70', 'volvo', 'Volvo XC70', 'suv', '🚙', 'Volvo_XC70'],
  ['volvo-s90', 'volvo', 'Volvo S90', 'premium', '🚗', 'Volvo_S90_(2016)'],
  ['volvo-v90', 'volvo', 'Volvo V90', 'family', '🚗', 'Volvo_V90'],
  ['volvo-ex30', 'volvo', 'Volvo EX30', 'electric', '⚡', 'Volvo_EX30'],
  ['volvo-240', 'volvo', 'Volvo 240', 'classic', '🚗', 'Volvo_240'],
  ['volvo-amazon', 'volvo', 'Volvo Amazon', 'classic', '🚗', 'Volvo_Amazon'],
  // Mazda
  ['mazda-2', 'mazda', 'Mazda 2', 'city', '🚗', 'Mazda2'],
  ['mazda-cx3', 'mazda', 'Mazda CX-3', 'suv', '🚙', 'Mazda_CX-3'],
  ['mazda-cx9', 'mazda', 'Mazda CX-9', 'suv', '🚙', 'Mazda_CX-9'],
  ['mazda-rx8', 'mazda', 'Mazda RX-8', 'sport', '🏎️', 'Mazda_RX-8'],
  ['mazda-cosmo', 'mazda', 'Mazda Cosmo', 'classic', '🏎️', 'Mazda_Cosmo'],
  // Jeep
  ['jeep-avenger', 'jeep', 'Jeep Avenger', 'suv', '🚙', 'Jeep_Avenger'],
  ['jeep-liberty', 'jeep', 'Jeep Liberty', 'suv', '🚙', 'Jeep_Liberty'],
  ['jeep-patriot', 'jeep', 'Jeep Patriot', 'suv', '🚙', 'Jeep_Patriot'],
  // Dodge
  ['dodge-ram', 'dodge', 'Dodge RAM', 'offroad', '🛻', 'Dodge_Ram'],
  ['dodge-dart', 'dodge', 'Dodge Dart', 'family', '🚗', 'Dodge_Dart_(PF)'],
  ['dodge-nitro', 'dodge', 'Dodge Nitro', 'suv', '🚙', 'Dodge_Nitro'],
  ['dodge-demon', 'dodge', 'Dodge Demon', 'sport', '🏎️', 'Dodge_Challenger_SRT_Demon'],
  // Tesla
  ['tesla-semi', 'tesla', 'Tesla Semi', 'offroad', '⚡', 'Tesla_Semi'],
  ['tesla-model-3-highland', 'tesla', 'Tesla Model 3 Highland', 'electric', '⚡', 'Tesla_Model_3'],
  // Jaguar
  ['jaguar-xj', 'jaguar', 'Jaguar XJ', 'premium', '🚗', 'Jaguar_XJ'],
  ['jaguar-f-pace-svr', 'jaguar', 'Jaguar F-Pace SVR', 'sport', '🏎️', 'Jaguar_F-Pace'],
  ['jaguar-xk', 'jaguar', 'Jaguar XK', 'sport', '🏎️', 'Jaguar_XK_(X150)'],
  // Land Rover
  ['land-rover-freelander', 'landrover', 'Land Rover Freelander', 'suv', '🚙', 'Land_Rover_Freelander'],
  ['land-rover-discovery-sport', 'landrover', 'Discovery Sport', 'suv', '🚙', 'Land_Rover_Discovery_Sport'],
  // Škoda
  ['skoda-rapid', 'skoda', 'Škoda Rapid', 'family', '🚗', 'Škoda_Rapid_(2012)'],
  ['skoda-citigo', 'skoda', 'Škoda Citigo', 'city', '🚗', 'Škoda_Citigo'],
  ['skoda-karoq', 'skoda', 'Škoda Karoq', 'suv', '🚙', 'Škoda_Karoq'],
  ['skoda-felicia', 'skoda', 'Škoda Felicia', 'classic', '🚗', 'Škoda_Felicia'],
  // Opel
  ['opel-zafira', 'opel', 'Opel Zafira', 'family', '🚗', 'Opel_Zafira'],
  ['opel-adam', 'opel', 'Opel Adam', 'city', '🚗', 'Opel_Adam'],
  ['opel-manta', 'opel', 'Opel Manta', 'classic', '🏎️', 'Opel_Manta'],
  ['opel-gt', 'opel', 'Opel GT', 'sport', '🏎️', 'Opel_GT'],
  ['opel-combo', 'opel', 'Opel Combo', 'family', '🚗', 'Opel_Combo'],
  // Citroën
  ['citroen-c1', 'citroen', 'Citroën C1', 'city', '🚗', 'Citroën_C1'],
  ['citroen-sm', 'citroen', 'Citroën SM', 'classic', '🏎️', 'Citroën_SM'],
  ['citroen-cx', 'citroen', 'Citroën CX', 'classic', '🚗', 'Citroën_CX'],
  ['citroen-mehari', 'citroen', 'Citroën Méhari', 'offroad', '🚙', 'Citroën_Méhari'],
  // SEAT
  ['seat-tarraco', 'seat', 'SEAT Tarraco', 'suv', '🚙', 'SEAT_Tarraco'],
  ['seat-mii', 'seat', 'SEAT Mii', 'city', '🚗', 'SEAT_Mii'],
  // Dacia
  ['dacia-dokker', 'dacia', 'Dacia Dokker', 'family', '🚗', 'Dacia_Dokker'],
  ['dacia-lodgy', 'dacia', 'Dacia Lodgy', 'family', '🚗', 'Dacia_Lodgy'],
  // Alfa Romeo
  ['alfa-romeo-giulietta', 'alfaromeo', 'Alfa Romeo Giulietta', 'family', '🚗', 'Alfa_Romeo_Giulietta_(2010)'],
  ['alfa-romeo-montreal', 'alfaromeo', 'Alfa Romeo Montreal', 'classic', '🏎️', 'Alfa_Romeo_Montreal'],
  ['alfa-romeo-8c', 'alfaromeo', 'Alfa Romeo 8C', 'sport', '🏎️', 'Alfa_Romeo_8C_Competizione'],
  ['alfa-romeo-brera', 'alfaromeo', 'Alfa Romeo Brera', 'sport', '🏎️', 'Alfa_Romeo_Brera_and_Spider'],
  // BYD
  ['byd-song', 'byd', 'BYD Song', 'suv', '⚡', 'BYD_Song'],
  ['byd-yuan', 'byd', 'BYD Yuan Plus', 'suv', '⚡', 'BYD_Yuan_Plus'],
  ['byd-qin', 'byd', 'BYD Qin', 'family', '⚡', 'BYD_Qin'],
  // Suzuki
  ['suzuki-alto', 'suzuki', 'Suzuki Alto', 'city', '🚗', 'Suzuki_Alto'],
  ['suzuki-baleno', 'suzuki', 'Suzuki Baleno', 'family', '🚗', 'Suzuki_Baleno'],
  ['suzuki-samurai', 'suzuki', 'Suzuki Samurai', 'offroad', '🚙', 'Suzuki_Samurai'],
  ['suzuki-cappuccino', 'suzuki', 'Suzuki Cappuccino', 'sport', '🏎️', 'Suzuki_Cappuccino'],
  // Lexus
  ['lexus-gx', 'lexus', 'Lexus GX', 'suv', '🚙', 'Lexus_GX'],
  ['lexus-rc', 'lexus', 'Lexus RC', 'sport', '🏎️', 'Lexus_RC'],
  ['lexus-ls', 'lexus', 'Lexus LS', 'premium', '🚗', 'Lexus_LS'],
  ['lexus-rz', 'lexus', 'Lexus RZ', 'electric', '⚡', 'Lexus_RZ'],
  // Subaru
  ['subaru-xv', 'subaru', 'Subaru XV', 'suv', '🚙', 'Subaru_XV'],
  ['subaru-levorg', 'subaru', 'Subaru Levorg', 'family', '🚗', 'Subaru_Levorg'],
  ['subaru-solterra', 'subaru', 'Subaru Solterra', 'electric', '⚡', 'Subaru_Solterra'],
  ['subaru-legacy', 'subaru', 'Subaru Legacy', 'family', '🚗', 'Subaru_Legacy'],
  // Mitsubishi
  ['mitsubishi-asx', 'mitsubishi', 'Mitsubishi ASX', 'suv', '🚙', 'Mitsubishi_ASX'],
  ['mitsubishi-space-star', 'mitsubishi', 'Mitsubishi Space Star', 'city', '🚗', 'Mitsubishi_Mirage'],
  ['mitsubishi-3000gt', 'mitsubishi', 'Mitsubishi 3000GT', 'sport', '🏎️', 'Mitsubishi_3000GT'],
  // MINI
  ['mini-electric', 'mini', 'MINI Electric', 'electric', '⚡', 'Mini_Electric'],
  ['mini-paceman', 'mini', 'MINI Paceman', 'suv', '🚙', 'Mini_Paceman'],
  // Cadillac
  ['cadillac-xt5', 'cadillac', 'Cadillac XT5', 'suv', '🚙', 'Cadillac_XT5'],
  ['cadillac-ct4', 'cadillac', 'Cadillac CT4', 'sport', '🏎️', 'Cadillac_CT4'],
  ['cadillac-eldorado', 'cadillac', 'Cadillac Eldorado', 'classic', '🚗', 'Cadillac_Eldorado'],
  // Maserati
  ['maserati-grecale', 'maserati', 'Maserati Grecale', 'suv', '🏎️', 'Maserati_Grecale'],
  ['maserati-quattroporte', 'maserati', 'Maserati Quattroporte', 'premium', '🏎️', 'Maserati_Quattroporte'],
  // Bugatti
  ['bugatti-divo', 'bugatti', 'Bugatti Divo', 'sport', '🏎️', 'Bugatti_Divo'],
  ['bugatti-bolide', 'bugatti', 'Bugatti Bolide', 'sport', '🏎️', 'Bugatti_Bolide'],
  // Bentley
  ['bentley-arnage', 'bentley', 'Bentley Arnage', 'classic', '🚗', 'Bentley_Arnage'],
  ['bentley-mulsanne', 'bentley', 'Bentley Mulsanne', 'premium', '🚗', 'Bentley_Mulsanne_(2010)'],
  // Rolls-Royce
  ['rollsroyce-wraith', 'rollsroyce', 'Rolls-Royce Wraith', 'sport', '🚗', 'Rolls-Royce_Wraith_(2013)'],
  ['rollsroyce-dawn', 'rollsroyce', 'Rolls-Royce Dawn', 'sport', '🚗', 'Rolls-Royce_Dawn_(2015)'],
  ['rollsroyce-spectre', 'rollsroyce', 'Rolls-Royce Spectre', 'electric', '⚡', 'Rolls-Royce_Spectre'],
  ['rollsroyce-silver-shadow', 'rollsroyce', 'Rolls-Royce Silver Shadow', 'classic', '🚗', 'Rolls-Royce_Silver_Shadow'],
  // Aston Martin
  ['astonmartin-valkyrie', 'astonmartin', 'Aston Martin Valkyrie', 'sport', '🏎️', 'Aston_Martin_Valkyrie'],
  ['astonmartin-dbs', 'astonmartin', 'Aston Martin DBS', 'sport', '🏎️', 'Aston_Martin_DBS_Superleggera'],
  // McLaren
  ['mclaren-gt', 'mclaren', 'McLaren GT', 'sport', '🏎️', 'McLaren_GT'],
  ['mclaren-senna', 'mclaren', 'McLaren Senna', 'sport', '🏎️', 'McLaren_Senna'],
  ['mclaren-570s', 'mclaren', 'McLaren 570S', 'sport', '🏎️', 'McLaren_570S'],
  // Lotus
  ['lotus-exige', 'lotus', 'Lotus Exige', 'sport', '🏎️', 'Lotus_Exige'],
  ['lotus-europa', 'lotus', 'Lotus Europa', 'classic', '🏎️', 'Lotus_Europa'],
  ['lotus-eletre', 'lotus', 'Lotus Eletre', 'electric', '⚡', 'Lotus_Eletre'],
  // MG
  ['mg-5', 'mg', 'MG 5', 'electric', '⚡', 'MG_5_(crossover)'],
  ['mg-b', 'mg', 'MG B', 'classic', '🏎️', 'MG_MGB'],
  // Koenigsegg
  ['koenigsegg-cc8s', 'koenigsegg', 'Koenigsegg CC8S', 'sport', '🏎️', 'Koenigsegg_CC8S'],
  ['koenigsegg-regera', 'koenigsegg', 'Koenigsegg Regera', 'sport', '🏎️', 'Koenigsegg_Regera'],
  // Polestar
  ['polestar-1', 'polestar', 'Polestar 1', 'sport', '⚡', 'Polestar_1'],
  ['polestar-4', 'polestar', 'Polestar 4', 'electric', '⚡', 'Polestar_4'],
  // Genesis
  ['genesis-g90', 'genesis', 'Genesis G90', 'premium', '🚗', 'Genesis_G90'],
  ['genesis-gv70', 'genesis', 'Genesis GV70', 'suv', '🚙', 'Genesis_GV70'],
  // Lancia
  ['lancia-fulvia', 'lancia', 'Lancia Fulvia', 'classic', '🏎️', 'Lancia_Fulvia'],
  ['lancia-037', 'lancia', 'Lancia 037', 'sport', '🏎️', 'Lancia_037'],
  ['lancia-thema', 'lancia', 'Lancia Thema', 'family', '🚗', 'Lancia_Thema'],
  // Pagani
  ['pagani-imola', 'pagani', 'Pagani Imola', 'sport', '🏎️', 'Pagani_Imola'],
  // Alpine
  ['alpine-a110-gt', 'alpine', 'Alpine A110 GT', 'sport', '🏎️', 'Alpine_A110_(2017)'],
  // DS
  ['ds-4', 'ds', 'DS 4', 'family', '🚗', 'DS_4_(2021)'],
  ['ds-9', 'ds', 'DS 9', 'premium', '🚗', 'DS_9'],
  // Tata
  ['tata-tiago', 'tata', 'Tata Tiago', 'city', '🚗', 'Tata_Tiago'],
  ['tata-altroz', 'tata', 'Tata Altroz', 'family', '🚗', 'Tata_Altroz'],
  // Mahindra
  ['mahindra-bolero', 'mahindra', 'Mahindra Bolero', 'offroad', '🚙', 'Mahindra_Bolero'],
  ['mahindra-xuv300', 'mahindra', 'Mahindra XUV300', 'suv', '🚙', 'Mahindra_XUV300'],
  // Proton
  ['proton-persona', 'proton', 'Proton Persona', 'family', '🚗', 'Proton_Persona'],
  ['proton-iriz', 'proton', 'Proton Iriz', 'city', '🚗', 'Proton_Iriz'],
  // Lada
  ['lada-2101', 'lada', 'Lada 2101', 'classic', '🚗', 'VAZ-2101'],
  ['lada-samara', 'lada', 'Lada Samara', 'family', '🚗', 'Lada_Samara'],
  ['lada-4x4', 'lada', 'Lada 4x4', 'offroad', '🚙', 'Lada_4x4'],
  // Cupra
  ['cupra-ateca', 'cupra', 'Cupra Ateca', 'suv', '🏎️', 'Cupra_Ateca'],
  ['cupra-tavascan', 'cupra', 'Cupra Tavascan', 'electric', '⚡', 'Cupra_Tavascan'],
  // Lincoln
  ['lincoln-corsair', 'lincoln', 'Lincoln Corsair', 'suv', '🚙', 'Lincoln_Corsair'],
  ['lincoln-town-car', 'lincoln', 'Lincoln Town Car', 'classic', '🚗', 'Lincoln_Town_Car'],
  // GMC
  ['gmc-canyon', 'gmc', 'GMC Canyon', 'offroad', '🛻', 'GMC_Canyon'],
  ['gmc-acadia', 'gmc', 'GMC Acadia', 'suv', '🚙', 'GMC_Acadia'],
  // Ram
  ['ram-promaster', 'ram', 'Ram ProMaster', 'family', '🚗', 'Ram_ProMaster'],
  // Rivian
  ['rivian-r2', 'rivian', 'Rivian R2', 'electric', '⚡', 'Rivian_R2'],
  // NIO
  ['nio-es8', 'nio', 'NIO ES8', 'suv', '⚡', 'Nio_ES8'],
  ['nio-et5', 'nio', 'NIO ET5', 'electric', '⚡', 'Nio_ET5'],
  // Geely
  ['geely-emgrand', 'geely', 'Geely Emgrand', 'family', '🚗', 'Geely_Emgrand'],
  ['geely-icon', 'geely', 'Geely Icon', 'suv', '🚙', 'Geely_Icon'],
  // Great Wall
  ['greatwall-ora', 'greatwall', 'ORA Cat', 'electric', '⚡', 'ORA_(brand)'],
  ['greatwall-wey', 'greatwall', 'WEY Coffee 01', 'suv', '🚙', 'Wey_Coffee_01'],
  // Chery
  ['chery-arrizo', 'chery', 'Chery Arrizo 6', 'family', '🚗', 'Chery_Arrizo_6'],
  ['chery-tiggo8', 'chery', 'Chery Tiggo 8', 'suv', '🚙', 'Chery_Tiggo_8'],
  // SsangYong
  ['ssangyong-torres', 'ssangyong', 'SsangYong Torres', 'suv', '🚙', 'KGM_Torres'],
  ['ssangyong-musso', 'ssangyong', 'SsangYong Musso', 'offroad', '🛻', 'SsangYong_Musso'],
  // Infiniti
  ['infiniti-q60', 'infiniti', 'Infiniti Q60', 'sport', '🏎️', 'Infiniti_Q60'],
  ['infiniti-qx50', 'infiniti', 'Infiniti QX50', 'suv', '🚙', 'Infiniti_QX50'],
  // Daihatsu
  ['daihatsu-tanto', 'daihatsu', 'Daihatsu Tanto', 'city', '🚗', 'Daihatsu_Tanto'],
  ['daihatsu-move', 'daihatsu', 'Daihatsu Move', 'city', '🚗', 'Daihatsu_Move'],
  // Chrysler
  ['chrysler-voyager', 'chrysler', 'Chrysler Voyager', 'family', '🚗', 'Chrysler_Voyager'],
  ['chrysler-pt-cruiser', 'chrysler', 'Chrysler PT Cruiser', 'classic', '🚗', 'Chrysler_PT_Cruiser'],
  // Pontiac
  ['pontiac-trans-am', 'pontiac', 'Pontiac Trans Am', 'sport', '🏎️', 'Pontiac_Firebird'],
  ['pontiac-solstice', 'pontiac', 'Pontiac Solstice', 'sport', '🏎️', 'Pontiac_Solstice'],
  // Buick
  ['buick-regal', 'buick', 'Buick Regal', 'family', '🚗', 'Buick_Regal'],
  ['buick-encore', 'buick', 'Buick Encore', 'suv', '🚙', 'Buick_Encore'],
  ['buick-envision', 'buick', 'Buick Envision', 'suv', '🚙', 'Buick_Envision'],
];

// ── HELPERS ─────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function batchFetchWikiImages(wikiTitles, size = 400) {
  const result = new Map();
  const BATCH_SIZE = 50;
  const UA = 'KubaGeoCars/1.0 (educational app; geocars@example.com)';

  for (let i = 0; i < wikiTitles.length; i += BATCH_SIZE) {
    const batch = wikiTitles.slice(i, i + BATCH_SIZE);
    const titles = batch.join('|');
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=pageimages&format=json&pithumbsize=${size}&redirects=1&origin=*`;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const resp = await fetch(url, { headers: { 'User-Agent': UA } });
        if (!resp.ok) { await sleep(2000); continue; }
        const data = await resp.json();
        const pages = data?.query?.pages || {};
        const normalizeMap = {};
        for (const n of data?.query?.normalized || []) normalizeMap[n.to] = n.from;
        const redirectMap = {};
        for (const r of data?.query?.redirects || []) redirectMap[r.to] = r.from;

        for (const page of Object.values(pages)) {
          if (page.thumbnail?.source) {
            let title = page.title;
            if (redirectMap[title]) title = redirectMap[title];
            if (normalizeMap[title]) title = normalizeMap[title];
            result.set(title.replace(/ /g, '_'), page.thumbnail.source);
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

async function fallbackFetchImages(missingTitles, size = 400) {
  const result = new Map();
  const UA = 'KubaGeoCars/1.0 (educational app; geocars@example.com)';

  for (const wikiTitle of missingTitles) {
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=images&imlimit=30&format=json&redirects=1&origin=*`;
      const resp = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!resp.ok) { await sleep(500); continue; }
      const data = await resp.json();
      const pages = data?.query?.pages || {};

      let bestFile = null;
      for (const page of Object.values(pages)) {
        const images = (page.images || []).map(i => i.title);
        const brand = wikiTitle.split('_')[0].split('(')[0].trim().toLowerCase();

        bestFile = images.find(f => f.toLowerCase().includes(brand) && (f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.svg')) && !f.toLowerCase().includes('flag') && !f.toLowerCase().includes('commons') && !f.toLowerCase().includes('symbol'));
      }

      if (bestFile) {
        const fileUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(bestFile)}&prop=imageinfo&iiprop=url&iiurlwidth=${size}&format=json&origin=*`;
        const fileResp = await fetch(fileUrl, { headers: { 'User-Agent': UA } });
        if (fileResp.ok) {
          const fileData = await fileResp.json();
          for (const fp of Object.values(fileData?.query?.pages || {})) {
            const thumbUrl = fp.imageinfo?.[0]?.thumburl || fp.imageinfo?.[0]?.url;
            if (thumbUrl) result.set(wikiTitle, thumbUrl);
          }
        }
      }
      await sleep(300);
    } catch { await sleep(300); }
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
    if (existsSync(destPath)) {
      const size = statSync(destPath).size;
      if (size < 500) { execSync(`rm "${destPath}"`, { stdio: 'pipe' }); return false; }
      return true;
    }
    return false;
  } catch {
    try { execSync(`rm -f "${destPath}"`, { stdio: 'pipe' }); } catch {}
    return false;
  }
}

// ── MAIN ────────────────────────────────────────────────
async function main() {
  console.log('Reading existing cars.json...');
  const existing = JSON.parse(await readFile(JSON_PATH, 'utf-8'));
  const existingIds = new Set(existing.entities.map((e) => e.id));

  await mkdir(CARS_DIR, { recursive: true });

  // Build new model entities (skip existing)
  const newModelEntities = [];
  for (const [id, brandId, name, category, emoji] of WAVE2_MODELS) {
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

  console.log(`New models to add: ${newModelEntities.length}`);

  // Query Wikipedia for image URLs
  console.log('\nQuerying Wikipedia for image URLs...');
  const wikiTitles = WAVE2_MODELS.filter(([id]) => !existingIds.has(`model:${id}`)).map(([, , , , , wiki]) => wiki);
  const imageUrlMap = await batchFetchWikiImages(wikiTitles, 400);
  console.log(`Found ${imageUrlMap.size}/${wikiTitles.length} image URLs`);

  // Fallback for missing
  const missing = wikiTitles.filter(t => !imageUrlMap.has(t));
  if (missing.length > 0) {
    console.log(`\nFallback for ${missing.length} missing...`);
    const fallback = await fallbackFetchImages(missing, 400);
    for (const [k, v] of fallback) imageUrlMap.set(k, v);
    console.log(`Total URLs: ${imageUrlMap.size}`);
  }

  // Download images
  console.log('\nDownloading car model images...');
  let ok = 0, skip = 0;
  for (const [id, , , , , wiki] of WAVE2_MODELS) {
    if (existingIds.has(`model:${id}`)) continue;
    const dest = join(CARS_DIR, `${id}.png`);
    if (existsSync(dest)) { skip++; continue; }
    const imgUrl = imageUrlMap.get(wiki);
    if (!imgUrl) { process.stdout.write('x'); continue; }
    const success = downloadImage(imgUrl, dest);
    process.stdout.write(success ? '✓' : 'x');
    if (success) ok++;
    await sleep(200);
  }
  console.log(`\nDownloaded: ${ok} new + ${skip} existing`);

  // Filter to entities with images
  const finalModels = newModelEntities.filter((e) => {
    const f = e.media.iconUrl.split('/').pop();
    return existsSync(join(CARS_DIR, f));
  });

  console.log(`Models with images: ${finalModels.length}/${newModelEntities.length}`);

  // Merge
  existing.entities = [...existing.entities, ...finalModels];
  await writeFile(JSON_PATH, JSON.stringify(existing));
  console.log(`\nFinal cars.json: ${existing.entities.length} entities`);
  console.log('Done!');
}

main().catch((err) => { console.error(err); process.exit(1); });
