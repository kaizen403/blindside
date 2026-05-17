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

  // Create link form
  const [slug, setSlug] = useState("");
  const [label, setLabel] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("https://blindwall.tech");
  const [creating, setCreating] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);

  const fetchHits = () => {
    fetch("/api/tracks")
      .then((r) => r.json())
      .then((d) => { setHits(d); setLoading(false); });
  };

  useEffect(() => {
    fetchHits();
    const interval = setInterval(fetchHits, 15000);
    return () => clearInterval(interval);
  }, []);

  const createLink = async () => {
    if (!slug) return;
    setCreating(true);
    const res = await fetch("/api/tracks/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, label, redirectUrl }),
    });
    if (res.ok) {
      const origin = window.location.origin;
      setCreatedLink(`${origin}/t/${slug}`);
      setSlug("");
      setLabel("");
    }
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-red-500">🎯 Track Links</h1>

      {/* Create link */}
      <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
        <h2 className="font-semibold mb-3 text-white/80">Create tracking link</h2>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="text-white/40 text-sm self-center whitespace-nowrap">blindwall.tech/t/</span>
            <input
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-red-500"
              placeholder="ashirwad"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            />
          </div>
          <input
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-red-500"
            placeholder="Label (optional, e.g. Ashirwad)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <input
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-red-500"
            placeholder="Redirect URL (default: blindwall.tech)"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
          />
          <button
            onClick={createLink}
            disabled={creating || !slug}
            className="bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
          >
            {creating ? "Creating..." : "Create link"}
          </button>
          {createdLink && (
            <div
              className="mt-1 p-3 bg-green-500/10 border border-green-500/30 rounded-lg cursor-pointer"
              onClick={() => { navigator.clipboard.writeText(createdLink); }}
            >
              <span className="text-green-400 text-sm font-mono">{createdLink}</span>
              <span className="text-white/30 text-xs ml-2">tap to copy</span>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden mb-6 border border-white/10" style={{ height: 380 }}>
        {!loading && <Map hits={hits} onSelect={setSelected} />}
      </div>

      {/* Selected hit detail */}
      {selected && (
        <div className="mb-4 p-4 bg-white/5 border border-red-500/30 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <h2 className="font-bold text-red-400">/t/{selected.link.slug} {selected.link.label && `· ${selected.link.label}`}</h2>
            <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white text-lg">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-white/40 text-xs">IP</span><br /><code className="text-green-400">{selected.ip}</code></div>
            <div><span className="text-white/40 text-xs">Location</span><br />{[selected.city, selected.region, selected.country].filter(Boolean).join(", ")}</div>
            <div><span className="text-white/40 text-xs">ISP</span><br />{selected.isp || "—"}</div>
            <div><span className="text-white/40 text-xs">Device</span><br />{selected.device} · {selected.browser} · {selected.os}</div>
            <div><span className="text-white/40 text-xs">Time</span><br />{new Date(selected.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</div>
            {selected.lat && selected.lon && (
              <div>
                <span className="text-white/40 text-xs">Coords</span><br />
                <a href={`https://maps.google.com/?q=${selected.lat},${selected.lon}`} target="_blank" className="text-red-400 underline text-sm">
                  {selected.lat.toFixed(4)}, {selected.lon.toFixed(4)} ↗
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hits list */}
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-white/60 text-sm">{hits.length} hit{hits.length !== 1 ? "s" : ""}</h2>
          <button onClick={fetchHits} className="text-white/30 hover:text-white text-xs">↻ refresh</button>
        </div>
        {loading && <p className="text-white/40 text-sm">Loading...</p>}
        {!loading && hits.length === 0 && <p className="text-white/30 text-sm">No hits yet. Share a link to start tracking.</p>}
        {hits.map((hit) => (
          <div
            key={hit.id}
            onClick={() => setSelected(hit)}
            className="cursor-pointer p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-between gap-2"
          >
            <div className="min-w-0">
              <span className="text-red-400 font-mono text-sm">/t/{hit.link.slug}</span>
              <span className="ml-2 text-white/60 text-sm">{hit.ip}</span>
              <span className="ml-2 text-white/40 text-sm truncate">{[hit.city, hit.country].filter(Boolean).join(", ")}</span>
            </div>
            <span className="text-white/30 text-xs whitespace-nowrap">{new Date(hit.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
