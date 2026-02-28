import { useMemo } from 'react';
import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useGameStore } from '../store/gameStore';
import { usePackStore } from '../store/packStore';
import { COUNTRIES } from '../data/countries';

interface MarkerData {
  nameEn: string;
  lat: number;
  lng: number;
  code: string;
  brandLogos: string[]; // resolved URLs (max 3)
}

function resolveUrl(iconUrl: string): string {
  if (iconUrl.startsWith('http')) return iconUrl;
  const base = import.meta.env.BASE_URL ?? '/';
  return `${base}${iconUrl.replace(/^\//, '')}`;
}

export default function CountryMarkers() {
  const { setSelectedCountry, mode, setOverlay } = useGameStore();
  const allEntities = usePackStore((s) => s.allEntities);

  const map = useMap();

  const markers = useMemo<MarkerData[]>(() => {
    if (allEntities.length === 0) return [];

    // Build country content index
    const countryIds = new Set<string>();
    for (const e of allEntities) {
      for (const r of e.relations) {
        if (r.type === 'origin_country' && r.target) countryIds.add(r.target);
      }
    }

    const indexById = new Map(allEntities.map((e) => [e.id, e]));
    const contentCountries = [...countryIds]
      .map((id) => indexById.get(id))
      .filter(Boolean) as typeof allEntities;

    const result: MarkerData[] = [];

    for (const [geoName, meta] of Object.entries(COUNTRIES)) {
      const entity = contentCountries.find((c) => c.titlePl === meta.namePl);
      if (!entity) continue;

      const brands = allEntities.filter(
        (e) => e.kind === 'car_brand' && e.relations.some((r) => r.type === 'origin_country' && r.target === entity.id),
      );
      const logos = brands
        .filter((b) => b.media.iconUrl)
        .slice(0, 3)
        .map((b) => resolveUrl(b.media.iconUrl!));

      result.push({
        nameEn: geoName,
        lat: meta.lat,
        lng: meta.lng,
        code: meta.code,
        brandLogos: logos,
      });
    }

    return result;
  }, [allEntities]);

  const handleClick = (nameEn: string) => {
    setSelectedCountry(nameEn);
    if (mode !== 'explore') {
      setOverlay('quiz');
    }
  };

  return (
    <>
      {markers.map((m) => {
        const flagUrl = `https://flagcdn.com/w160/${m.code}.png`;
        const hasLogos = m.brandLogos.length > 0;

        const html = `
          <div class="country-marker" style="
            display:flex; flex-direction:column; align-items:center; gap:4px;
            background:white; border-radius:14px; padding:6px 8px;
            box-shadow:0 3px 12px rgba(0,0,0,0.3); cursor:pointer;
            border:2px solid #e2e8f0;
          ">
            <img src="${flagUrl}" style="height:40px; border-radius:4px; display:block;" onerror="this.style.display='none'" />
            ${hasLogos ? `
              <div style="display:flex; gap:4px; align-items:center;">
                ${m.brandLogos.map((url) => `
                  <img src="${url}" style="width:36px; height:36px; object-fit:contain; border-radius:6px;" onerror="this.style.display='none'" />
                `).join('')}
              </div>
            ` : ''}
          </div>
        `;

        const iconWidth = hasLogos ? Math.max(80, m.brandLogos.length * 40 + 16) : 80;
        const iconHeight = hasLogos ? 96 : 56;

        const icon = L.divIcon({
          html,
          className: '',
          iconSize: [iconWidth, iconHeight],
          iconAnchor: [iconWidth / 2, iconHeight / 2],
        });

        return (
          <Marker
            key={m.nameEn}
            position={[m.lat, m.lng]}
            icon={icon}
            eventHandlers={{
              click: () => handleClick(m.nameEn),
            }}
          />
        );
      })}
    </>
  );
}
