import { POLAND } from '../data/countries';

const R_EARTH = 6371; // km

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R_EARTH * c);
}

export function distanceFromPoland(lat: number, lng: number): number {
  return haversineKm(POLAND.lat, POLAND.lng, lat, lng);
}

export type CardinalDirection = 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW' | 'center';

export function directionFromPoland(lat: number, lng: number): {
  cardinal: CardinalDirection;
  label: string;
} {
  const dLat = lat - POLAND.lat;
  const dLng = lng - POLAND.lng;

  const threshold = 2; // degrees — to avoid "exact center" for nearby countries

  const ns = dLat > threshold ? 'na p\u00f3\u0142noc' : dLat < -threshold ? 'na po\u0142udnie' : '';
  const ew = dLng > threshold ? 'na wsch\u00f3d' : dLng < -threshold ? 'na zach\u00f3d' : '';

  if (!ns && !ew) return { cardinal: 'center', label: 'blisko Polski' };

  const label = [ns, ew].filter(Boolean).join(' i ');

  let cardinal: CardinalDirection;
  if (ns && ew) {
    cardinal = `${dLat > 0 ? 'N' : 'S'}${dLng > 0 ? 'E' : 'W'}` as CardinalDirection;
  } else if (ns) {
    cardinal = dLat > 0 ? 'N' : 'S';
  } else {
    cardinal = dLng > 0 ? 'E' : 'W';
  }

  return { cardinal, label };
}

// Compass arrow rotation in degrees (0 = up/north)
export function cardinalToDeg(c: CardinalDirection): number {
  const map: Record<CardinalDirection, number> = {
    N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315, center: 0,
  };
  return map[c];
}
