"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Hit = {
  id: string;
  ip: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  lat: number | null;
  lon: number | null;
  isp: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  createdAt: string;
  link: { slug: string; label: string | null };
};

export default function TrackMap({
  hits,
  onSelect,
}: {
  hits: Hit[];
  onSelect: (hit: Hit) => void;
}) {
  const validHits = hits.filter((h) => h.lat && h.lon);
  const center: [number, number] =
    validHits.length > 0
      ? [validHits[0].lat!, validHits[0].lon!]
      : [20.5937, 78.9629]; // India default

  return (
    <MapContainer
      center={center}
      zoom={validHits.length > 0 ? 6 : 4}
      style={{ height: "100%", width: "100%", background: "#111" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {validHits.map((hit) => (
        <Marker
          key={hit.id}
          position={[hit.lat!, hit.lon!]}
          eventHandlers={{ click: () => onSelect(hit) }}
        >
          <Popup>
            <div style={{ color: "#000" }}>
              <b>/{hit.link.slug}</b><br />
              {hit.ip}<br />
              {hit.city}, {hit.country}<br />
              {hit.browser} · {hit.os}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
