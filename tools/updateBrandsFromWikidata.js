#!/usr/bin/env node
/**
 * updateBrandsFromWikidata.js
 *
 * Fetches car brand data from Wikidata using SPARQL.
 * Uses property P495 (country of origin) to determine brand origin.
 *
 * Usage:
 *   node tools/updateBrandsFromWikidata.js
 *
 * Output:
 *   Writes to public/data/brands-wikidata.json
 *   Review the output and merge with brands.json manually.
 *
 * Note: This is a helper tool, not a production dependency.
 * The app reads from public/data/brands.json which is curated manually.
 */

const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';

// SPARQL query: automobile manufacturers with their country of origin
const QUERY = `
SELECT ?brand ?brandLabel ?country ?countryLabel ?countryCode WHERE {
  ?brand wdt:P31/wdt:P279* wd:Q3041255 .   # instance of automobile manufacturer (or subclass)
  ?brand wdt:P495 ?country .                 # country of origin (P495)
  ?country wdt:P297 ?countryCode .           # ISO 3166-1 alpha-2 code
  SERVICE wikibase:label { bd:serviceParam wikibase:language "pl,en". }
}
ORDER BY ?countryLabel ?brandLabel
LIMIT 500
`;

// Flag emoji lookup by ISO alpha-2
const FLAG_EMOJI = {};
for (let i = 0; i < 26; i++) {
  for (let j = 0; j < 26; j++) {
    const code = String.fromCharCode(65 + i) + String.fromCharCode(65 + j);
    const emoji = String.fromCodePoint(0x1f1e6 + i) + String.fromCodePoint(0x1f1e6 + j);
    FLAG_EMOJI[code] = emoji;
  }
}

async function fetchBrands() {
  console.log('Fetching car brands from Wikidata...');

  const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(QUERY)}&format=json`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'KubaGeoCars/1.0 (educational app)',
      'Accept': 'application/sparql-results+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Wikidata query failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const bindings = data.results.bindings;

  console.log(`Got ${bindings.length} results from Wikidata.`);

  // Group by brand
  const brands = [];
  const seen = new Set();

  for (const row of bindings) {
    const brandLabel = row.brandLabel?.value;
    const countryLabel = row.countryLabel?.value;
    const countryCode = row.countryCode?.value?.toUpperCase();

    if (!brandLabel || !countryLabel || !countryCode) continue;
    if (seen.has(brandLabel)) continue;
    seen.add(brandLabel);

    brands.push({
      brand: brandLabel,
      originCountry: row.countryLabel?.value || countryLabel,
      originCountryPl: countryLabel, // Wikidata returns PL labels first
      flagEmoji: FLAG_EMOJI[countryCode] || '',
      category: ['wikidata-import'],
      examples: [],
    });
  }

  console.log(`Processed ${brands.length} unique brands.`);
  return brands;
}

async function main() {
  try {
    const brands = await fetchBrands();

    const fs = await import('fs');
    const path = await import('path');
    const outPath = path.join(process.cwd(), 'public', 'data', 'brands-wikidata.json');

    fs.writeFileSync(outPath, JSON.stringify(brands, null, 2), 'utf-8');
    console.log(`\nWritten to: ${outPath}`);
    console.log(`\nNext steps:`);
    console.log(`1. Review brands-wikidata.json`);
    console.log(`2. Add 'examples' and fix 'category' for notable brands`);
    console.log(`3. Merge selected entries into brands.json`);
    console.log(`4. Delete brands-wikidata.json`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
