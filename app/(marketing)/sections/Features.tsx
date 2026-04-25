"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    title: "Vulnerability Detection",
    description:
      "Find hidden security weaknesses in your application and digital assets.",
    art: VulnArt,
  },
  {
    title: "Clear Risk Visibility",
    description:
      "Understand which issues matter most and where your biggest risks are.",
    art: VisibilityArt,
  },
  {
    title: "Simple Reporting",
    description:
      "Get an easy-to-understand report with findings and priority levels.",
    art: ReportArt,
  },
  {
    title: "Actionable Next Steps",
    description:
      "Know what should be fixed first to improve your security posture.",
    art: StepsArt,
  },
  {
    title: "Affordable Protection",
    description: "Start securing your application for just \u20B9999.",
    art: ShieldArt,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

function VulnArt() {
  const nodes = [
    { id: "WEB",  label: "WEB", x: 80,  y: 55,  color: "#dc2626", begin: "0.8s",
      shape: "hex" },
    { id: "API",  label: "API", x: 145, y: 40,  color: "#f97316", begin: "1.2s",
      shape: "circle" },
    { id: "MOB",  label: "MOB", x: 220, y: 50,  color: "#34d399", begin: "1.8s",
      shape: "roundsq" },
    { id: "NET",  label: "NET", x: 95,  y: 115, color: "#eab308", begin: "2.2s",
      shape: "diamond" },
    { id: "CLD",  label: "CLD", x: 175, y: 120, color: "#dc2626", begin: "2.6s",
      shape: "pentagon" },
    { id: "IOT",  label: "IOT", x: 245, y: 110, color: "#f97316", begin: "3.2s",
      shape: "triangle" },
  ];

  const edges = [
    [0, 1], [0, 3], [1, 2], [1, 4], [2, 5], [3, 4], [4, 5],
  ];

  const hexPoints = (r: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${r * Math.cos(a)},${r * Math.sin(a)}`;
    }).join(" ");

  const pentPoints = (r: number) =>
    Array.from({ length: 5 }, (_, i) => {
      const a = (2 * Math.PI * i) / 5 - Math.PI / 2;
      return `${r * Math.cos(a)},${r * Math.sin(a)}`;
    }).join(" ");

  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" role="img" aria-label="Multi-layer attack surface map">
      <defs>
        <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#34d399" stopOpacity="0" />
          <stop offset="50%"  stopColor="#34d399" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </linearGradient>
      </defs>

      {edges.map(([a, b], i) => (
        <line
          key={`edge-${i}`}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke="#fafafa" strokeWidth="0.5" opacity="0.08" strokeDasharray="3 6"
        />
      ))}

      {nodes.map((n) => (
        <g key={n.id} transform={`translate(${n.x},${n.y})`}>
          {n.shape === "hex" && (
            <polygon points={hexPoints(9)} fill="none" stroke="#fafafa" strokeWidth="0.75" opacity="0.15">
              <animate attributeName="stroke" values={`#fafafa;${n.color}`} dur="0.4s" begin={n.begin} fill="freeze" />
            </polygon>
          )}
          {n.shape === "circle" && (
            <circle r={9} fill="none" stroke="#fafafa" strokeWidth="0.75" opacity="0.15">
              <animate attributeName="stroke" values={`#fafafa;${n.color}`} dur="0.4s" begin={n.begin} fill="freeze" />
            </circle>
          )}
          {n.shape === "roundsq" && (
            <rect x={-9} y={-9} width={18} height={18} rx={3} fill="none" stroke="#fafafa" strokeWidth="0.75" opacity="0.15">
              <animate attributeName="stroke" values={`#fafafa;${n.color}`} dur="0.4s" begin={n.begin} fill="freeze" />
            </rect>
          )}
          {n.shape === "diamond" && (
            <polygon points="0,-10 10,0 0,10 -10,0" fill="none" stroke="#fafafa" strokeWidth="0.75" opacity="0.15">
              <animate attributeName="stroke" values={`#fafafa;${n.color}`} dur="0.4s" begin={n.begin} fill="freeze" />
            </polygon>
          )}
          {n.shape === "pentagon" && (
            <polygon points={pentPoints(9)} fill="none" stroke="#fafafa" strokeWidth="0.75" opacity="0.15">
              <animate attributeName="stroke" values={`#fafafa;${n.color}`} dur="0.4s" begin={n.begin} fill="freeze" />
            </polygon>
          )}
          {n.shape === "triangle" && (
            <polygon points="0,-10 9,8 -9,8" fill="none" stroke="#fafafa" strokeWidth="0.75" opacity="0.15">
              <animate attributeName="stroke" values={`#fafafa;${n.color}`} dur="0.4s" begin={n.begin} fill="freeze" />
            </polygon>
          )}

          <circle r={12} fill="none" stroke={n.color} strokeWidth="0.5" opacity="0">
            <animate attributeName="opacity" values="0;0.25" dur="0.3s" begin={n.begin} fill="freeze" />
            <animate attributeName="opacity" values="0.1;0.25;0.1" dur="3s" begin={`${parseFloat(n.begin) + 0.3}s`} repeatCount="indefinite" />
          </circle>

          <circle r={3} fill={n.color} opacity="0">
            <animate attributeName="opacity" values="0;0.5" dur="0.3s" begin={n.begin} fill="freeze" />
            <animate attributeName="opacity" values="0.35;0.5;0.35" dur="3s" begin={`${parseFloat(n.begin) + 0.3}s`} repeatCount="indefinite" />
          </circle>

          <text y={22} textAnchor="middle" fontSize="4" fill="#fafafa" opacity="0.12">{n.label}</text>
        </g>
      ))}

      <rect y={0} width={40} height={180} fill="url(#sweepGrad)" opacity="1">
        <animate attributeName="x" values="-40;320" dur="4s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}

function VisibilityArt() {
  type Severity = "CRIT" | "HIGH" | "MED" | "LOW" | "SAFE";

  const severityMap: Record<Severity, { color: string; opacity: number }> = {
    CRIT: { color: "#dc2626", opacity: 0.35 },
    HIGH: { color: "#f97316", opacity: 0.28 },
    MED:  { color: "#eab308", opacity: 0.20 },
    LOW:  { color: "#38bdf8", opacity: 0.14 },
    SAFE: { color: "#34d399", opacity: 0.08 },
  };

  const grid: Severity[][] = [
    ["CRIT", "HIGH", "MED",  "MED",  "LOW" ],
    ["HIGH", "CRIT", "HIGH", "LOW",  "SAFE"],
    ["MED",  "HIGH", "MED",  "SAFE", "SAFE"],
    ["LOW",  "MED",  "LOW",  "LOW",  "SAFE"],
  ];

  const colHeaders = ["A01", "A03", "A05", "A07", "A10"];
  const rowLabels  = ["WEB", "API", "NET", "CLD"];
  const legendItems: Severity[] = ["CRIT", "HIGH", "MED", "LOW", "SAFE"];
  const legendLabels = ["Critical", "High", "Medium", "Low", "Safe"];

  const cellW = 35;
  const cellH = 34;
  const gap   = 3;
  const gridX = 30;
  const gridY = 15;

  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" role="img" aria-label="Risk heatmap grid">
      {colHeaders.map((h, c) => {
        const cx = gridX + c * (cellW + gap) + cellW / 2;
        return (
          <text key={`ch-${c}`} x={cx} y={10} textAnchor="middle" fontSize="4.5" fill="#fafafa" opacity="0.15">{h}</text>
        );
      })}

      {rowLabels.map((l, r) => {
        const cy = gridY + r * (cellH + gap) + cellH / 2 + 1.5;
        return (
          <text key={`rl-${r}`} x={22} y={cy} textAnchor="end" fontSize="4" fill="#fafafa" opacity="0.12">{l}</text>
        );
      })}

      {grid.map((row, r) =>
        row.map((sev, c) => {
          const x    = gridX + c * (cellW + gap);
          const y    = gridY + r * (cellH + gap);
          const { color, opacity } = severityMap[sev];
          const colBegin = `${c * 0.12}s`;
          const isCrit   = sev === "CRIT";
          const isTopLeft = r === 0 && c === 0;

          return (
            <g key={`cell-${r}-${c}`}>
              <rect
                x={x} y={y + 6} width={cellW} height={cellH} rx={4}
                fill={color} opacity="0"
              >
                <animate
                  attributeName="opacity"
                  values={`0;${opacity}`}
                  dur="0.4s"
                  begin={colBegin}
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.22 1 0.36 1"
                  keyTimes="0;1"
                />
                <animate
                  attributeName="y"
                  values={`${y + 6};${y}`}
                  dur="0.4s"
                  begin={colBegin}
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.22 1 0.36 1"
                  keyTimes="0;1"
                />
                {isCrit && (
                  <animate
                    attributeName="opacity"
                    values={`${opacity - 0.08};${opacity + 0.08};${opacity - 0.08}`}
                    dur="2.5s"
                    begin={`${c * 0.12 + 0.4}s`}
                    repeatCount="indefinite"
                  />
                )}
              </rect>
              {isTopLeft && (
                <rect
                  x={x} y={y} width={cellW} height={cellH} rx={4}
                  fill="none" stroke="#fafafa" strokeWidth="0.75" opacity="0"
                >
                  <animate
                    attributeName="opacity"
                    values="0.08;0.18;0.08"
                    dur="3s"
                    begin="0.8s"
                    repeatCount="indefinite"
                  />
                </rect>
              )}
            </g>
          );
        })
      )}

      <g opacity="0">
        <animate attributeName="opacity" values="0;1" dur="0.3s" begin="0.8s" fill="freeze" />
        {legendItems.map((sev, i) => {
          const { color, opacity } = severityMap[sev];
          const lx = 240;
          const ly = 30 + i * 22;
          return (
            <g key={`leg-${i}`}>
              <rect x={lx} y={ly - 6} width={10} height={8} rx={2} fill={color} opacity={opacity} />
              <text x={lx + 13} y={ly} fontSize="5.5" fill="#fafafa" opacity="0.25">{legendLabels[i]}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function ReportArt() {
  const cx = 100;
  const cy = 90;
  const r = 52;
  const stroke = 14;
  const inner = r - stroke / 2;
  const circ = 2 * Math.PI * inner;

  const segments = [
    { color: "#dc2626", pct: 0.18, label: "Critical", count: "3",  offset: 0 },
    { color: "#f97316", pct: 0.28, label: "High",     count: "7",  offset: 0.18 },
    { color: "#eab308", pct: 0.32, label: "Medium",   count: "11", offset: 0.46 },
    { color: "#34d399", pct: 0.22, label: "Low",      count: "8",  offset: 0.78 },
  ];

  const gap = 0.012;

  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" role="img" aria-label="Security report summary">
      <defs>
        <radialGradient id="donutGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={r} fill="url(#donutGlow)" opacity={0.8} />
      <circle cx={cx} cy={cy} r={inner} fill="none" stroke="#fafafa" strokeWidth={stroke} opacity={0.04} />

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
            strokeDasharray={`0 ${circ}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="butt"
            opacity={0.55}
            style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
          >
            <animate
              attributeName="stroke-dasharray"
              from={`0 ${circ}`}
              to={`${arcLen} ${circ - arcLen}`}
              dur="1.4s"
              begin={`${i * 0.18}s`}
              fill="freeze"
              calcMode="spline"
              keySplines="0.22 1 0.36 1"
              keyTimes="0;1"
            />
          </circle>
        );
      })}

      <circle cx={cx} cy={cy} r={inner - stroke / 2 - 2} fill="none" stroke="#fafafa" strokeWidth={0.4} opacity={0.06} />

      <text x={cx} y={cy - 5} textAnchor="middle" fill="#fafafa" fontSize={18} fontFamily="system-ui" fontWeight="600" opacity={0.7}>24</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#fafafa" fontSize={6.5} fontFamily="system-ui" opacity={0.3}>findings</text>

      <g transform="translate(178, 30)">
        {segments.map((seg, i) => (
          <g key={`leg-${i}`} transform={`translate(0, ${i * 32})`}>
            <rect x={0} y={0} width={90} height={26} rx={4} fill="#fafafa" opacity={0}>
              <animate attributeName="opacity" values="0;0.04" dur="0.4s" begin={`${0.6 + i * 0.15}s`} fill="freeze" />
            </rect>
            <circle cx={10} cy={13} r={4} fill={seg.color} opacity={0}>
              <animate attributeName="opacity" values="0;0.6" dur="0.3s" begin={`${0.7 + i * 0.15}s`} fill="freeze" />
            </circle>
            <text x={20} y={11} fill="#fafafa" fontSize={7} fontFamily="system-ui" opacity={0}>
              {seg.label}
              <animate attributeName="opacity" values="0;0.35" dur="0.3s" begin={`${0.7 + i * 0.15}s`} fill="freeze" />
            </text>
            <text x={20} y={21} fill={seg.color} fontSize={9} fontFamily="system-ui" fontWeight="600" opacity={0}>
              {seg.count}
              <animate attributeName="opacity" values="0;0.7" dur="0.3s" begin={`${0.8 + i * 0.15}s`} fill="freeze" />
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function StepsArt() {
  const items = [
    { label: "Critical", sublabel: "Fix immediately", color: "#dc2626", num: "01" },
    { label: "High",     sublabel: "This week",        color: "#f97316", num: "02" },
    { label: "Medium",   sublabel: "Plan for sprint",  color: "#eab308", num: "03" },
    { label: "Low",      sublabel: "Backlog",          color: "#38bdf8", num: "04" },
  ];

  const cardX = 52;
  const cardW = 216;
  const cardH = 30;
  const cardGap = 10;
  const topY = 18;

  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" role="img" aria-label="Prioritized remediation queue">
      <defs>
        <linearGradient id="stepsCardGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fafafa" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#fafafa" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="stepsCardGradActive" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fafafa" stopOpacity="0.11" />
          <stop offset="100%" stopColor="#fafafa" stopOpacity="0.03" />
        </linearGradient>
      </defs>

      <line
        x1={cardX + 14} y1={topY + 15}
        x2={cardX + 14} y2={topY + items.length * (cardH + cardGap) - cardGap - 15}
        stroke="#fafafa" strokeWidth={0.5} opacity={0.08}
        strokeDasharray="2 4"
      />

      {items.map((item, i) => {
        const y = topY + i * (cardH + cardGap);
        const enterDelay = `${i * 0.15}s`;
        const isActive = i === 0;

        return (
          <g key={item.label}>
            <rect
              x={cardX + 28} y={y}
              width={cardW - 28} height={cardH}
              rx={5}
              fill={isActive ? "url(#stepsCardGradActive)" : "url(#stepsCardGrad)"}
              opacity={0}
            >
              <animate
                attributeName="opacity"
                values="0;1"
                dur="0.4s"
                begin={enterDelay}
                fill="freeze"
                calcMode="spline"
                keySplines="0.22 1 0.36 1"
                keyTimes="0;1"
              />
              <animate
                attributeName="x"
                values={`${cardX + 28 + 18};${cardX + 28}`}
                dur="0.5s"
                begin={enterDelay}
                fill="freeze"
                calcMode="spline"
                keySplines="0.22 1 0.36 1"
                keyTimes="0;1"
              />
            </rect>

            <rect
              x={cardX + 28} y={y}
              width={3} height={cardH}
              rx={1.5}
              fill={item.color}
              opacity={0}
            >
              <animate
                attributeName="opacity"
                values={`0;${isActive ? 0.7 : 0.4}`}
                dur="0.3s"
                begin={`${i * 0.15 + 0.1}s`}
                fill="freeze"
              />
              {isActive && (
                <animate
                  attributeName="opacity"
                  values="0.5;0.9;0.5"
                  dur="2.4s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
              )}
            </rect>

            <circle cx={cardX + 14} cy={y + cardH / 2} r={5} fill="#0a0a0a" stroke={item.color} strokeWidth={0.75} opacity={0}>
              <animate
                attributeName="opacity"
                values={`0;${isActive ? 0.9 : 0.5}`}
                dur="0.3s"
                begin={`${i * 0.15 + 0.05}s`}
                fill="freeze"
              />
            </circle>
            <text
              x={cardX + 14} y={y + cardH / 2 + 2.5}
              textAnchor="middle"
              fill={item.color}
              fontSize={4.5}
              fontFamily="system-ui"
              fontWeight="700"
              opacity={0}
            >
              {item.num}
              <animate
                attributeName="opacity"
                values={`0;${isActive ? 0.9 : 0.55}`}
                dur="0.3s"
                begin={`${i * 0.15 + 0.1}s`}
                fill="freeze"
              />
            </text>

            <text
              x={cardX + 38} y={y + 12}
              fill={item.color}
              fontSize={7.5}
              fontFamily="system-ui"
              fontWeight="600"
              opacity={0}
            >
              {item.label}
              <animate
                attributeName="opacity"
                values={`0;${isActive ? 0.85 : 0.55}`}
                dur="0.3s"
                begin={`${i * 0.15 + 0.15}s`}
                fill="freeze"
              />
            </text>

            <text
              x={cardX + 38} y={y + 22}
              fill="#fafafa"
              fontSize={6}
              fontFamily="system-ui"
              opacity={0}
            >
              {item.sublabel}
              <animate
                attributeName="opacity"
                values="0;0.28"
                dur="0.3s"
                begin={`${i * 0.15 + 0.2}s`}
                fill="freeze"
              />
            </text>

            {isActive && (
              <circle cx={cardX + cardW - 8} cy={y + cardH / 2} r={2.5} fill={item.color} opacity={0}>
                <animate attributeName="opacity" values="0;0.7" dur="0.3s" begin="0.4s" fill="freeze" />
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.8s" begin="0.8s" repeatCount="indefinite" />
                <animate attributeName="r" values="2;3;2" dur="1.8s" begin="0.8s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}

      <text x={cardX + 28 + (cardW - 28) / 2} y={topY + items.length * (cardH + cardGap) + 8}
        textAnchor="middle" fill="#fafafa" fontSize={5.5} fontFamily="system-ui" opacity={0}>
        remediation queue
        <animate attributeName="opacity" values="0;0.18" dur="0.4s" begin="0.8s" fill="freeze" />
      </text>
    </svg>
  );
}

function ShieldArt() {
  const cx = 160;
  const cy = 90;

  const layers = [
    { w: 200, h: 130, rx: 18, color: "#fafafa", delay: "0s",    dur: "0.5s" },
    { w: 152, h:  98, rx: 14, color: "#fafafa", delay: "0.18s", dur: "0.5s" },
    { w: 108, h:  70, rx: 10, color: "#34d399", delay: "0.36s", dur: "0.5s" },
    { w:  68, h:  46, rx:  7, color: "#34d399", delay: "0.54s", dur: "0.5s" },
  ];

  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" role="img" aria-label="Layered protection">
      <defs>
        <radialGradient id="shieldCoreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </radialGradient>
      </defs>

      {layers.map((l, i) => (
        <rect
          key={`layer-${i}`}
          x={cx - l.w / 2} y={cy - l.h / 2}
          width={l.w} height={l.h}
          rx={l.rx}
          fill="none"
          stroke={l.color}
          strokeWidth={0.75}
          opacity={0}
        >
          <animate
            attributeName="opacity"
            values={`0;${0.08 + i * 0.04}`}
            dur={l.dur}
            begin={l.delay}
            fill="freeze"
            calcMode="spline"
            keySplines="0.22 1 0.36 1"
            keyTimes="0;1"
          />
          <animate
            attributeName="opacity"
            values={`${0.08 + i * 0.04};${0.14 + i * 0.04};${0.08 + i * 0.04}`}
            dur={`${3.5 + i * 0.4}s`}
            begin={`${parseFloat(l.delay) + 0.6}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}

      <circle cx={cx} cy={cy} r={28} fill="url(#shieldCoreGlow)" opacity={0}>
        <animate attributeName="opacity" values="0;1" dur="0.4s" begin="0.7s" fill="freeze" />
        <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" begin="1.2s" repeatCount="indefinite" />
      </circle>

      <rect
        x={cx - 34} y={cy - 22}
        width={68} height={44}
        rx={8}
        fill="#fafafa"
        opacity={0}
      >
        <animate attributeName="opacity" values="0;0.05" dur="0.3s" begin="0.65s" fill="freeze" />
      </rect>

      <rect x={cx - 8} y={cy - 4} width={16} height={13} rx={3} fill="none" stroke="#34d399" strokeWidth={1} opacity={0}>
        <animate attributeName="opacity" values="0;0.7" dur="0.3s" begin="0.8s" fill="freeze" />
      </rect>
      <path
        d={`M ${cx - 5} ${cy - 4} Q ${cx - 5} ${cy - 11} ${cx} ${cy - 11} Q ${cx + 5} ${cy - 11} ${cx + 5} ${cy - 4}`}
        fill="none" stroke="#34d399" strokeWidth={1} strokeLinecap="round" opacity={0}
      >
        <animate attributeName="opacity" values="0;0.7" dur="0.3s" begin="0.85s" fill="freeze" />
      </path>
      <circle cx={cx} cy={cy + 2} r={1.5} fill="#34d399" opacity={0}>
        <animate attributeName="opacity" values="0;0.9" dur="0.2s" begin="0.95s" fill="freeze" />
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="1.2s" repeatCount="indefinite" />
      </circle>

      <text x={cx} y={cy + 16} textAnchor="middle" fill="#fafafa" fontSize={5.5} fontFamily="system-ui" opacity={0}>
        protected
        <animate attributeName="opacity" values="0;0.22" dur="0.3s" begin="1.1s" fill="freeze" />
      </text>
    </svg>
  );
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const cardConfigs = [
  { span: "lg:col-span-4", aspect: "16/10", numSize: "text-5xl" },
  { span: "lg:col-span-4", aspect: "16/10", numSize: "text-5xl" },
  { span: "lg:col-span-4", aspect: "16/10", numSize: "text-5xl" },
  { span: "lg:col-span-6", aspect: "16/9", numSize: "text-7xl" },
  { span: "lg:col-span-6", aspect: "16/9", numSize: "text-7xl" },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end start"],
  });

  const lineWidth = useTransform(scrollYProgress, [0, 0.15], ["0%", "100%"]);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="px-8 md:px-28 py-32 md:py-48"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
        className="mb-6 md:mb-8"
      >
        <span className="inline-flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.2em] text-[#dc2626]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#dc2626] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#dc2626]" />
          </span>
          Feature Set
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.06, ease: EASE }}
        className="mb-20 md:mb-28"
      >
        <h2 className="text-[clamp(2.8rem,8vw,7.5rem)] font-medium tracking-[-0.03em] leading-[0.92] max-w-[14ch]">
          What you get with{" "}
          <span className="font-serif italic font-normal">Blind Side</span>
        </h2>
        <div className="mt-6 h-px bg-white/[0.08] max-w-xl relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-[#dc2626]"
            style={{ width: lineWidth }}
          />
        </div>
        <p className="text-lg md:text-xl text-white/[0.45] max-w-xl mt-8 leading-relaxed">
          Simple security checks that give you clear visibility and actionable
          next steps.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 md:gap-6">
        {features.map((feature, i) => {
          const Art = feature.art;
          const config = cardConfigs[i];
          const isHero = i === 0;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40, x: i % 2 === 0 ? -8 : 8 }}
              animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 + i * 0.1,
                ease: EASE,
              }}
              whileHover={{ y: -4 }}
              className={`liquid-glass rounded-2xl overflow-hidden cursor-default transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)] ${config.span}`}
            >
              <div className="relative">
                <div className="absolute top-4 right-5 z-10">
                  <span className={`font-medium tracking-[-0.02em] text-white/[0.06] ${config.numSize}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div
                  className="w-full px-6 pt-6"
                  style={{ aspectRatio: config.aspect }}
                >
                  <Art />
                </div>
              </div>
              <div className="px-6 pb-6 pt-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/25">
                    {isHero ? "Primary" : "Feature"}
                  </span>
                </div>
                <h3 className={`font-semibold mb-2 ${isHero ? "text-xl md:text-2xl" : "text-base"}`}>
                  {feature.title}
                </h3>
                <p className="text-sm text-white/[0.45] leading-relaxed max-w-md">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
