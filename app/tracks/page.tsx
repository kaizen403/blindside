"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/app/tracks/TrackMap"), { ssr: false });

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
  userAgent: string | null;
  createdAt: string;
  link: { slug: string; label: string | null };
};

export default function TracksPage() {
  const [hits, setHits] = useState<Hit[]>([]);
  const [selected, setSelected] = useState<Hit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tracks")
      .then((r) => r.json())
      .then((d) => { setHits(d); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-red-500">Track Hits</h1>

      {/* Map */}
      <div className="rounded-xl overflow-hidden mb-6 border border-white/10" style={{ height: 400 }}>
        {!loading && <Map hits={hits} onSelect={setSelected} />}
      </div>

      {/* Selected hit detail */}
      {selected && (
        <div className="mb-4 p-4 bg-white/5 border border-red-500/30 rounded-xl">
          <div className="flex justify-between items-start">
            <h2 className="font-bold text-red-400">/{selected.link.slug}</h2>
            <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white">✕</button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-white/40">IP</span><br /><code className="text-green-400">{selected.ip}</code></div>
            <div><span className="text-white/40">Location</span><br />{selected.city}, {selected.region}, {selected.country}</div>
            <div><span className="text-white/40">ISP</span><br />{selected.isp}</div>
            <div><span className="text-white/40">Device</span><br />{selected.device} · {selected.browser} · {selected.os}</div>
            <div><span className="text-white/40">Time</span><br />{new Date(selected.createdAt).toLocaleString("en-IN")}</div>
            {selected.lat && selected.lon && (
              <div>
                <a
                  href={`https://maps.google.com/?q=${selected.lat},${selected.lon}`}
                  target="_blank"
                  className="text-red-400 underline"
                >
                  Open in Maps ↗
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hits list */}
      <div className="space-y-2">
        {loading && <p className="text-white/40">Loading...</p>}
        {hits.map((hit) => (
          <div
            key={hit.id}
            onClick={() => setSelected(hit)}
            className="cursor-pointer p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-between"
          >
            <div>
              <span className="text-red-400 font-mono text-sm">/{hit.link.slug}</span>
              <span className="ml-2 text-white/60 text-sm">{hit.ip}</span>
              <span className="ml-2 text-white/40 text-sm">{hit.city}, {hit.country}</span>
            </div>
            <span className="text-white/30 text-xs">{new Date(hit.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
