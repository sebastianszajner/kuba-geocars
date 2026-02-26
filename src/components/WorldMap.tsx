import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { GeoJsonObject, Feature } from 'geojson';
import type { Layer, LeafletMouseEvent } from 'leaflet';
import { useGameStore } from '../store/gameStore';
import { useSessionStore } from '../store/sessionStore';
import { usePackStore } from '../store/packStore';
import { getCountryMeta } from '../data/countries';

const GEOJSON_URL =
  'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';

const DEFAULT_STYLE = {
  color: '#64748b',
  weight: 1,
  fillColor: '#e2e8f0',
  fillOpacity: 0.3,
};

const SELECTED_STYLE = {
  color: '#2563eb',
  weight: 2,
  fillColor: '#bfdbfe',
  fillOpacity: 0.5,
};

const HAS_CONTENT_STYLE = {
  color: '#64748b',
  weight: 1,
  fillColor: '#bbf7d0',
  fillOpacity: 0.35,
};

export default function WorldMap() {
  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);
  const [loading, setLoading] = useState(true);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  const { selectedCountry, setSelectedCountry, setGeoJsonLoaded, mode, setOverlay } = useGameStore();
  const { sessionEnded } = useSessionStore();
  const { countriesWithContent } = usePackStore();

  const contentCountryNames = new Set(countriesWithContent().map((e) => e.titlePl));

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((data) => {
        setGeoData(data);
        setGeoJsonLoaded(true);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [setGeoJsonLoaded]);

  const onEachFeature = (feature: Feature, layer: Layer) => {
    layer.on({
      click: (e: LeafletMouseEvent) => {
        if (sessionEnded) return;
        const name = feature.properties?.name ?? '';
        setSelectedCountry(name);

        if (mode !== 'explore') {
          setOverlay('quiz');
        }
      },
      mouseover: (e: LeafletMouseEvent) => {
        const target = e.target;
        if (feature.properties?.name !== selectedCountry) {
          target.setStyle({ fillOpacity: 0.5, weight: 2 });
        }
      },
      mouseout: (e: LeafletMouseEvent) => {
        if (geoJsonRef.current) {
          geoJsonRef.current.resetStyle(e.target);
        }
      },
    });
  };

  const styleFeature = (feature?: Feature) => {
    if (!feature?.properties?.name) return DEFAULT_STYLE;
    const name = feature.properties.name;

    if (name === selectedCountry) return SELECTED_STYLE;

    const meta = getCountryMeta(name);
    if (meta && contentCountryNames.has(meta.namePl)) return HAS_CONTENT_STYLE;

    return DEFAULT_STYLE;
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[52, 15]}
        zoom={4}
        minZoom={2}
        maxZoom={8}
        className="h-full w-full z-0"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={8}
        />
        {geoData && (
          <GeoJSON
            ref={(ref) => { geoJsonRef.current = ref; }}
            data={geoData}
            style={styleFeature}
            onEachFeature={onEachFeature}
            key={selectedCountry ?? 'none'}
          />
        )}
      </MapContainer>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
          <div className="text-center">
            <div className="text-2xl mb-2">Wczytywanie mapy...</div>
            <div className="text-sm text-gray-500">Pobieranie danych krajow</div>
          </div>
        </div>
      )}
    </div>
  );
}
