"use client";

import { motion, useInView } from "framer-motion";
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
  const W = 320;
  const H = 180;

  const nodes = [
    { x: 40, y: 35 }, { x: 95, y: 22 }, { x: 150, y: 40 }, { x: 205, y: 28 },
    { x: 265, y: 42 }, { x: 55, y: 75 }, { x: 120, y: 85 }, { x: 175, y: 70 },
    { x: 230, y: 80 }, { x: 290, y: 68 }, { x: 35, y: 120 }, { x: 100, y: 130 },
    { x: 160, y: 115 }, { x: 220, y: 135 }, { x: 280, y: 118 }, { x: 70, y: 160 },
    { x: 140, y: 155 }, { x: 210, y: 162 }, { x: 270, y: 150 },
  ];

  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 6], [2, 7], [3, 8],
    [4, 9], [5, 6], [6, 7], [7, 8], [8, 9], [5, 10], [6, 11], [7, 12],
    [8, 13], [9, 14], [10, 11], [11, 12], [12, 13], [13, 14], [10, 15],
    [11, 16], [12, 17], [14, 18], [15, 16], [16, 17], [17, 18],
  ];

  const vulnIndices = [2, 8, 13];
  const vulnSet = new Set(vulnIndices);
  const scanDur = "5s";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" role="img" aria-label="Vulnerability scan">
      <defs>
        <filter id="scanBlur">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="vulnGlow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="scanGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0" />
          <stop offset="40%" stopColor="#34d399" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#34d399" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </linearGradient>
      </defs>

      <line x1={0} y1={60} x2={W} y2={60} stroke="#fafafa" strokeWidth={0.3} opacity={0.03} />
      <line x1={0} y1={120} x2={W} y2={120} stroke="#fafafa" strokeWidth={0.3} opacity={0.03} />

      {edges.map(([a, b]) => (
        <line
          key={`e-${a}-${b}`}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke="#fafafa" strokeWidth={0.5} opacity={0.06}
        />
      ))}

      {nodes.map((n, i) => {
        const isVuln = vulnSet.has(i);
        return (
          <g key={`n-${n.x}-${n.y}`}>
            <circle cx={n.x} cy={n.y} r={2} fill="#fafafa" opacity={0.1} />
            {isVuln && (
              <>
                <circle cx={n.x} cy={n.y} r={2} fill="#dc2626" opacity={0}>
                  <animate
                    attributeName="opacity" values="0;0;0.8;0.8;0.6;0"
                    keyTimes="0;0.15;0.2;0.6;0.85;1"
                    dur={scanDur} repeatCount="indefinite"
                    begin={`${vulnIndices.indexOf(i) * 0.4}s`}
                  />
                  <animate
                    attributeName="r" values="2;2;3.5;3.5;3;2"
                    keyTimes="0;0.15;0.2;0.6;0.85;1"
                    dur={scanDur} repeatCount="indefinite"
                    begin={`${vulnIndices.indexOf(i) * 0.4}s`}
                  />
                </circle>
                <circle cx={n.x} cy={n.y} r={3} fill="none" stroke="#dc2626" strokeWidth={0.5} opacity={0}>
                  <animate attributeName="r" values="3;16" dur="1.8s" repeatCount="indefinite" begin={`${1 + vulnIndices.indexOf(i) * 0.4}s`} />
                  <animate attributeName="opacity" values="0.4;0" dur="1.8s" repeatCount="indefinite" begin={`${1 + vulnIndices.indexOf(i) * 0.4}s`} />
                </circle>
                {[35, 155, 260].map((angle) => {
                  const rad = (angle * Math.PI) / 180;
                  const len = 10;
                  return (
                    <line
                      key={`cr-${n.x}-${angle}`}
                      x1={n.x} y1={n.y}
                      x2={n.x + Math.cos(rad) * len}
                      y2={n.y + Math.sin(rad) * len}
                      stroke="#dc2626" strokeWidth={0.4} opacity={0}
                    >
                      <animate
                        attributeName="opacity" values="0;0;0.35;0.35;0;0"
                        keyTimes="0;0.18;0.22;0.6;0.85;1"
                        dur={scanDur} repeatCount="indefinite"
                        begin={`${vulnIndices.indexOf(i) * 0.4}s`}
                      />
                    </line>
                  );
                })}
              </>
            )}
          </g>
        );
      })}

      <rect x={-30} y={0} width={40} height={H} fill="url(#scanGrad)" filter="url(#scanBlur)" opacity={0.8}>
        <animate attributeName="x" values={`-40;${W + 10}`} dur={scanDur} repeatCount="indefinite" calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1" />
      </rect>
      <line x1={0} y1={0} x2={0} y2={H} stroke="#34d399" strokeWidth={0.5} opacity={0.3}>
        <animate attributeName="x1" values={`-10;${W + 10}`} dur={scanDur} repeatCount="indefinite" calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1" />
        <animate attributeName="x2" values={`-10;${W + 10}`} dur={scanDur} repeatCount="indefinite" calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1" />
      </line>
    </svg>
  );
}

function VisibilityArt() {
  const cx = 160;
  const cy = 90;
  const rings = [30, 55, 80];
  const nodes = [
    { a: 30, r: 30, color: "#34d399" },
    { a: 160, r: 30, color: "#dc2626" },
    { a: 270, r: 55, color: "#f97316" },
    { a: 45, r: 55, color: "#34d399" },
    { a: 190, r: 55, color: "#dc2626" },
    { a: 100, r: 80, color: "#f97316" },
    { a: 230, r: 80, color: "#34d399" },
    { a: 320, r: 80, color: "#dc2626" },
  ];

  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" role="img" aria-label="Risk visibility radar">
      <circle cx={cx} cy={cy} r={12} fill="#34d399" opacity={0}>
        <animate attributeName="opacity" values="0.05;0.15;0.05" dur="3s" repeatCount="indefinite" />
        <animate attributeName="r" values="12;22;12" dur="3s" repeatCount="indefinite" />
      </circle>
      {rings.map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#fafafa" strokeWidth={0.5} strokeDasharray="3 5" opacity={0.12} />
      ))}
      <circle cx={cx} cy={cy} r={2} fill="#fafafa" opacity={0.3} />
      {nodes.map((n, i) => {
        const rad = (n.a * Math.PI) / 180;
        const nx = cx + n.r * Math.cos(rad);
        const ny = cy + n.r * Math.sin(rad);
        return (
          <g key={`${n.a}-${n.r}`}>
            <circle cx={nx} cy={ny} r={3.5} fill={n.color} opacity={0.5}>
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={nx} cy={ny} r={7} fill="none" stroke={n.color} strokeWidth={0.4} opacity={0.2} />
          </g>
        );
      })}
    </svg>
  );
}

function ReportArt() {
  const bars = [
    { w: 180, label: "Critical" },
    { w: 130, label: "High" },
    { w: 220, label: "Medium" },
    { w: 80, label: "Low" },
  ];
  const left = 70;
  const top = 30;
  const gap = 35;
  const barH = 8;

  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" role="img" aria-label="Report chart">
      {bars.map((bar, i) => {
        const y = top + i * gap;
        return (
          <g key={bar.label}>
            <text x={left - 8} y={y + barH / 2 + 3} textAnchor="end" fill="#a1a1aa" fontSize={8} fontFamily="system-ui" opacity={0.4}>
              {bar.label}
            </text>
            <rect x={left} y={y} width={bar.w} height={barH} rx={4} fill="#fafafa" opacity={0.06} />
            <rect x={left} y={y} width={0} height={barH} rx={4} fill={i === 0 ? "#dc2626" : "#fafafa"} opacity={i === 0 ? 0.5 : 0.2}>
              <animate attributeName="width" from="0" to={bar.w} dur="1.2s" begin={`${i * 0.15}s`} fill="freeze" calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1" />
            </rect>
          </g>
        );
      })}
      <path d="M 268 115 L 278 125 L 298 100" fill="none" stroke="#34d399" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0} strokeDasharray="40" strokeDashoffset="40">
        <animate attributeName="opacity" from="0" to="0.7" dur="0.3s" begin="1.2s" fill="freeze" />
        <animate attributeName="stroke-dashoffset" from="40" to="0" dur="0.5s" begin="1.2s" fill="freeze" />
      </path>
    </svg>
  );
}

function StepsArt() {
  const cx = 160;
  const nodes = [
    { y: 25 },
    { y: 60 },
    { y: 95 },
    { y: 130 },
  ];
  const nodeR = 10;

  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" role="img" aria-label="Actionable steps">
      {nodes.slice(0, -1).map((n, i) => {
        const next = nodes[i + 1];
        return (
          <line key={`l-${n.y}`} x1={cx} y1={n.y + nodeR + 2} x2={cx} y2={next.y - nodeR - 2} stroke="#fafafa" strokeWidth={1} strokeDasharray="3 5" opacity={0.1} />
        );
      })}

      {nodes.slice(0, -1).map((n, i) => {
        const next = nodes[i + 1];
        const sy = n.y + nodeR + 2;
        const ey = next.y - nodeR - 2;
        return (
          <circle key={`p-${n.y}`} cx={cx} cy={sy} r={3} fill="#34d399" opacity={0.8}>
            <animate attributeName="cy" values={`${sy};${ey}`} dur="1s" begin={`${i * 1.2}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" begin={`${i * 1.2}s`} repeatCount="indefinite" />
          </circle>
        );
      })}

      {nodes.map((n, i) => (
        <g key={`n-${n.y}`}>
          <circle cx={cx} cy={n.y} r={nodeR} fill="none" stroke="#fafafa" strokeWidth={1} opacity={0.12}>
            <animate attributeName="stroke" values="#fafafa;#34d399;#34d399" dur="0.4s" begin={`${i * 1.2}s`} fill="freeze" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.12;0.5;0.5" dur="0.4s" begin={`${i * 1.2}s`} fill="freeze" repeatCount="indefinite" />
          </circle>
          <text x={cx} y={n.y + 3.5} textAnchor="middle" fill="#fafafa" fontSize={8} fontFamily="system-ui" opacity={0.25}>
            {i + 1}
          </text>
        </g>
      ))}

      <path d="M 195 120 L 209 128 V 142 Q 209 150 195 155 Q 181 150 181 142 V 128 Z" fill="none" stroke="#34d399" strokeWidth={1} opacity={0} strokeDasharray="80" strokeDashoffset="80">
        <animate attributeName="opacity" from="0" to="0.5" dur="0.3s" begin="3.6s" fill="freeze" repeatCount="indefinite" />
        <animate attributeName="stroke-dashoffset" from="80" to="0" dur="0.8s" begin="3.6s" fill="freeze" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

function ShieldArt() {
  const cx = 160;
  const cy = 80;

  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" role="img" aria-label="Shield protection">
      <defs>
        <radialGradient id="shieldGlow" cx="50%" cy="45%" r="40%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy + 10} r={50} fill="url(#shieldGlow)" opacity={0}>
        <animate attributeName="opacity" values="0;1;0.6;1" dur="4s" begin="2s" repeatCount="indefinite" />
      </circle>

      <path
        d={`M ${cx} ${cy - 50} L ${cx + 45} ${cy - 25} L ${cx + 45} ${cy + 15} Q ${cx + 45} ${cy + 50} ${cx} ${cy + 65} Q ${cx - 45} ${cy + 50} ${cx - 45} ${cy + 15} L ${cx - 45} ${cy - 25} Z`}
        fill="none"
        stroke="#34d399"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
        strokeDasharray="400"
        strokeDashoffset="400"
      >
        <animate attributeName="stroke-dashoffset" from="400" to="0" dur="2s" fill="freeze" calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1" />
      </path>

      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = 58;
        const px = cx + r * Math.cos(angle);
        const py = cy + 10 + r * 0.75 * Math.sin(angle);
        return (
          <circle key={`dot-${i}`} cx={px} cy={py} r={1.5} fill="#34d399" opacity={0}>
            <animate attributeName="opacity" values="0;0.4;0.15;0.4" dur="3s" begin={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </svg>
  );
}

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="px-8 md:px-28 py-24 md:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14"
      >
        <h2 className="text-4xl md:text-5xl font-medium tracking-[-1.5px] mb-4">
          What you get with{" "}
          <span className="font-serif italic font-normal">Blind Side</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl">
          Simple security checks that give you clear visibility and actionable
          next steps.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, i) => {
          const Art = feature.art;
          return (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="liquid-glass rounded-2xl overflow-hidden cursor-default transition-shadow hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
            >
              <div className="w-full px-6 pt-6" style={{ aspectRatio: "16/10" }}>
                <Art />
              </div>
              <div className="px-6 pb-6 pt-3">
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
