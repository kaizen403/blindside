"use client";

export default function SecurityDashboard() {
  const W = 720;
  const H = 420;

  const cx = 230;
  const cy = 210;
  const r = 90;
  const stroke = 22;
  const inner = r - stroke / 2;
  const circ = 2 * Math.PI * inner;

  const segments = [
    { color: "#34d399", pct: 0.72, label: "Secure", offset: 0 },
    { color: "#eab308", pct: 0.18, label: "Warning", offset: 0.72 },
    { color: "#dc2626", pct: 0.10, label: "Critical", offset: 0.90 },
  ];

  const gap = 0.008;

  const bars = [
    { label: "Critical", count: 2, color: "#dc2626", width: 0.22 },
    { label: "High", count: 5, color: "#f97316", width: 0.48 },
    { label: "Low", count: 8, color: "#38bdf8", width: 0.78 },
  ];

  return (
    <div
      className="w-full relative"
      style={{
        filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.55))",
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto block"
      >
        <defs>
          <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
          </linearGradient>

          <linearGradient id="glowGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>

          <filter id="softGlow">
            <feGaussianBlur stdDeviation="18" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="barGlow" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="panelClip">
            <rect x="40" y="30" width="640" height="360" rx="16" />
          </clipPath>
        </defs>

        <rect x="40" y="30" width="640" height="360" rx="16" fill="#0c0c0e" opacity="0.95" />
        <rect x="40" y="30" width="640" height="360" rx="16" fill="url(#panelGrad)" />

        <rect
          x="40" y="30" width="640" height="360" rx="16"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <rect
          x="41" y="31" width="638" height="358" rx="15"
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="0.5"
        />

        <g clipPath="url(#panelClip)">
          <g opacity="0.03">
            {Array.from({ length: 18 }).map((_, i) => (
              <line
                key={`vg-${i}`}
                x1={60 + i * 34}
                y1={30}
                x2={60 + i * 34}
                y2={390}
                stroke="#fafafa"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={`hg-${i}`}
                x1={40}
                y1={50 + i * 36}
                x2={680}
                y2={50 + i * 36}
                stroke="#fafafa"
                strokeWidth="0.5"
              />
            ))}
          </g>

          <text x="68" y="62" fill="#fafafa" fontSize="11" fontFamily="system-ui" fontWeight="600" opacity="0.7">
            Security Overview
          </text>
          <text x="68" y="78" fill="#fafafa" fontSize="7" fontFamily="ui-monospace, monospace" opacity="0.25">
            SCAN COMPLETE — 47 ASSETS CHECKED
          </text>

          <text x="640" y="62" textAnchor="end" fill="#34d399" fontSize="9" fontFamily="system-ui" fontWeight="600" opacity="0.6">
            94% Secure
          </text>

          <line x1="68" y1="94" x2="652" y2="94" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          <circle cx={cx} cy={cy} r={r + 20} fill="url(#glowGrad)" opacity="0.6" filter="url(#softGlow)" />

          <circle cx={cx} cy={cy} r={inner} fill="none" stroke="#fafafa" strokeWidth={stroke} opacity="0.04" />

          {segments.map((seg, i) => {
            const arcLen = (seg.pct - gap) * circ;
            const dashOffset = circ - (seg.offset + gap / 2) * circ;
            return (
              <circle
                key={`seg-${i}`}
                cx={cx}
                cy={cy}
                r={inner}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={`${arcLen} ${circ - arcLen}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
                opacity={0.65}
                style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
              />
            );
          })}

          <circle cx={cx} cy={cy} r={inner - stroke / 2 - 3} fill="none" stroke="#fafafa" strokeWidth="0.5" opacity="0.04" />

          <text x={cx} y={cy - 6} textAnchor="middle" fill="#fafafa" fontSize="32" fontFamily="system-ui" fontWeight="700" opacity="0.85" letterSpacing="-0.02em">
            94
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fill="#fafafa" fontSize="9" fontFamily="system-ui" opacity="0.3">
            % secure
          </text>

          <text x={cx} y={cy + 55} textAnchor="middle" fill="#34d399" fontSize="7" fontFamily="ui-monospace, monospace" opacity="0.5">
            3 ISSUES FOUND
          </text>

          <g transform="translate(420, 120)">
            <text x="0" y="0" fill="#fafafa" fontSize="10" fontFamily="system-ui" fontWeight="600" opacity="0.45">
              Findings by Severity
            </text>

            {bars.map((bar, i) => {
              const y = 28 + i * 58;
              const barW = 200 * bar.width;
              return (
                <g key={bar.label}>
                  <text x="0" y={y} fill="#fafafa" fontSize="8" fontFamily="system-ui" fontWeight="600" opacity="0.55">
                    {bar.label}
                  </text>
                  <text x="200" y={y} textAnchor="end" fill={bar.color} fontSize="10" fontFamily="system-ui" fontWeight="700" opacity="0.7">
                    {bar.count}
                  </text>

                  <rect x="0" y={y + 8} width="200" height="6" rx="3" fill="#fafafa" opacity="0.04" />
                  <rect x="0" y={y + 8} width={barW} height="6" rx="3" fill={bar.color} opacity={0.35} filter="url(#barGlow)" />
                  <rect x="0" y={y + 8} width={barW} height="6" rx="3" fill={bar.color} opacity={0.55} />
                </g>
              );
            })}

            <g transform="translate(0, 220)">
              <text x="0" y="0" fill="#fafafa" fontSize="10" fontFamily="system-ui" fontWeight="600" opacity="0.45">
                Top Categories
              </text>

              {[
                { label: "A03 — Injection", pct: 0.45 },
                { label: "A07 — Auth Failures", pct: 0.30 },
                { label: "A01 — Broken Access", pct: 0.15 },
              ].map((cat, i) => {
                const y = 24 + i * 36;
                return (
                  <g key={cat.label}>
                    <text x="0" y={y} fill="#fafafa" fontSize="7.5" fontFamily="system-ui" opacity="0.35">
                      {cat.label}
                    </text>
                    <rect x="0" y={y + 6} width="160" height="4" rx="2" fill="#fafafa" opacity="0.04" />
                    <rect x="0" y={y + 6} width={160 * cat.pct} height="4" rx="2" fill="#fafafa" opacity="0.18" />
                  </g>
                );
              })}
            </g>
          </g>

          <g transform="translate(68, 340)">
            <text x="0" y="0" fill="#fafafa" fontSize="7" fontFamily="ui-monospace, monospace" opacity="0.2">
              Last scan: 2 minutes ago
            </text>
            <circle cx="240" cy="-2" r="2.5" fill="#34d399" opacity="0.5">
              <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x="248" y="0" fill="#34d399" fontSize="7" fontFamily="ui-monospace, monospace" opacity="0.4">
              monitoring active
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
