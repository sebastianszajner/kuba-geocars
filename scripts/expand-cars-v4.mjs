#!/usr/bin/env node
/**
 * Final expansion: +180 models to reach ~1000 total.
 * Variant models, special editions, motorsport icons.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = new URL('..', import.meta.url).pathname;
const CARS_DIR = join(ROOT, 'public/images/cars');
const JSON_PATH = join(ROOT, 'public/data/packs/cars.json');

const WAVE4_MODELS = [
  // Toyota racing & more
  ['toyota-gr86', 'toyota', 'Toyota GR86', 'sport', '🏎️', 'Toyota_GR86'],
  ['toyota-crown', 'toyota', 'Toyota Crown', 'premium', '🚗', 'Toyota_Crown'],
  ['toyota-corolla-cross', 'toyota', 'Toyota Corolla Cross', 'suv', '🚙', 'Toyota_Corolla_Cross'],
  ['toyota-alphard', 'toyota', 'Toyota Alphard', 'family', '🚗', 'Toyota_Alphard'],
  ['toyota-century', 'toyota', 'Toyota Century', 'premium', '🚗', 'Toyota_Century'],
  // Honda variants
  ['honda-cr-z', 'honda', 'Honda CR-Z', 'sport', '🏎️', 'Honda_CR-Z'],
  ['honda-type-r', 'honda', 'Honda Civic Type R', 'sport', '🏎️', 'Honda_Civic_Type_R'],
  ['honda-zr-v', 'honda', 'Honda ZR-V', 'suv', '🚙', 'Honda_ZR-V'],
  // Nissan
  ['nissan-maxima', 'nissan', 'Nissan Maxima', 'family', '🚗', 'Nissan_Maxima'],
  ['nissan-rogue', 'nissan', 'Nissan Rogue', 'suv', '🚙', 'Nissan_Rogue'],
  ['nissan-200sx', 'nissan', 'Nissan 200SX', 'sport', '🏎️', 'Nissan_200SX'],
  // BMW
  ['bmw-x2', 'bmw', 'BMW X2', 'suv', '🚙', 'BMW_X2'],
  ['bmw-m8', 'bmw', 'BMW M8', 'sport', '🏎️', 'BMW_M8'],
  ['bmw-5series', 'bmw', 'BMW Seria 5', 'family', '🚗', 'BMW_5_Series'],
  ['bmw-4series', 'bmw', 'BMW Seria 4', 'sport', '🏎️', 'BMW_4_Series'],
  // Mercedes
  ['mercedes-amg-one', 'mercedes', 'Mercedes-AMG ONE', 'sport', '🏎️', 'Mercedes-AMG_One'],
  ['mercedes-v-class', 'mercedes', 'Mercedes Klasa V', 'family', '🚗', 'Mercedes-Benz_V-Class'],
  ['mercedes-eqa', 'mercedes', 'Mercedes EQA', 'electric', '⚡', 'Mercedes-Benz_EQA'],
  ['mercedes-w124', 'mercedes', 'Mercedes W124', 'classic', '🚗', 'Mercedes-Benz_W124'],
  // VW
  ['vw-taigo', 'volkswagen', 'Volkswagen Taigo', 'suv', '🚙', 'Volkswagen_Taigo'],
  ['vw-amarok', 'volkswagen', 'Volkswagen Amarok', 'offroad', '🛻', 'Volkswagen_Amarok'],
  ['vw-phaeton', 'volkswagen', 'Volkswagen Phaeton', 'premium', '🚗', 'Volkswagen_Phaeton'],
  ['vw-eos', 'volkswagen', 'Volkswagen Eos', 'sport', '🏎️', 'Volkswagen_Eos'],
  // Audi
  ['audi-sq5', 'audi', 'Audi SQ5', 'sport', '🏎️', 'Audi_Q5'],
  ['audi-rs7', 'audi', 'Audi RS7', 'sport', '🏎️', 'Audi_RS_7'],
  ['audi-tt-rs', 'audi', 'Audi TT RS', 'sport', '🏎️', 'Audi_TT_RS'],
  // Porsche
  ['porsche-gt2-rs', 'porsche', 'Porsche 911 GT2 RS', 'sport', '🏎️', 'Porsche_911_GT2'],
  ['porsche-turbo-s', 'porsche', 'Porsche 911 Turbo S', 'sport', '🏎️', 'Porsche_911_(992)'],
  ['porsche-electric-macan', 'porsche', 'Porsche Macan Electric', 'electric', '⚡', 'Porsche_Macan'],
  // Ford
  ['ford-mach-e', 'ford', 'Ford Mustang Mach-E', 'electric', '⚡', 'Ford_Mustang_Mach-E'],
  ['ford-expedition', 'ford', 'Ford Expedition', 'suv', '🚙', 'Ford_Expedition'],
  ['ford-taurus', 'ford', 'Ford Taurus', 'family', '🚗', 'Ford_Taurus_(sixth_generation)'],
  ['ford-rs200', 'ford', 'Ford RS200', 'classic', '🏎️', 'Ford_RS200'],
  ['ford-escort-rs', 'ford', 'Ford Escort RS', 'classic', '🏎️', 'Ford_Escort_RS_Cosworth'],
  // Chevrolet
  ['chevrolet-monte-carlo', 'chevrolet', 'Chevrolet Monte Carlo', 'classic', '🚗', 'Chevrolet_Monte_Carlo'],
  ['chevrolet-avalanche', 'chevrolet', 'Chevrolet Avalanche', 'offroad', '🛻', 'Chevrolet_Avalanche'],
  ['chevrolet-equinox-ev', 'chevrolet', 'Chevrolet Equinox EV', 'electric', '⚡', 'Chevrolet_Equinox'],
  ['chevrolet-z06', 'chevrolet', 'Corvette Z06', 'sport', '🏎️', 'Chevrolet_Corvette_(C8)'],
  // Hyundai
  ['hyundai-creta', 'hyundai', 'Hyundai Creta', 'suv', '🚙', 'Hyundai_Creta'],
  ['hyundai-genesis-coupe', 'hyundai', 'Hyundai Genesis Coupe', 'sport', '🏎️', 'Hyundai_Genesis_Coupe'],
  ['hyundai-grandeur', 'hyundai', 'Hyundai Grandeur', 'premium', '🚗', 'Hyundai_Grandeur'],
  // Kia
  ['kia-xceed', 'kia', 'Kia XCeed', 'suv', '🚙', 'Kia_XCeed'],
  ['kia-carens', 'kia', 'Kia Carens', 'family', '🚗', 'Kia_Carens'],
  ['kia-ev5', 'kia', 'Kia EV5', 'electric', '⚡', 'Kia_EV5'],
  // Renault
  ['renault-laguna', 'renault', 'Renault Laguna', 'family', '🚗', 'Renault_Laguna'],
  ['renault-fluence', 'renault', 'Renault Fluence', 'family', '🚗', 'Renault_Fluence'],
  ['renault-rs-01', 'renault', 'Renault R.S. 01', 'sport', '🏎️', 'Renault_Sport_R.S._01'],
  // Peugeot
  ['peugeot-e-3008', 'peugeot', 'Peugeot e-3008', 'electric', '⚡', 'Peugeot_3008'],
  ['peugeot-308-gti', 'peugeot', 'Peugeot 308 GTi', 'sport', '🏎️', 'Peugeot_308_(T9)'],
  ['peugeot-905', 'peugeot', 'Peugeot 905', 'sport', '🏎️', 'Peugeot_905'],
  // Citroën
  ['citroen-c4-cactus', 'citroen', 'Citroën C4 Cactus', 'family', '🚗', 'Citroën_C4_Cactus'],
  ['citroen-c3-aircross', 'citroen', 'Citroën C3 Aircross', 'suv', '🚙', 'Citroën_C3_Aircross'],
  ['citroen-hy', 'citroen', 'Citroën H Van', 'classic', '🚗', 'Citroën_H_Van'],
  // Ferrari
  ['ferrari-california', 'ferrari', 'Ferrari California', 'sport', '🏎️', 'Ferrari_California_T'],
  ['ferrari-portofino', 'ferrari', 'Ferrari Portofino', 'sport', '🏎️', 'Ferrari_Portofino'],
  ['ferrari-monza', 'ferrari', 'Ferrari Monza SP', 'sport', '🏎️', 'Ferrari_Monza_SP1'],
  ['ferrari-daytona', 'ferrari', 'Ferrari Daytona', 'classic', '🏎️', 'Ferrari_Daytona'],
  // Lamborghini
  ['lamborghini-terzo', 'lamborghini', 'Lamborghini Terzo Millennio', 'sport', '🏎️', 'Lamborghini_Terzo_Millennio'],
  ['lamborghini-lm002', 'lamborghini', 'Lamborghini LM002', 'offroad', '🏎️', 'Lamborghini_LM002'],
  ['lamborghini-jalpa', 'lamborghini', 'Lamborghini Jalpa', 'classic', '🏎️', 'Lamborghini_Jalpa'],
  // Volvo
  ['volvo-c30', 'volvo', 'Volvo C30', 'city', '🚗', 'Volvo_C30'],
  ['volvo-c70', 'volvo', 'Volvo C70', 'sport', '🏎️', 'Volvo_C70'],
  ['volvo-ex90', 'volvo', 'Volvo EX90', 'electric', '⚡', 'Volvo_EX90'],
  // Mazda
  ['mazda-bt50', 'mazda', 'Mazda BT-50', 'offroad', '🛻', 'Mazda_BT-50'],
  ['mazda-cx90', 'mazda', 'Mazda CX-90', 'suv', '🚙', 'Mazda_CX-90'],
  ['mazda-cx70', 'mazda', 'Mazda CX-70', 'suv', '🚙', 'Mazda_CX-70'],
  // Škoda
  ['skoda-kodiaq-rs', 'skoda', 'Škoda Kodiaq RS', 'sport', '🏎️', 'Škoda_Kodiaq'],
  ['skoda-elroq', 'skoda', 'Škoda Elroq', 'electric', '⚡', 'Škoda_Elroq'],
  // SEAT
  ['seat-born', 'seat', 'SEAT el-Born', 'electric', '⚡', 'Cupra_Born'],
  ['seat-cordoba', 'seat', 'SEAT Cordoba', 'family', '🚗', 'SEAT_Córdoba'],
  // Dacia
  ['dacia-pickup', 'dacia', 'Dacia Duster Pickup', 'offroad', '🛻', 'Dacia_Duster'],
  // Alfa Romeo
  ['alfa-romeo-gt', 'alfaromeo', 'Alfa Romeo GT', 'sport', '🏎️', 'Alfa_Romeo_GT'],
  ['alfa-romeo-sz', 'alfaromeo', 'Alfa Romeo SZ', 'classic', '🏎️', 'Alfa_Romeo_SZ'],
  // BYD
  ['byd-denza', 'byd', 'BYD Denza D9', 'family', '⚡', 'Denza_D9'],
  ['byd-ocean-m', 'byd', 'BYD Ocean-M', 'electric', '⚡', 'BYD_Dolphin'],
  // Suzuki
  ['suzuki-celerio', 'suzuki', 'Suzuki Celerio', 'city', '🚗', 'Suzuki_Celerio'],
  ['suzuki-carry', 'suzuki', 'Suzuki Carry', 'offroad', '🛻', 'Suzuki_Carry'],
  ['suzuki-escudo', 'suzuki', 'Suzuki Escudo', 'offroad', '🚙', 'Suzuki_Escudo'],
  // Lexus
  ['lexus-nx-phev', 'lexus', 'Lexus NX PHEV', 'electric', '⚡', 'Lexus_NX'],
  ['lexus-sc', 'lexus', 'Lexus SC', 'sport', '🏎️', 'Lexus_SC'],
  // Subaru
  ['subaru-sambar', 'subaru', 'Subaru Sambar', 'city', '🚗', 'Subaru_Sambar'],
  ['subaru-tribeca', 'subaru', 'Subaru Tribeca', 'suv', '🚙', 'Subaru_Tribeca'],
  // Mitsubishi
  ['mitsubishi-delica', 'mitsubishi', 'Mitsubishi Delica', 'offroad', '🚙', 'Mitsubishi_Delica'],
  ['mitsubishi-i-miev', 'mitsubishi', 'Mitsubishi i-MiEV', 'electric', '⚡', 'Mitsubishi_i-MiEV'],
  // MINI
  ['mini-convertible', 'mini', 'MINI Convertible', 'sport', '🏎️', 'Mini_Convertible'],
  ['mini-coupe', 'mini', 'MINI Coupé', 'sport', '🏎️', 'Mini_Coupé_and_Roadster'],
  // Cadillac
  ['cadillac-celestiq', 'cadillac', 'Cadillac Celestiq', 'electric', '⚡', 'Cadillac_Celestiq'],
  ['cadillac-fleetwood', 'cadillac', 'Cadillac Fleetwood', 'classic', '🚗', 'Cadillac_Fleetwood'],
  // Maserati
  ['maserati-3200gt', 'maserati', 'Maserati 3200 GT', 'sport', '🏎️', 'Maserati_3200_GT'],
  // Bentley
  ['bentley-speed-six', 'bentley', 'Bentley Speed Six', 'classic', '🏎️', 'Bentley_Speed_Six'],
  // Rolls-Royce
  ['rollsroyce-silver-ghost', 'rollsroyce', 'Rolls-Royce Silver Ghost', 'classic', '🚗', 'Rolls-Royce_Silver_Ghost'],
  ['rollsroyce-corniche', 'rollsroyce', 'Rolls-Royce Corniche', 'classic', '🚗', 'Rolls-Royce_Corniche'],
  // Aston Martin
  ['astonmartin-db9', 'astonmartin', 'Aston Martin DB9', 'sport', '🏎️', 'Aston_Martin_DB9'],
  ['astonmartin-vulcan', 'astonmartin', 'Aston Martin Vulcan', 'sport', '🏎️', 'Aston_Martin_Vulcan'],
  // McLaren
  ['mclaren-765lt', 'mclaren', 'McLaren 765LT', 'sport', '🏎️', 'McLaren_765LT'],
  ['mclaren-mp4-12c', 'mclaren', 'McLaren MP4-12C', 'sport', '🏎️', 'McLaren_12C'],
  // Fiat
  ['fiat-grande-punto', 'fiat', 'Fiat Grande Punto', 'family', '🚗', 'Fiat_Grande_Punto'],
  ['fiat-uno', 'fiat', 'Fiat Uno', 'classic', '🚗', 'Fiat_Uno'],
  ['fiat-abarth-595', 'fiat', 'Abarth 595', 'sport', '🏎️', 'Abarth_595'],
  // Opel
  ['opel-speedster', 'opel', 'Opel Speedster', 'sport', '🏎️', 'Opel_Speedster'],
  ['opel-karl', 'opel', 'Opel Karl', 'city', '🚗', 'Opel_Karl'],
  ['opel-ampera', 'opel', 'Opel Ampera', 'electric', '⚡', 'Opel_Ampera'],
  // Jaguar
  ['jaguar-xk120', 'jaguar', 'Jaguar XK120', 'classic', '🏎️', 'Jaguar_XK120'],
  ['jaguar-d-type', 'jaguar', 'Jaguar D-Type', 'classic', '🏎️', 'Jaguar_D-Type'],
  // Land Rover
  ['land-rover-range-rover-sport-sv', 'landrover', 'Range Rover Sport SV', 'sport', '🏎️', 'Range_Rover_Sport'],
  // Jeep
  ['jeep-commander', 'jeep', 'Jeep Commander', 'suv', '🚙', 'Jeep_Commander'],
  // Tesla
  ['tesla-model-s-plaid', 'tesla', 'Tesla Model S Plaid', 'electric', '⚡', 'Tesla_Model_S'],
  // Dodge
  ['dodge-journey', 'dodge', 'Dodge Journey', 'suv', '🚙', 'Dodge_Journey'],
  ['dodge-neon', 'dodge', 'Dodge Neon', 'city', '🚗', 'Dodge_Neon'],
  // SsangYong
  ['ssangyong-chairman', 'ssangyong', 'SsangYong Chairman', 'premium', '🚗', 'SsangYong_Chairman'],
  // Infiniti
  ['infiniti-q70', 'infiniti', 'Infiniti Q70', 'premium', '🚗', 'Infiniti_Q70'],
  // Daihatsu
  ['daihatsu-charade', 'daihatsu', 'Daihatsu Charade', 'city', '🚗', 'Daihatsu_Charade'],
  ['daihatsu-mira', 'daihatsu', 'Daihatsu Mira', 'city', '🚗', 'Daihatsu_Mira'],
  // Chrysler
  ['chrysler-airflow', 'chrysler', 'Chrysler Airflow', 'electric', '⚡', 'Chrysler_Airflow'],
  ['chrysler-new-yorker', 'chrysler', 'Chrysler New Yorker', 'classic', '🚗', 'Chrysler_New_Yorker'],
  // GMC
  ['gmc-jimmy', 'gmc', 'GMC Jimmy', 'classic', '🚙', 'GMC_Jimmy'],
  // Ram
  ['ram-power-wagon', 'ram', 'Ram Power Wagon', 'offroad', '🛻', 'Dodge_Power_Wagon'],
  // Bugatti
  ['bugatti-mistral', 'bugatti', 'Bugatti Mistral', 'sport', '🏎️', 'Bugatti_Mistral'],
  // Lancia
  ['lancia-beta', 'lancia', 'Lancia Beta', 'classic', '🚗', 'Lancia_Beta'],
  ['lancia-aurelia', 'lancia', 'Lancia Aurelia', 'classic', '🏎️', 'Lancia_Aurelia'],
  // Tata
  ['tata-hexa', 'tata', 'Tata Hexa', 'suv', '🚙', 'Tata_Hexa'],
  ['tata-tigor', 'tata', 'Tata Tigor', 'city', '🚗', 'Tata_Tigor'],
  // Mahindra
  ['mahindra-marazzo', 'mahindra', 'Mahindra Marazzo', 'family', '🚗', 'Mahindra_Marazzo'],
  ['mahindra-e20', 'mahindra', 'Mahindra e2o', 'electric', '⚡', 'Mahindra_e2o'],
  // Lada
  ['lada-xray', 'lada', 'Lada XRAY', 'suv', '🚙', 'Lada_XRAY'],
  // Cupra
  ['cupra-urbanrebel', 'cupra', 'Cupra UrbanRebel', 'electric', '⚡', 'Cupra_UrbanRebel'],
  // Lincoln
  ['lincoln-mkz', 'lincoln', 'Lincoln MKZ', 'family', '🚗', 'Lincoln_MKZ'],
  // Pontiac
  ['pontiac-fiero', 'pontiac', 'Pontiac Fiero', 'sport', '🏎️', 'Pontiac_Fiero'],
  ['pontiac-aztek', 'pontiac', 'Pontiac Aztek', 'suv', '🚙', 'Pontiac_Aztek'],
  // NIO
  ['nio-et5-touring', 'nio', 'NIO ET5 Touring', 'family', '⚡', 'Nio_ET5'],
  // Geely
  ['geely-tugella', 'geely', 'Geely Tugella', 'suv', '🚙', 'Geely_Xingyue'],
  // Chery
  ['chery-tiggo3', 'chery', 'Chery Tiggo 3', 'suv', '🚙', 'Chery_Tiggo_3'],
  // Great Wall
  ['greatwall-cannon', 'greatwall', 'GWM Cannon', 'offroad', '🛻', 'Great_Wall_Cannon'],
  // Proton
  ['proton-exora', 'proton', 'Proton Exora', 'family', '🚗', 'Proton_Exora'],
  // DS
  ['ds-e-tense', 'ds', 'DS E-Tense', 'electric', '⚡', 'DS_E-Tense'],
  // Buick
  ['buick-century', 'buick', 'Buick Century', 'classic', '🚗', 'Buick_Century'],
  // MG
  ['mg-a', 'mg', 'MG A', 'classic', '🏎️', 'MG_MGA'],
  ['mg-midget', 'mg', 'MG Midget', 'classic', '🏎️', 'MG_Midget'],
  // Rivian
  ['rivian-r3x', 'rivian', 'Rivian R3X', 'electric', '⚡', 'Rivian'],
  // Genesis
  ['genesis-gv80-coupe', 'genesis', 'Genesis GV80 Coupé', 'suv', '🚙', 'Genesis_GV80'],
  // Lotus
  ['lotus-cortina', 'lotus', 'Lotus Cortina', 'classic', '🏎️', 'Lotus_Cortina'],
  // Koenigsegg
  ['koenigsegg-ccr', 'koenigsegg', 'Koenigsegg CCR', 'sport', '🏎️', 'Koenigsegg_CCR'],
  // Polestar
  ['polestar-5', 'polestar', 'Polestar 5', 'electric', '⚡', 'Polestar_5'],
  // Pagani
  ['pagani-huayra-r', 'pagani', 'Pagani Huayra R', 'sport', '🏎️', 'Pagani_Huayra'],
  // Alpine
  ['alpine-a110r', 'alpine', 'Alpine A110 R', 'sport', '🏎️', 'Alpine_A110_(2017)'],
  // Dacia
  ['dacia-solenza', 'dacia', 'Dacia Solenza', 'family', '🚗', 'Dacia_Solenza'],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function batchFetchWikiImages(wikiTitles, size = 400) {
  const result = new Map();
  const BATCH_SIZE = 50;
  const UA = 'KubaGeoCars/1.0 (educational app; geocars@example.com)';
  for (let i = 0; i < wikiTitles.length; i += BATCH_SIZE) {
    const batch = wikiTitles.slice(i, i + BATCH_SIZE);
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(batch.join('|'))}&prop=pageimages&format=json&pithumbsize=${size}&redirects=1&origin=*`;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const resp = await fetch(url, { headers: { 'User-Agent': UA } });
        if (!resp.ok) { await sleep(2000); continue; }
        const data = await resp.json();
        const pages = data?.query?.pages || {};
        const nm = {}; for (const n of data?.query?.normalized || []) nm[n.to] = n.from;
        const rm = {}; for (const r of data?.query?.redirects || []) rm[r.to] = r.from;
        for (const page of Object.values(pages)) {
          if (page.thumbnail?.source) {
            let t = page.title;
            if (rm[t]) t = rm[t];
            if (nm[t]) t = nm[t];
            result.set(t.replace(/ /g, '_'), page.thumbnail.source);
          }
        }
        break;
      } catch (err) { await sleep(2000); }
    }
    if (i + BATCH_SIZE < wikiTitles.length) { process.stdout.write(`  ${Math.min(i + BATCH_SIZE, wikiTitles.length)}/${wikiTitles.length}\n`); await sleep(500); }
  }
  return result;
}

function downloadImage(imageUrl, destPath) {
  if (existsSync(destPath)) return true;
  try {
    execSync(`curl -sS -L -f -o "${destPath}" -H "User-Agent: KubaGeoCars/1.0 (educational app)" "${imageUrl}"`, { timeout: 30000, stdio: 'pipe' });
    if (existsSync(destPath) && statSync(destPath).size >= 500) return true;
    try { execSync(`rm -f "${destPath}"`, { stdio: 'pipe' }); } catch {}
    return false;
  } catch {
    try { execSync(`rm -f "${destPath}"`, { stdio: 'pipe' }); } catch {}
    return false;
  }
}

async function main() {
  const existing = JSON.parse(await readFile(JSON_PATH, 'utf-8'));
  const existingIds = new Set(existing.entities.map(e => e.id));
  await mkdir(CARS_DIR, { recursive: true });

  const newModels = [];
  for (const [id, brandId, name, category, emoji] of WAVE4_MODELS) {
    const eid = `model:${id}`;
    if (existingIds.has(eid)) continue;
    newModels.push({ id: eid, kind: 'car_model', titlePl: name, media: { emoji, iconUrl: `images/cars/${id}.png` }, tags: ['cars', category], relations: [{ type: 'brand', target: `car:${brandId}` }, { type: 'category', value: category }] });
  }
  console.log(`New models: ${newModels.length}`);

  const wikiTitles = WAVE4_MODELS.filter(([id]) => !existingIds.has(`model:${id}`)).map(([,,,,, w]) => w);
  const map = await batchFetchWikiImages(wikiTitles, 400);
  console.log(`Found ${map.size}/${wikiTitles.length}`);

  let ok = 0;
  for (const [id,,,,, wiki] of WAVE4_MODELS) {
    if (existingIds.has(`model:${id}`)) continue;
    const dest = join(CARS_DIR, `${id}.png`);
    if (existsSync(dest)) { ok++; continue; }
    const imgUrl = map.get(wiki);
    if (!imgUrl) { process.stdout.write('x'); continue; }
    const success = downloadImage(imgUrl, dest);
    process.stdout.write(success ? '✓' : 'x');
    if (success) ok++;
    await sleep(200);
  }
  console.log(`\nDownloaded: ${ok}`);

  const final = newModels.filter(e => existsSync(join(CARS_DIR, e.media.iconUrl.split('/').pop())));
  existing.entities = [...existing.entities, ...final];
  await writeFile(JSON_PATH, JSON.stringify(existing));
  console.log(`Final: ${existing.entities.length} entities`);
}

main().catch(err => { console.error(err); process.exit(1); });
