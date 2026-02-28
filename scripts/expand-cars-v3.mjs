#!/usr/bin/env node
/**
 * Third expansion: add ~370 more models to reach ~1000 total.
 * More classic, racing, and concept cars — fun for a kid!
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = new URL('..', import.meta.url).pathname;
const CARS_DIR = join(ROOT, 'public/images/cars');
const JSON_PATH = join(ROOT, 'public/data/packs/cars.json');

const WAVE3_MODELS = [
  // Toyota classics & more
  ['toyota-ae86', 'toyota', 'Toyota AE86', 'classic', '🏎️', 'Toyota_AE86'],
  ['toyota-2000gt', 'toyota', 'Toyota 2000GT', 'classic', '🏎️', 'Toyota_2000GT'],
  ['toyota-tacoma', 'toyota', 'Toyota Tacoma', 'offroad', '🛻', 'Toyota_Tacoma'],
  ['toyota-4runner', 'toyota', 'Toyota 4Runner', 'offroad', '🚙', 'Toyota_4Runner'],
  ['toyota-sequoia', 'toyota', 'Toyota Sequoia', 'suv', '🚙', 'Toyota_Sequoia'],
  ['toyota-sienna', 'toyota', 'Toyota Sienna', 'family', '🚗', 'Toyota_Sienna'],
  ['toyota-venza', 'toyota', 'Toyota Venza', 'suv', '🚙', 'Toyota_Venza'],
  ['toyota-bz4x', 'toyota', 'Toyota bZ4X', 'electric', '⚡', 'Toyota_bZ4X'],
  // Honda more
  ['honda-integra', 'honda', 'Honda Integra', 'sport', '🏎️', 'Honda_Integra'],
  ['honda-element', 'honda', 'Honda Element', 'suv', '🚙', 'Honda_Element'],
  ['honda-passport', 'honda', 'Honda Passport', 'suv', '🚙', 'Honda_Passport'],
  ['honda-prologue', 'honda', 'Honda Prologue', 'electric', '⚡', 'Honda_Prologue'],
  ['honda-beat', 'honda', 'Honda Beat', 'sport', '🏎️', 'Honda_Beat_(PP1)'],
  // Nissan more
  ['nissan-murano', 'nissan', 'Nissan Murano', 'suv', '🚙', 'Nissan_Murano'],
  ['nissan-sentra', 'nissan', 'Nissan Sentra', 'family', '🚗', 'Nissan_Sentra'],
  ['nissan-kicks', 'nissan', 'Nissan Kicks', 'suv', '🚙', 'Nissan_Kicks'],
  ['nissan-note', 'nissan', 'Nissan Note', 'city', '🚗', 'Nissan_Note'],
  ['nissan-240sx', 'nissan', 'Nissan 240SX', 'sport', '🏎️', 'Nissan_240SX'],
  ['nissan-silvia', 'nissan', 'Nissan Silvia', 'sport', '🏎️', 'Nissan_Silvia'],
  // BMW more
  ['bmw-x6', 'bmw', 'BMW X6', 'suv', '🚙', 'BMW_X6'],
  ['bmw-x4', 'bmw', 'BMW X4', 'suv', '🚙', 'BMW_X4'],
  ['bmw-m4', 'bmw', 'BMW M4', 'sport', '🏎️', 'BMW_M4'],
  ['bmw-e30', 'bmw', 'BMW E30', 'classic', '🏎️', 'BMW_3_Series_(E30)'],
  ['bmw-8series', 'bmw', 'BMW Seria 8', 'sport', '🏎️', 'BMW_8_Series_(G15)'],
  ['bmw-isetta', 'bmw', 'BMW Isetta', 'classic', '🚗', 'Isetta'],
  ['bmw-i3', 'bmw', 'BMW i3', 'electric', '⚡', 'BMW_i3'],
  // Mercedes more
  ['mercedes-gls', 'mercedes', 'Mercedes GLS', 'suv', '🚙', 'Mercedes-Benz_GLS-Class'],
  ['mercedes-cls', 'mercedes', 'Mercedes CLS', 'sport', '🚗', 'Mercedes-Benz_CLS-Class'],
  ['mercedes-b-class', 'mercedes', 'Mercedes Klasa B', 'family', '🚗', 'Mercedes-Benz_B-Class'],
  ['mercedes-eqb', 'mercedes', 'Mercedes EQB', 'electric', '⚡', 'Mercedes-Benz_EQB'],
  ['mercedes-w123', 'mercedes', 'Mercedes W123', 'classic', '🚗', 'Mercedes-Benz_W123'],
  ['mercedes-sls-amg', 'mercedes', 'Mercedes SLS AMG', 'sport', '🏎️', 'Mercedes-Benz_SLS_AMG'],
  ['mercedes-clk', 'mercedes', 'Mercedes CLK', 'sport', '🏎️', 'Mercedes-Benz_CLK-Class'],
  // VW more
  ['vw-up', 'volkswagen', 'Volkswagen Up!', 'city', '🚗', 'Volkswagen_Up'],
  ['vw-atlas', 'volkswagen', 'Volkswagen Atlas', 'suv', '🚙', 'Volkswagen_Atlas'],
  ['vw-jetta', 'volkswagen', 'Volkswagen Jetta', 'family', '🚗', 'Volkswagen_Jetta'],
  ['vw-cc', 'volkswagen', 'Volkswagen CC', 'family', '🚗', 'Volkswagen_CC'],
  ['vw-corrado', 'volkswagen', 'Volkswagen Corrado', 'sport', '🏎️', 'Volkswagen_Corrado'],
  ['vw-karmann-ghia', 'volkswagen', 'Volkswagen Karmann Ghia', 'classic', '🏎️', 'Volkswagen_Karmann_Ghia'],
  ['vw-id-buzz', 'volkswagen', 'Volkswagen ID. Buzz', 'electric', '⚡', 'Volkswagen_ID._Buzz'],
  // Audi more
  ['audi-a1', 'audi', 'Audi A1', 'city', '🚗', 'Audi_A1'],
  ['audi-a5', 'audi', 'Audi A5', 'sport', '🏎️', 'Audi_A5'],
  ['audi-q2', 'audi', 'Audi Q2', 'suv', '🚙', 'Audi_Q2'],
  ['audi-rs3', 'audi', 'Audi RS3', 'sport', '🏎️', 'Audi_RS_3'],
  ['audi-quattro', 'audi', 'Audi Quattro', 'classic', '🏎️', 'Audi_Quattro'],
  // Porsche more
  ['porsche-959', 'porsche', 'Porsche 959', 'classic', '🏎️', 'Porsche_959'],
  ['porsche-550', 'porsche', 'Porsche 550', 'classic', '🏎️', 'Porsche_550'],
  ['porsche-914', 'porsche', 'Porsche 914', 'classic', '🏎️', 'Porsche_914'],
  // Ford more
  ['ford-ka', 'ford', 'Ford Ka', 'city', '🚗', 'Ford_Ka'],
  ['ford-galaxy', 'ford', 'Ford Galaxy', 'family', '🚗', 'Ford_Galaxy'],
  ['ford-kuga', 'ford', 'Ford Kuga', 'suv', '🚙', 'Ford_Kuga'],
  ['ford-ecosport', 'ford', 'Ford EcoSport', 'suv', '🚙', 'Ford_EcoSport'],
  ['ford-raptor', 'ford', 'Ford F-150 Raptor', 'offroad', '🛻', 'Ford_F-150_Raptor'],
  ['ford-shelby-gt500', 'ford', 'Ford Shelby GT500', 'sport', '🏎️', 'Shelby_Mustang'],
  ['ford-thunderbird', 'ford', 'Ford Thunderbird', 'classic', '🚗', 'Ford_Thunderbird'],
  // Chevrolet more
  ['chevrolet-traverse', 'chevrolet', 'Chevrolet Traverse', 'suv', '🚙', 'Chevrolet_Traverse'],
  ['chevrolet-cruze', 'chevrolet', 'Chevrolet Cruze', 'family', '🚗', 'Chevrolet_Cruze'],
  ['chevrolet-spark', 'chevrolet', 'Chevrolet Spark', 'city', '🚗', 'Chevrolet_Spark'],
  ['chevrolet-suburban', 'chevrolet', 'Chevrolet Suburban', 'suv', '🚙', 'Chevrolet_Suburban'],
  ['chevrolet-nova', 'chevrolet', 'Chevrolet Nova', 'classic', '🚗', 'Chevrolet_Nova'],
  ['chevrolet-ss', 'chevrolet', 'Chevrolet SS', 'sport', '🏎️', 'Chevrolet_SS'],
  // Hyundai more
  ['hyundai-accent', 'hyundai', 'Hyundai Accent', 'city', '🚗', 'Hyundai_Accent'],
  ['hyundai-nexo', 'hyundai', 'Hyundai Nexo', 'electric', '⚡', 'Hyundai_Nexo'],
  ['hyundai-veloster', 'hyundai', 'Hyundai Veloster', 'sport', '🏎️', 'Hyundai_Veloster'],
  ['hyundai-bayon', 'hyundai', 'Hyundai Bayon', 'suv', '🚙', 'Hyundai_Bayon'],
  ['hyundai-staria', 'hyundai', 'Hyundai Staria', 'family', '🚗', 'Hyundai_Staria'],
  // Kia more
  ['kia-rio', 'kia', 'Kia Rio', 'city', '🚗', 'Kia_Rio'],
  ['kia-optima', 'kia', 'Kia Optima', 'family', '🚗', 'Kia_Optima'],
  ['kia-mohave', 'kia', 'Kia Mohave', 'suv', '🚙', 'Kia_Mohave'],
  ['kia-ev9', 'kia', 'Kia EV9', 'electric', '⚡', 'Kia_EV9'],
  ['kia-stonic', 'kia', 'Kia Stonic', 'suv', '🚙', 'Kia_Stonic'],
  // Renault more
  ['renault-arkana', 'renault', 'Renault Arkana', 'suv', '🚙', 'Renault_Arkana'],
  ['renault-kadjar', 'renault', 'Renault Kadjar', 'suv', '🚙', 'Renault_Kadjar'],
  ['renault-espace', 'renault', 'Renault Espace', 'family', '🚗', 'Renault_Espace'],
  ['renault-alpine-a610', 'renault', 'Renault Alpine A610', 'classic', '🏎️', 'Alpine_A610'],
  // Peugeot more
  ['peugeot-406', 'peugeot', 'Peugeot 406', 'classic', '🚗', 'Peugeot_406'],
  ['peugeot-e-2008', 'peugeot', 'Peugeot e-2008', 'electric', '⚡', 'Peugeot_2008'],
  ['peugeot-partner', 'peugeot', 'Peugeot Partner', 'family', '🚗', 'Peugeot_Partner'],
  // Citroën more
  ['citroen-xsara', 'citroen', 'Citroën Xsara', 'family', '🚗', 'Citroën_Xsara'],
  ['citroen-c6', 'citroen', 'Citroën C6', 'premium', '🚗', 'Citroën_C6'],
  ['citroen-traction-avant', 'citroen', 'Citroën Traction Avant', 'classic', '🚗', 'Citroën_Traction_Avant'],
  // Ferrari more
  ['ferrari-360', 'ferrari', 'Ferrari 360 Modena', 'sport', '🏎️', 'Ferrari_360'],
  ['ferrari-f355', 'ferrari', 'Ferrari F355', 'sport', '🏎️', 'Ferrari_F355'],
  ['ferrari-308', 'ferrari', 'Ferrari 308', 'classic', '🏎️', 'Ferrari_308_GTB/GTS'],
  ['ferrari-dino', 'ferrari', 'Ferrari Dino', 'classic', '🏎️', 'Dino_(automobile)'],
  // Lamborghini more
  ['lamborghini-aventador-svj', 'lamborghini', 'Lamborghini Aventador SVJ', 'sport', '🏎️', 'Lamborghini_Aventador'],
  ['lamborghini-islero', 'lamborghini', 'Lamborghini Islero', 'classic', '🏎️', 'Lamborghini_Islero'],
  ['lamborghini-espada', 'lamborghini', 'Lamborghini Espada', 'classic', '🏎️', 'Lamborghini_Espada'],
  // Volvo more
  ['volvo-v40', 'volvo', 'Volvo V40', 'family', '🚗', 'Volvo_V40_(2012–2019)'],
  ['volvo-xc30', 'volvo', 'Volvo EX40', 'electric', '⚡', 'Volvo_EX40'],
  ['volvo-850', 'volvo', 'Volvo 850', 'classic', '🚗', 'Volvo_850'],
  // Mazda more
  ['mazda-mx30', 'mazda', 'Mazda MX-30', 'electric', '⚡', 'Mazda_MX-30'],
  ['mazda-cx50', 'mazda', 'Mazda CX-50', 'suv', '🚙', 'Mazda_CX-50'],
  ['mazda-787b', 'mazda', 'Mazda 787B', 'sport', '🏎️', 'Mazda_787B'],
  // Škoda more
  ['skoda-octavia-rs', 'skoda', 'Škoda Octavia RS', 'sport', '🏎️', 'Škoda_Octavia'],
  ['skoda-yeti', 'skoda', 'Škoda Yeti', 'suv', '🚙', 'Škoda_Yeti'],
  ['skoda-130rs', 'skoda', 'Škoda 130 RS', 'classic', '🏎️', 'Škoda_130_RS'],
  // SEAT more
  ['seat-cupra-r', 'seat', 'SEAT León Cupra', 'sport', '🏎️', 'SEAT_León'],
  ['seat-toledo', 'seat', 'SEAT Toledo', 'family', '🚗', 'SEAT_Toledo'],
  ['seat-alhambra', 'seat', 'SEAT Alhambra', 'family', '🚗', 'SEAT_Alhambra'],
  // Dacia more
  ['dacia-bigster', 'dacia', 'Dacia Bigster', 'suv', '🚙', 'Dacia_Bigster'],
  ['dacia-stepway', 'dacia', 'Dacia Sandero Stepway', 'family', '🚗', 'Dacia_Sandero'],
  // Alfa Romeo more
  ['alfa-romeo-159', 'alfaromeo', 'Alfa Romeo 159', 'family', '🚗', 'Alfa_Romeo_159'],
  ['alfa-romeo-mito', 'alfaromeo', 'Alfa Romeo MiTo', 'city', '🚗', 'Alfa_Romeo_MiTo'],
  ['alfa-romeo-33-stradale', 'alfaromeo', 'Alfa Romeo 33 Stradale', 'sport', '🏎️', 'Alfa_Romeo_33_Stradale'],
  // BYD more
  ['byd-blade', 'byd', 'BYD e6', 'electric', '⚡', 'BYD_e6'],
  ['byd-seagull', 'byd', 'BYD Seagull', 'city', '⚡', 'BYD_Seagull'],
  // Suzuki more
  ['suzuki-sx4', 'suzuki', 'Suzuki SX4', 'suv', '🚙', 'Suzuki_SX4'],
  ['suzuki-grand-vitara', 'suzuki', 'Suzuki Grand Vitara', 'offroad', '🚙', 'Suzuki_Grand_Vitara'],
  ['suzuki-hayabusa', 'suzuki', 'Suzuki Hayabusa', 'sport', '🏎️', 'Suzuki_Hayabusa'],
  // Lexus more
  ['lexus-lx', 'lexus', 'Lexus LX', 'suv', '🚙', 'Lexus_LX'],
  ['lexus-ct', 'lexus', 'Lexus CT', 'city', '🚗', 'Lexus_CT'],
  ['lexus-lc500', 'lexus', 'Lexus LC 500', 'sport', '🏎️', 'Lexus_LC'],
  // Subaru more
  ['subaru-ascent', 'subaru', 'Subaru Ascent', 'suv', '🚙', 'Subaru_Ascent'],
  ['subaru-crosstrek', 'subaru', 'Subaru Crosstrek', 'suv', '🚙', 'Subaru_Crosstrek'],
  ['subaru-svx', 'subaru', 'Subaru SVX', 'classic', '🏎️', 'Subaru_SVX'],
  // Mitsubishi more
  ['mitsubishi-colt', 'mitsubishi', 'Mitsubishi Colt', 'city', '🚗', 'Mitsubishi_Colt'],
  ['mitsubishi-galant', 'mitsubishi', 'Mitsubishi Galant', 'family', '🚗', 'Mitsubishi_Galant'],
  ['mitsubishi-gto', 'mitsubishi', 'Mitsubishi GTO', 'sport', '🏎️', 'Mitsubishi_GTO'],
  // Cadillac more
  ['cadillac-xt4', 'cadillac', 'Cadillac XT4', 'suv', '🚙', 'Cadillac_XT4'],
  ['cadillac-ats', 'cadillac', 'Cadillac ATS', 'sport', '🏎️', 'Cadillac_ATS'],
  ['cadillac-cts-v', 'cadillac', 'Cadillac CTS-V', 'sport', '🏎️', 'Cadillac_CTS-V'],
  // Maserati more
  ['maserati-mc12', 'maserati', 'Maserati MC12', 'sport', '🏎️', 'Maserati_MC12'],
  ['maserati-merak', 'maserati', 'Maserati Merak', 'classic', '🏎️', 'Maserati_Merak'],
  ['maserati-bora', 'maserati', 'Maserati Bora', 'classic', '🏎️', 'Maserati_Bora'],
  // Bugatti more
  ['bugatti-centodieci', 'bugatti', 'Bugatti Centodieci', 'sport', '🏎️', 'Bugatti_Centodieci'],
  ['bugatti-type57', 'bugatti', 'Bugatti Type 57', 'classic', '🏎️', 'Bugatti_Type_57'],
  // Bentley more
  ['bentley-gt-speed', 'bentley', 'Bentley Continental GT Speed', 'sport', '🏎️', 'Bentley_Continental_GT'],
  ['bentley-brooklands', 'bentley', 'Bentley Brooklands', 'classic', '🚗', 'Bentley_Brooklands'],
  // Aston Martin more
  ['astonmartin-v12-speedster', 'astonmartin', 'Aston Martin V12 Speedster', 'sport', '🏎️', 'Aston_Martin_V12_Speedster'],
  ['astonmartin-rapide', 'astonmartin', 'Aston Martin Rapide', 'sport', '🏎️', 'Aston_Martin_Rapide'],
  ['astonmartin-vanquish', 'astonmartin', 'Aston Martin Vanquish', 'sport', '🏎️', 'Aston_Martin_Vanquish'],
  // McLaren more
  ['mclaren-speedtail', 'mclaren', 'McLaren Speedtail', 'sport', '🏎️', 'McLaren_Speedtail'],
  ['mclaren-elva', 'mclaren', 'McLaren Elva', 'sport', '🏎️', 'McLaren_Elva'],
  ['mclaren-600lt', 'mclaren', 'McLaren 600LT', 'sport', '🏎️', 'McLaren_600LT'],
  ['mclaren-650s', 'mclaren', 'McLaren 650S', 'sport', '🏎️', 'McLaren_650S'],
  // Lotus more
  ['lotus-carlton', 'lotus', 'Lotus Carlton', 'sport', '🏎️', 'Lotus_Carlton'],
  ['lotus-elan', 'lotus', 'Lotus Elan', 'classic', '🏎️', 'Lotus_Elan'],
  ['lotus-seven', 'lotus', 'Lotus Seven', 'classic', '🏎️', 'Lotus_Seven'],
  // Koenigsegg more
  ['koenigsegg-ccxr', 'koenigsegg', 'Koenigsegg CCXR', 'sport', '🏎️', 'Koenigsegg_CCX'],
  ['koenigsegg-one1', 'koenigsegg', 'Koenigsegg One:1', 'sport', '🏎️', 'Koenigsegg_One:1'],
  // Genesis more
  ['genesis-x', 'genesis', 'Genesis X', 'sport', '🏎️', 'Genesis_X'],
  // Pagani more
  ['pagani-zonda-r', 'pagani', 'Pagani Zonda R', 'sport', '🏎️', 'Pagani_Zonda'],
  // Alpine more
  ['alpine-a106', 'alpine', 'Alpine A106', 'classic', '🏎️', 'Alpine_A106'],
  // NIO more
  ['nio-ec6', 'nio', 'NIO EC6', 'suv', '⚡', 'Nio_EC6'],
  ['nio-el7', 'nio', 'NIO EL7', 'suv', '⚡', 'Nio_EL7'],
  // Geely more
  ['geely-monjaro', 'geely', 'Geely Monjaro', 'suv', '🚙', 'Geely_Xingyue_L'],
  ['geely-preface', 'geely', 'Geely Preface', 'family', '🚗', 'Geely_Preface'],
  // Chery more
  ['chery-tiggo4', 'chery', 'Chery Tiggo 4', 'suv', '🚙', 'Chery_Tiggo_5x'],
  ['chery-qq', 'chery', 'Chery QQ', 'city', '🚗', 'Chery_QQ'],
  // Tata more
  ['tata-indica', 'tata', 'Tata Indica', 'city', '🚗', 'Tata_Indica'],
  ['tata-nano', 'tata', 'Tata Nano', 'city', '🚗', 'Tata_Nano'],
  // Mahindra more
  ['mahindra-kuv100', 'mahindra', 'Mahindra KUV100', 'city', '🚙', 'Mahindra_KUV100'],
  // Proton more
  ['proton-wira', 'proton', 'Proton Wira', 'family', '🚗', 'Proton_Wira'],
  ['proton-satria', 'proton', 'Proton Satria Neo', 'sport', '🏎️', 'Proton_Satria_Neo'],
  // Lada more
  ['lada-priora', 'lada', 'Lada Priora', 'family', '🚗', 'Lada_Priora'],
  ['lada-kalina', 'lada', 'Lada Kalina', 'city', '🚗', 'Lada_Kalina'],
  // Cupra more
  ['cupra-terramar', 'cupra', 'Cupra Terramar', 'suv', '🏎️', 'Cupra_Terramar'],
  // GMC more
  ['gmc-terrain', 'gmc', 'GMC Terrain', 'suv', '🚙', 'GMC_Terrain'],
  ['gmc-envoy', 'gmc', 'GMC Envoy', 'suv', '🚙', 'GMC_Envoy'],
  // Ram more
  ['ram-rebel', 'ram', 'Ram 1500 Rebel', 'offroad', '🛻', 'Ram_1500'],
  // Chrysler more
  ['chrysler-crossfire', 'chrysler', 'Chrysler Crossfire', 'sport', '🏎️', 'Chrysler_Crossfire'],
  ['chrysler-imperial', 'chrysler', 'Chrysler Imperial', 'classic', '🚗', 'Chrysler_Imperial'],
  // Rivian more
  ['rivian-r3', 'rivian', 'Rivian R3', 'electric', '⚡', 'Rivian'],
  // Pontiac more
  ['pontiac-grand-prix', 'pontiac', 'Pontiac Grand Prix', 'sport', '🏎️', 'Pontiac_Grand_Prix'],
  ['pontiac-bonneville', 'pontiac', 'Pontiac Bonneville', 'classic', '🚗', 'Pontiac_Bonneville'],
  // Buick more
  ['buick-lacrosse', 'buick', 'Buick LaCrosse', 'family', '🚗', 'Buick_LaCrosse'],
  ['buick-grand-national', 'buick', 'Buick Grand National', 'classic', '🏎️', 'Buick_Regal#Grand_National_and_GNX'],
  // Lancia more
  ['lancia-integrale', 'lancia', 'Lancia Delta Integrale', 'sport', '🏎️', 'Lancia_Delta_Integrale'],
  ['lancia-montecarlo', 'lancia', 'Lancia Montecarlo', 'sport', '🏎️', 'Lancia_Montecarlo'],
  // DS more
  ['ds-5', 'ds', 'DS 5', 'family', '🚗', 'DS_5'],
  // Fiat more
  ['fiat-cinquecento', 'fiat', 'Fiat Cinquecento', 'city', '🚗', 'Fiat_Cinquecento'],
  ['fiat-seicento', 'fiat', 'Fiat Seicento', 'city', '🚗', 'Fiat_Seicento'],
  ['fiat-bravo', 'fiat', 'Fiat Bravo', 'family', '🚗', 'Fiat_Bravo_(2007)'],
  ['fiat-dino', 'fiat', 'Fiat Dino', 'classic', '🏎️', 'Fiat_Dino'],
  // Opel more
  ['opel-kadett', 'opel', 'Opel Kadett', 'classic', '🚗', 'Opel_Kadett'],
  ['opel-omega', 'opel', 'Opel Omega', 'family', '🚗', 'Opel_Omega'],
  ['opel-calibra', 'opel', 'Opel Calibra', 'sport', '🏎️', 'Opel_Calibra'],
  // Jaguar more
  ['jaguar-mk2', 'jaguar', 'Jaguar Mk2', 'classic', '🚗', 'Jaguar_Mark_2'],
  ['jaguar-xjs', 'jaguar', 'Jaguar XJS', 'classic', '🏎️', 'Jaguar_XJS'],
  // Land Rover more
  ['land-rover-series', 'landrover', 'Land Rover Series', 'classic', '🚙', 'Land_Rover_series'],
  // Jeep more
  ['jeep-cj', 'jeep', 'Jeep CJ', 'classic', '🚙', 'Jeep_CJ'],
  ['jeep-wagoneer', 'jeep', 'Jeep Wagoneer', 'suv', '🚙', 'Jeep_Wagoneer_(SJ)'],
  // Tesla more
  ['tesla-original-roadster', 'tesla', 'Tesla Roadster (1. gen)', 'sport', '⚡', 'Tesla_Roadster_(first_generation)'],
  // Dodge more
  ['dodge-viper-gts', 'dodge', 'Dodge Viper GTS', 'sport', '🏎️', 'Dodge_Viper'],
  ['dodge-coronet', 'dodge', 'Dodge Coronet', 'classic', '🚗', 'Dodge_Coronet'],
  ['dodge-charger-daytona', 'dodge', 'Dodge Charger Daytona', 'classic', '🏎️', 'Dodge_Charger_Daytona'],
  // SsangYong more
  ['ssangyong-actyon', 'ssangyong', 'SsangYong Actyon', 'suv', '🚙', 'SsangYong_Actyon'],
  // Infiniti more
  ['infiniti-fx', 'infiniti', 'Infiniti FX', 'suv', '🚙', 'Infiniti_FX'],
  ['infiniti-g37', 'infiniti', 'Infiniti G37', 'sport', '🏎️', 'Infiniti_G-series_(V36)'],
  // Daihatsu more
  ['daihatsu-sirion', 'daihatsu', 'Daihatsu Sirion', 'city', '🚗', 'Daihatsu_Sirion'],
  ['daihatsu-feroza', 'daihatsu', 'Daihatsu Feroza', 'offroad', '🚙', 'Daihatsu_Feroza'],
  // Great Wall more
  ['greatwall-poer', 'greatwall', 'GWM Poer', 'offroad', '🛻', 'Great_Wall_Pao'],
  // Dacia more
  ['dacia-1300', 'dacia', 'Dacia 1300', 'classic', '🚗', 'Dacia_1300'],
];

// ── HELPERS (same as v1/v2) ──
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
      } catch (err) { console.error(`  Batch error: ${err.message}`); await sleep(2000); }
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
    execSync(`curl -sS -L -f -o "${destPath}" -H "User-Agent: KubaGeoCars/1.0 (educational app)" "${imageUrl}"`, { timeout: 30000, stdio: 'pipe' });
    if (existsSync(destPath)) {
      if (statSync(destPath).size < 500) { execSync(`rm "${destPath}"`, { stdio: 'pipe' }); return false; }
      return true;
    }
    return false;
  } catch {
    try { execSync(`rm -f "${destPath}"`, { stdio: 'pipe' }); } catch {}
    return false;
  }
}

async function main() {
  console.log('Reading existing cars.json...');
  const existing = JSON.parse(await readFile(JSON_PATH, 'utf-8'));
  const existingIds = new Set(existing.entities.map((e) => e.id));
  await mkdir(CARS_DIR, { recursive: true });

  const newModels = [];
  for (const [id, brandId, name, category, emoji] of WAVE3_MODELS) {
    const entityId = `model:${id}`;
    if (existingIds.has(entityId)) continue;
    newModels.push({
      id: entityId, kind: 'car_model', titlePl: name,
      media: { emoji, iconUrl: `images/cars/${id}.png` },
      tags: ['cars', category],
      relations: [{ type: 'brand', target: `car:${brandId}` }, { type: 'category', value: category }],
    });
  }
  console.log(`New models: ${newModels.length}`);

  console.log('\nQuerying Wikipedia...');
  const wikiTitles = WAVE3_MODELS.filter(([id]) => !existingIds.has(`model:${id}`)).map(([, , , , , wiki]) => wiki);
  const imageUrlMap = await batchFetchWikiImages(wikiTitles, 400);
  console.log(`Found ${imageUrlMap.size}/${wikiTitles.length}`);

  const missing = wikiTitles.filter(t => !imageUrlMap.has(t));
  if (missing.length > 0) {
    console.log(`Fallback for ${missing.length}...`);
    const fb = await fallbackFetchImages(missing, 400);
    for (const [k, v] of fb) imageUrlMap.set(k, v);
    console.log(`Total: ${imageUrlMap.size}`);
  }

  console.log('\nDownloading...');
  let ok = 0, skip = 0;
  for (const [id, , , , , wiki] of WAVE3_MODELS) {
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

  const finalModels = newModels.filter((e) => existsSync(join(CARS_DIR, e.media.iconUrl.split('/').pop())));
  console.log(`With images: ${finalModels.length}/${newModels.length}`);

  existing.entities = [...existing.entities, ...finalModels];
  await writeFile(JSON_PATH, JSON.stringify(existing));
  console.log(`Final: ${existing.entities.length} entities`);
}

main().catch((err) => { console.error(err); process.exit(1); });
