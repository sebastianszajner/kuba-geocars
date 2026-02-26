import type { CountryMeta } from '../types';

// GeoJSON name -> country metadata
// Names match the "name" property in the GeoJSON from Natural Earth / johan/world.geo.json
export const COUNTRIES: Record<string, CountryMeta> = {
  // --- Countries with car brands ---
  'Japan': { namePl: 'Japonia', nameEn: 'Japan', flag: '\ud83c\uddef\ud83c\uddf5', continent: 'Asia', continentPl: 'Azja', lat: 35.6762, lng: 139.6503 },
  'Germany': { namePl: 'Niemcy', nameEn: 'Germany', flag: '\ud83c\udde9\ud83c\uddea', continent: 'Europe', continentPl: 'Europa', lat: 52.5200, lng: 13.4050 },
  'United States of America': { namePl: 'USA', nameEn: 'United States', flag: '\ud83c\uddfa\ud83c\uddf8', continent: 'North America', continentPl: 'Ameryka P\u00f3\u0142nocna', lat: 38.9072, lng: -77.0369 },
  'South Korea': { namePl: 'Korea Po\u0142udniowa', nameEn: 'South Korea', flag: '\ud83c\uddf0\ud83c\uddf7', continent: 'Asia', continentPl: 'Azja', lat: 37.5665, lng: 126.9780 },
  'France': { namePl: 'Francja', nameEn: 'France', flag: '\ud83c\uddeb\ud83c\uddf7', continent: 'Europe', continentPl: 'Europa', lat: 48.8566, lng: 2.3522 },
  'Italy': { namePl: 'W\u0142ochy', nameEn: 'Italy', flag: '\ud83c\uddee\ud83c\uddf9', continent: 'Europe', continentPl: 'Europa', lat: 41.9028, lng: 12.4964 },
  'United Kingdom': { namePl: 'Wielka Brytania', nameEn: 'United Kingdom', flag: '\ud83c\uddec\ud83c\udde7', continent: 'Europe', continentPl: 'Europa', lat: 51.5074, lng: -0.1278 },
  'Sweden': { namePl: 'Szwecja', nameEn: 'Sweden', flag: '\ud83c\uddf8\ud83c\uddea', continent: 'Europe', continentPl: 'Europa', lat: 59.3293, lng: 18.0686 },
  'Czech Republic': { namePl: 'Czechy', nameEn: 'Czech Republic', flag: '\ud83c\udde8\ud83c\uddff', continent: 'Europe', continentPl: 'Europa', lat: 50.0755, lng: 14.4378 },
  'Romania': { namePl: 'Rumunia', nameEn: 'Romania', flag: '\ud83c\uddf7\ud83c\uddf4', continent: 'Europe', continentPl: 'Europa', lat: 44.4268, lng: 26.1025 },
  'Spain': { namePl: 'Hiszpania', nameEn: 'Spain', flag: '\ud83c\uddea\ud83c\uddf8', continent: 'Europe', continentPl: 'Europa', lat: 40.4168, lng: -3.7038 },
  'India': { namePl: 'Indie', nameEn: 'India', flag: '\ud83c\uddee\ud83c\uddf3', continent: 'Asia', continentPl: 'Azja', lat: 28.6139, lng: 77.2090 },
  'China': { namePl: 'Chiny', nameEn: 'China', flag: '\ud83c\udde8\ud83c\uddf3', continent: 'Asia', continentPl: 'Azja', lat: 39.9042, lng: 116.4074 },
  'Malaysia': { namePl: 'Malezja', nameEn: 'Malaysia', flag: '\ud83c\uddf2\ud83c\uddfe', continent: 'Asia', continentPl: 'Azja', lat: 3.1390, lng: 101.6869 },
  'Russia': { namePl: 'Rosja', nameEn: 'Russia', flag: '\ud83c\uddf7\ud83c\uddfa', continent: 'Europe', continentPl: 'Europa', lat: 55.7558, lng: 37.6173 },

  // --- Poland (home) ---
  'Poland': { namePl: 'Polska', nameEn: 'Poland', flag: '\ud83c\uddf5\ud83c\uddf1', continent: 'Europe', continentPl: 'Europa', lat: 52.2297, lng: 21.0122 },

  // --- Poland's neighbors ---
  'Ukraine': { namePl: 'Ukraina', nameEn: 'Ukraine', flag: '\ud83c\uddfa\ud83c\udde6', continent: 'Europe', continentPl: 'Europa', lat: 50.4501, lng: 30.5234 },
  'Belarus': { namePl: 'Bia\u0142oru\u015b', nameEn: 'Belarus', flag: '\ud83c\udde7\ud83c\uddfe', continent: 'Europe', continentPl: 'Europa', lat: 53.9006, lng: 27.5590 },
  'Lithuania': { namePl: 'Litwa', nameEn: 'Lithuania', flag: '\ud83c\uddf1\ud83c\uddf9', continent: 'Europe', continentPl: 'Europa', lat: 54.6872, lng: 25.2797 },
  'Slovakia': { namePl: 'S\u0142owacja', nameEn: 'Slovakia', flag: '\ud83c\uddf8\ud83c\uddf0', continent: 'Europe', continentPl: 'Europa', lat: 48.1486, lng: 17.1077 },

  // --- Other notable European countries ---
  'Austria': { namePl: 'Austria', nameEn: 'Austria', flag: '\ud83c\udde6\ud83c\uddf9', continent: 'Europe', continentPl: 'Europa', lat: 48.2082, lng: 16.3738 },
  'Belgium': { namePl: 'Belgia', nameEn: 'Belgium', flag: '\ud83c\udde7\ud83c\uddea', continent: 'Europe', continentPl: 'Europa', lat: 50.8503, lng: 4.3517 },
  'Netherlands': { namePl: 'Holandia', nameEn: 'Netherlands', flag: '\ud83c\uddf3\ud83c\uddf1', continent: 'Europe', continentPl: 'Europa', lat: 52.3676, lng: 4.9041 },
  'Denmark': { namePl: 'Dania', nameEn: 'Denmark', flag: '\ud83c\udde9\ud83c\uddf0', continent: 'Europe', continentPl: 'Europa', lat: 55.6761, lng: 12.5683 },
  'Norway': { namePl: 'Norwegia', nameEn: 'Norway', flag: '\ud83c\uddf3\ud83c\uddf4', continent: 'Europe', continentPl: 'Europa', lat: 59.9139, lng: 10.7522 },
  'Finland': { namePl: 'Finlandia', nameEn: 'Finland', flag: '\ud83c\uddeb\ud83c\uddee', continent: 'Europe', continentPl: 'Europa', lat: 60.1699, lng: 24.9384 },
  'Switzerland': { namePl: 'Szwajcaria', nameEn: 'Switzerland', flag: '\ud83c\udde8\ud83c\udded', continent: 'Europe', continentPl: 'Europa', lat: 46.9481, lng: 7.4474 },
  'Portugal': { namePl: 'Portugalia', nameEn: 'Portugal', flag: '\ud83c\uddf5\ud83c\uddf9', continent: 'Europe', continentPl: 'Europa', lat: 38.7223, lng: -9.1393 },
  'Greece': { namePl: 'Grecja', nameEn: 'Greece', flag: '\ud83c\uddec\ud83c\uddf7', continent: 'Europe', continentPl: 'Europa', lat: 37.9838, lng: 23.7275 },
  'Ireland': { namePl: 'Irlandia', nameEn: 'Ireland', flag: '\ud83c\uddee\ud83c\uddea', continent: 'Europe', continentPl: 'Europa', lat: 53.3498, lng: -6.2603 },
  'Hungary': { namePl: 'W\u0119gry', nameEn: 'Hungary', flag: '\ud83c\udded\ud83c\uddfa', continent: 'Europe', continentPl: 'Europa', lat: 47.4979, lng: 19.0402 },
  'Croatia': { namePl: 'Chorwacja', nameEn: 'Croatia', flag: '\ud83c\udded\ud83c\uddf7', continent: 'Europe', continentPl: 'Europa', lat: 45.8150, lng: 15.9819 },
  'Bulgaria': { namePl: 'Bu\u0142garia', nameEn: 'Bulgaria', flag: '\ud83c\udde7\ud83c\uddec', continent: 'Europe', continentPl: 'Europa', lat: 42.6977, lng: 23.3219 },
  'Serbia': { namePl: 'Serbia', nameEn: 'Serbia', flag: '\ud83c\uddf7\ud83c\uddf8', continent: 'Europe', continentPl: 'Europa', lat: 44.7866, lng: 20.4489 },
  'Iceland': { namePl: 'Islandia', nameEn: 'Iceland', flag: '\ud83c\uddee\ud83c\uddf8', continent: 'Europe', continentPl: 'Europa', lat: 64.1466, lng: -21.9426 },

  // --- Turkey ---
  'Turkey': { namePl: 'Turcja', nameEn: 'Turkey', flag: '\ud83c\uddf9\ud83c\uddf7', continent: 'Asia', continentPl: 'Azja', lat: 41.0082, lng: 28.9784 },

  // --- Americas ---
  'Canada': { namePl: 'Kanada', nameEn: 'Canada', flag: '\ud83c\udde8\ud83c\udde6', continent: 'North America', continentPl: 'Ameryka P\u00f3\u0142nocna', lat: 45.4215, lng: -75.6972 },
  'Mexico': { namePl: 'Meksyk', nameEn: 'Mexico', flag: '\ud83c\uddf2\ud83c\uddfd', continent: 'North America', continentPl: 'Ameryka P\u00f3\u0142nocna', lat: 19.4326, lng: -99.1332 },
  'Brazil': { namePl: 'Brazylia', nameEn: 'Brazil', flag: '\ud83c\udde7\ud83c\uddf7', continent: 'South America', continentPl: 'Ameryka Po\u0142udniowa', lat: -15.7975, lng: -47.8919 },
  'Argentina': { namePl: 'Argentyna', nameEn: 'Argentina', flag: '\ud83c\udde6\ud83c\uddf7', continent: 'South America', continentPl: 'Ameryka Po\u0142udniowa', lat: -34.6037, lng: -58.3816 },

  // --- Africa ---
  'Egypt': { namePl: 'Egipt', nameEn: 'Egypt', flag: '\ud83c\uddea\ud83c\uddec', continent: 'Africa', continentPl: 'Afryka', lat: 30.0444, lng: 31.2357 },
  'South Africa': { namePl: 'RPA', nameEn: 'South Africa', flag: '\ud83c\uddff\ud83c\udde6', continent: 'Africa', continentPl: 'Afryka', lat: -33.9249, lng: 18.4241 },
  'Nigeria': { namePl: 'Nigeria', nameEn: 'Nigeria', flag: '\ud83c\uddf3\ud83c\uddec', continent: 'Africa', continentPl: 'Afryka', lat: 9.0579, lng: 7.4951 },
  'Morocco': { namePl: 'Maroko', nameEn: 'Morocco', flag: '\ud83c\uddf2\ud83c\udde6', continent: 'Africa', continentPl: 'Afryka', lat: 33.9716, lng: -6.8498 },
  'Kenya': { namePl: 'Kenia', nameEn: 'Kenya', flag: '\ud83c\uddf0\ud83c\uddea', continent: 'Africa', continentPl: 'Afryka', lat: -1.2921, lng: 36.8219 },

  // --- Middle East ---
  'Saudi Arabia': { namePl: 'Arabia Saudyjska', nameEn: 'Saudi Arabia', flag: '\ud83c\uddf8\ud83c\udde6', continent: 'Asia', continentPl: 'Azja', lat: 24.7136, lng: 46.6753 },
  'Israel': { namePl: 'Izrael', nameEn: 'Israel', flag: '\ud83c\uddee\ud83c\uddf1', continent: 'Asia', continentPl: 'Azja', lat: 31.7683, lng: 35.2137 },
  'United Arab Emirates': { namePl: 'Zjedn. Emiraty Arab.', nameEn: 'United Arab Emirates', flag: '\ud83c\udde6\ud83c\uddea', continent: 'Asia', continentPl: 'Azja', lat: 24.4539, lng: 54.3773 },

  // --- Other Asian ---
  'Thailand': { namePl: 'Tajlandia', nameEn: 'Thailand', flag: '\ud83c\uddf9\ud83c\udded', continent: 'Asia', continentPl: 'Azja', lat: 13.7563, lng: 100.5018 },
  'Vietnam': { namePl: 'Wietnam', nameEn: 'Vietnam', flag: '\ud83c\uddfb\ud83c\uddf3', continent: 'Asia', continentPl: 'Azja', lat: 21.0285, lng: 105.8542 },
  'Indonesia': { namePl: 'Indonezja', nameEn: 'Indonesia', flag: '\ud83c\uddee\ud83c\udde9', continent: 'Asia', continentPl: 'Azja', lat: -6.2088, lng: 106.8456 },
  'Philippines': { namePl: 'Filipiny', nameEn: 'Philippines', flag: '\ud83c\uddf5\ud83c\udded', continent: 'Asia', continentPl: 'Azja', lat: 14.5995, lng: 120.9842 },

  // --- Oceania ---
  'Australia': { namePl: 'Australia', nameEn: 'Australia', flag: '\ud83c\udde6\ud83c\uddfa', continent: 'Oceania', continentPl: 'Oceania', lat: -35.2809, lng: 149.1300 },
  'New Zealand': { namePl: 'Nowa Zelandia', nameEn: 'New Zealand', flag: '\ud83c\uddf3\ud83c\uddff', continent: 'Oceania', continentPl: 'Oceania', lat: -41.2865, lng: 174.7762 },
};

// Poland reference point
export const POLAND = { lat: 52.2297, lng: 21.0122 };

// Alternative name mappings for GeoJSON matching
export const NAME_ALIASES: Record<string, string> = {
  'USA': 'United States of America',
  'United States': 'United States of America',
  'Republic of Korea': 'South Korea',
  'Korea': 'South Korea',
  'Czechia': 'Czech Republic',
  'Russian Federation': 'Russia',
  'The Netherlands': 'Netherlands',
  'Republic of Ireland': 'Ireland',
  'Ivory Coast': "Cote d'Ivoire",
};

export function resolveCountryName(geoJsonName: string): string {
  return NAME_ALIASES[geoJsonName] || geoJsonName;
}

export function getCountryMeta(geoJsonName: string): CountryMeta | undefined {
  const resolved = resolveCountryName(geoJsonName);
  return COUNTRIES[resolved];
}
