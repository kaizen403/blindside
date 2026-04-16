import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";

loadFont({
  family: "Anthropic Sans",
  url: staticFile("AnthropicSans-Roman.woff2"),
  weight: "400",
});
const FONT = "Anthropic Sans, system-ui, sans-serif";

const BG = "#09090b";
const FG = "#fafafa";
const MUTED = "#a1a1aa";
const RED = "#dc2626";
const GREEN = "#34d399";
const CARD_BG = "rgba(255,255,255,0.04)";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const HIGH_COLOR = "#f97316";

const W = 1080;
const H = 720;
const CX = W / 2;
const CY = H / 2 - 20;
const RADIUS = 200;

const FADE_IN_END = 18;
const LINES_START = 60;
const LINE_STAGGER = 5;
const LINE_DRAW_DURATION = 24;
const NODE_APPEAR_OFFSET = 18;
const SCAN_START = 120;
const SCAN_DURATION = 90;
const HIT_BASE = 165;
const HIT_STAGGER = 9;
const REPORT_START = 210;
const FADE_OUT_START = 324;
const TOTAL = 360;

const ENDPOINTS = [
  { label: "API", angleDeg: 0, vulnerable: true, severity: "Critical" },
  { label: "Auth", angleDeg: 60, vulnerable: true, severity: "High" },
  { label: "Database", angleDeg: 120, vulnerable: false, severity: null },
  { label: "Payments", angleDeg: 180, vulnerable: true, severity: "Critical" },
  { label: "Storage", angleDeg: 240, vulnerable: false, severity: null },
  { label: "CDN", angleDeg: 300, vulnerable: false, severity: null },
];

const getPos = (angleDeg: number) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CX + RADIUS * Math.cos(rad),
    y: CY + RADIUS * Math.sin(rad),
  };
};

const buildCurve = (tx: number, ty: number) => {
  const dx = tx - CX;
  const dy = ty - CY;
  const len = Math.sqrt(dx * dx + dy * dy);
  const mx = (CX + tx) / 2;
  const my = (CY + ty) / 2;
  const px = dy / len;
  const py = -dx / len;
  const off = RADIUS * 0.55;
  const cx = mx + px * off;
  const cy = my + py * off;
  return `M ${CX} ${CY} Q ${cx} ${cy} ${tx} ${ty}`;
};

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  baseX: (i * 137.508 + 23) % W,
  baseY: (i * 89.443 + 47) % H,
  size: 1 + (i % 3) * 0.5,
  speed: 0.3 + (i % 5) * 0.15,
  phase: (i * 2.399) % (Math.PI * 2),
}));

export const SolutionVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const globalOpacity = interpolate(
    frame,
    [0, FADE_IN_END, FADE_OUT_START, TOTAL],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  let vulnCounter = 0;
  const nodes = ENDPOINTS.map((ep, i) => {
    const pos = getPos(ep.angleDeg);
    const pathD = buildCurve(pos.x, pos.y);

    const lineStart = LINES_START + i * LINE_STAGGER;
    const drawProgress = interpolate(
      frame,
      [lineStart, lineStart + LINE_DRAW_DURATION],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
    );

    const nodeAppear = lineStart + NODE_APPEAR_OFFSET;
    const nodeScale =
      frame >= nodeAppear
        ? spring({
            frame: frame - nodeAppear,
            fps,
            config: { damping: 15, stiffness: 100, mass: 0.6 },
          })
        : 0;

    const packetStart = lineStart + LINE_DRAW_DURATION;
    const packetDur = 18;
    const packetT = interpolate(
      frame,
      [packetStart, packetStart + packetDur],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
    );
    const showPacket = frame >= packetStart && frame < packetStart + packetDur;

    let hitFrame = Infinity;
    if (ep.vulnerable) {
      hitFrame = HIT_BASE + vulnCounter * HIT_STAGGER;
      vulnCounter++;
    }

    const isHit = ep.vulnerable && frame >= hitFrame;
    const hitAlpha = ep.vulnerable
      ? interpolate(frame, [hitFrame, hitFrame + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

    const pulseT = ep.vulnerable
      ? interpolate(frame, [hitFrame, hitFrame + 30], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

    return {
      ...ep,
      pos,
      pathD,
      lineStart,
      drawProgress,
      nodeScale,
      showPacket,
      packetT,
      isHit,
      hitAlpha,
      hitFrame,
      pulseT,
    };
  });

  const scanT = interpolate(
    frame,
    [SCAN_START, SCAN_START + SCAN_DURATION],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const scanAngle = scanT * Math.PI * 2;
  const beamLen = RADIUS + 40;
  const beamX = CX + beamLen * Math.sin(scanAngle);
  const beamY = CY - beamLen * Math.cos(scanAngle);

  const scanFadeIn = interpolate(
    frame,
    [SCAN_START, SCAN_START + 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const scanFadeOut = interpolate(
    frame,
    [SCAN_START + SCAN_DURATION - 8, SCAN_START + SCAN_DURATION + 10],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const scanOpacity = scanFadeIn * scanFadeOut;

  const reportAlpha = interpolate(
    frame,
    [REPORT_START, REPORT_START + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const critBar =
    frame >= REPORT_START
      ? spring({
          frame: frame - REPORT_START,
          fps,
          config: { damping: 12, stiffness: 60, mass: 0.8 },
        })
      : 0;
  const highBar =
    frame >= REPORT_START + 8
      ? spring({
          frame: frame - (REPORT_START + 8),
          fps,
          config: { damping: 12, stiffness: 60, mass: 0.8 },
        })
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div
        style={{
          opacity: globalOpacity,
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          style={{ position: "absolute", top: 0, left: 0 }}
          role="img"
          aria-label="Security scan visualization"
        >
          <defs>
            <filter id="scanGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="nodeGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="pulseGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={RED} stopOpacity="0.3" />
              <stop offset="100%" stopColor={RED} stopOpacity="0" />
            </radialGradient>
          </defs>

          {PARTICLES.map((p) => {
            const px =
              p.baseX + Math.sin(frame * 0.02 * p.speed + p.phase) * 15;
            const py =
              p.baseY + Math.cos(frame * 0.015 * p.speed + p.phase) * 10;
            const po = 0.03 + 0.02 * Math.sin(frame * 0.03 + p.phase);
            return (
              <circle
                key={`p-${p.baseX.toFixed(0)}-${p.baseY.toFixed(0)}`}
                cx={px}
                cy={py}
                r={p.size}
                fill={FG}
                opacity={po}
              />
            );
          })}

          {nodes.map((n) => {
            if (n.drawProgress <= 0) return null;
            const ev = evolvePath(n.drawProgress, n.pathD);
            const strokeColor = n.isHit
              ? `rgba(220,38,38,${(0.15 + 0.25 * n.hitAlpha).toFixed(3)})`
              : "rgba(255,255,255,0.12)";
            return (
              <path
                key={`curve-${n.label}`}
                d={n.pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth={1.5}
                strokeDasharray={ev.strokeDasharray}
                strokeDashoffset={ev.strokeDashoffset}
              />
            );
          })}

          {nodes.map((n) => {
            if (!n.isHit || n.hitAlpha <= 0) return null;
            return (
              <circle
                key={`glow-${n.label}`}
                cx={n.pos.x}
                cy={n.pos.y}
                r={38}
                fill="url(#pulseGrad)"
                opacity={(n.hitAlpha * 0.5).toFixed(3)}
              />
            );
          })}

          {nodes.map((n) => {
            if (!n.vulnerable || n.pulseT <= 0 || n.pulseT >= 1) return null;
            return (
              <circle
                key={`ring-${n.label}`}
                cx={n.pos.x}
                cy={n.pos.y}
                r={20 + n.pulseT * 35}
                fill="none"
                stroke={RED}
                strokeWidth={1}
                opacity={((1 - n.pulseT) * 0.4).toFixed(3)}
              />
            );
          })}

          {nodes.map((n) => {
            if (!n.showPacket || n.packetT <= 0) return null;
            const len = getLength(n.pathD);
            const pt = getPointAtLength(n.pathD, len * n.packetT);
            return (
              <circle
                key={`pkt-${n.label}`}
                cx={pt.x}
                cy={pt.y}
                r={3}
                fill={GREEN}
                opacity={0.7}
                filter="url(#nodeGlow)"
              />
            );
          })}

          <circle cx={CX} cy={CY} r={6} fill="rgba(255,255,255,0.1)" />
          <circle cx={CX} cy={CY} r={2.5} fill="rgba(255,255,255,0.35)" />

          {frame >= SCAN_START &&
            frame < SCAN_START + SCAN_DURATION + 10 && (
              <>
                {[3, 2, 1].map((gi) => {
                  const ga = scanAngle - gi * 0.12;
                  const gx = CX + beamLen * Math.sin(ga);
                  const gy = CY - beamLen * Math.cos(ga);
                  return (
                    <line
                      key={`trail-${gi}`}
                      x1={CX}
                      y1={CY}
                      x2={gx}
                      y2={gy}
                      stroke={GREEN}
                      strokeWidth={1}
                      opacity={(
                        scanOpacity *
                        0.08 *
                        ((4 - gi) / 3)
                      ).toFixed(3)}
                    />
                  );
                })}
                <line
                  x1={CX}
                  y1={CY}
                  x2={beamX}
                  y2={beamY}
                  stroke={GREEN}
                  strokeWidth={1.5}
                  opacity={(scanOpacity * 0.5).toFixed(3)}
                  filter="url(#scanGlow)"
                />
                <circle
                  cx={beamX}
                  cy={beamY}
                  r={4}
                  fill={GREEN}
                  opacity={(scanOpacity * 0.6).toFixed(3)}
                  filter="url(#scanGlow)"
                />
                <circle
                  cx={CX}
                  cy={CY}
                  r={5}
                  fill={GREEN}
                  opacity={(scanOpacity * 0.25).toFixed(3)}
                  filter="url(#scanGlow)"
                />
              </>
            )}
        </svg>

        {nodes.map((n) => {
          if (n.nodeScale <= 0) return null;
          return (
            <div
              key={`lbl-${n.label}`}
              style={{
                position: "absolute",
                left: n.pos.x - 40,
                top: n.pos.y - 14,
                width: 80,
                height: 28,
                borderRadius: 6,
                border: `1px solid ${
                  n.isHit
                    ? `rgba(220,38,38,${(0.4 * n.hitAlpha).toFixed(3)})`
                    : CARD_BORDER
                }`,
                backgroundColor: n.isHit
                  ? `rgba(220,38,38,${(0.06 * n.hitAlpha).toFixed(3)})`
                  : CARD_BG,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: Math.min(n.nodeScale, 1),
                transform: `scale(${0.8 + 0.2 * Math.min(n.nodeScale, 1)})`,
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 400,
                  color: n.isHit
                    ? `rgba(220,38,38,${(0.5 + 0.5 * n.hitAlpha).toFixed(3)})`
                    : MUTED,
                  letterSpacing: "0.02em",
                }}
              >
                {n.label}
              </span>
            </div>
          );
        })}

        {nodes.map((n) => {
          if (!n.isHit || n.hitAlpha <= 0 || !n.severity) return null;
          const col = n.severity === "Critical" ? RED : HIGH_COLOR;
          return (
            <div
              key={`sev-${n.label}`}
              style={{
                position: "absolute",
                left: n.pos.x - 30,
                top: n.pos.y + 18,
                width: 60,
                textAlign: "center",
                opacity: n.hitAlpha,
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 9,
                  fontWeight: 400,
                  color: col,
                  backgroundColor: `${col}15`,
                  padding: "2px 6px",
                  borderRadius: 3,
                  letterSpacing: "0.05em",
                }}
              >
                {n.severity}
              </span>
            </div>
          );
        })}

        {reportAlpha > 0 && (
          <div
            style={{
              position: "absolute",
              right: 40,
              bottom: 40,
              width: 220,
              padding: "16px 20px",
              borderRadius: 10,
              border: `1px solid ${CARD_BORDER}`,
              backgroundColor: CARD_BG,
              opacity: reportAlpha,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 10,
                color: MUTED,
                letterSpacing: "0.1em",
                marginBottom: 14,
              }}
            >
              SCAN RESULTS
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 10,
                  color: RED,
                  width: 55,
                  letterSpacing: "0.02em",
                }}
              >
                Critical
              </span>
              <div
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.04)",
                  marginRight: 8,
                }}
              >
                <div
                  style={{
                    width: `${critBar * 100}%`,
                    height: "100%",
                    borderRadius: 2,
                    backgroundColor: RED,
                    opacity: 0.7,
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  color: RED,
                  opacity: critBar,
                }}
              >
                2
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 10,
                  color: HIGH_COLOR,
                  width: 55,
                  letterSpacing: "0.02em",
                }}
              >
                High
              </span>
              <div
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.04)",
                  marginRight: 8,
                }}
              >
                <div
                  style={{
                    width: `${highBar * 50}%`,
                    height: "100%",
                    borderRadius: 2,
                    backgroundColor: HIGH_COLOR,
                    opacity: 0.7,
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  color: HIGH_COLOR,
                  opacity: highBar,
                }}
              >
                1
              </span>
            </div>
            <div
              style={{
                borderTop: `1px solid ${CARD_BORDER}`,
                paddingTop: 10,
                marginTop: 4,
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 10,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.01em",
                }}
              >
                3 vulnerabilities found
              </span>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
