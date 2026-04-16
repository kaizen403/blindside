import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily: sansFont } = loadInter("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

const { fontFamily: monoFont } = loadMono("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const BG = "#09090b";
const RED = "#dc2626";

const CENTER = { x: 960, y: 540 };
const HEX_RADIUS = 220;
const AI_POS = { x: 1660, y: 140 };

const SATELLITES = [
  { label: "/api/auth", vulnLabel: "BYPASS", angleDeg: -90 },
  { label: "database", vulnLabel: "SQLi", angleDeg: -30 },
  { label: "/admin", vulnLabel: "NO ACL", angleDeg: 30 },
  { label: "/api/users", vulnLabel: "IDOR", angleDeg: 90 },
  { label: ".env", vulnLabel: "LEAKED", angleDeg: 150 },
  { label: "api-keys", vulnLabel: "PLAINTEXT", angleDeg: 210 },
] as const;

const FADE_IN_END = 8;
const IDLE_END = 30;
const SCANNER_START = 30;
const SCANNER_READY = 42;
const BEAMS_START = 45;
const BEAMS_DRAWN = 75;
const CASCADE_START = 90;
const CASCADE_INTERVAL = 12;
const CENTER_BREACH = 165;
const HOLD_START = 195;
const FADE_OUT_START = 225;
const TOTAL = 240;

const getHexPos = (angleDeg: number) => {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER.x + HEX_RADIUS * Math.cos(rad),
    y: CENTER.y + HEX_RADIUS * Math.sin(rad),
  };
};

const lerp = (
  a: { x: number; y: number },
  b: { x: number; y: number },
  t: number,
) => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

export const SimultaneousBreach: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const globalOpacity = interpolate(
    frame,
    [0, FADE_IN_END, FADE_OUT_START, TOTAL],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const dashOffset = frame * 1.5;

  const scannerOpacity = interpolate(
    frame,
    [SCANNER_START, SCANNER_START + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const scannerPulse =
    frame >= SCANNER_START && frame < SCANNER_READY
      ? 0.5 + 0.5 * Math.sin((frame - SCANNER_START) * 0.8)
      : frame >= SCANNER_READY
        ? 0.85
        : 0;

  const holdPulse =
    frame >= HOLD_START
      ? 0.85 + 0.15 * Math.sin((frame - HOLD_START) * 0.15)
      : 1;

  const satellites = SATELLITES.map((sat, i) => {
    const pos = getHexPos(sat.angleDeg);
    const compromiseFrame = CASCADE_START + i * CASCADE_INTERVAL;

    const beamProgress = interpolate(
      frame,
      [BEAMS_START, BEAMS_DRAWN],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      },
    );

    const particleTravelFrames = compromiseFrame - BEAMS_START;
    const particleRaw =
      frame >= BEAMS_START
        ? spring({
            frame: frame - BEAMS_START,
            fps,
            durationInFrames: particleTravelFrames,
            config: { damping: 12, stiffness: 80, mass: 0.8 },
          })
        : 0;
    const showParticle =
      frame >= BEAMS_START && frame < compromiseFrame + 3 && particleRaw > 0;
    const particlePos = lerp(AI_POS, pos, Math.min(particleRaw, 1.08));

    const isCompromised = frame >= compromiseFrame;
    const compromiseAlpha = interpolate(
      frame,
      [compromiseFrame, compromiseFrame + 12],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

    const pulseT = interpolate(
      frame,
      [compromiseFrame, compromiseFrame + 28],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

    return {
      ...sat,
      pos,
      beamProgress,
      showParticle,
      particlePos,
      isCompromised,
      compromiseAlpha,
      pulseT,
      compromiseFrame,
    };
  });

  const breachAlpha = interpolate(
    frame,
    [CENTER_BREACH, CENTER_BREACH + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const breachPulseT = interpolate(
    frame,
    [CENTER_BREACH, CENTER_BREACH + 35],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const counterOpacity = interpolate(
    frame,
    [CENTER_BREACH + 12, CENTER_BREACH + 22],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

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
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", top: 0, left: 0 }}
          role="img"
          aria-label="Network breach visualization"
        >
          {satellites.map((sat) => (
            <line
              key={`conn-${sat.label}`}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={sat.pos.x}
              y2={sat.pos.y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
              strokeDasharray="6 8"
              strokeDashoffset={-dashOffset}
            />
          ))}

          {frame >= BEAMS_START &&
            satellites.map((sat) => {
              const endPt = lerp(AI_POS, sat.pos, sat.beamProgress);
              return (
                <line
                  key={`beam-${sat.label}`}
                  x1={AI_POS.x}
                  y1={AI_POS.y}
                  x2={endPt.x}
                  y2={endPt.y}
                  stroke={`rgba(220,38,38,${(0.3 * holdPulse).toFixed(3)})`}
                  strokeWidth={1.5}
                />
              );
            })}

          {satellites.map((sat) =>
            sat.showParticle ? (
              <circle
                key={`part-${sat.label}`}
                cx={sat.particlePos.x}
                cy={sat.particlePos.y}
                r={3.5}
                fill={RED}
                opacity={0.8}
              />
            ) : null,
          )}

          {satellites.map((sat) => {
            if (sat.pulseT <= 0 || sat.pulseT >= 1) return null;
            return (
              <circle
                key={`pulse-${sat.label}`}
                cx={sat.pos.x}
                cy={sat.pos.y}
                r={18 + sat.pulseT * 30}
                fill="none"
                stroke={RED}
                strokeWidth={1}
                opacity={((1 - sat.pulseT) * 0.4).toFixed(3)}
              />
            );
          })}

          {breachPulseT > 0 && breachPulseT < 1 && (
            <circle
              cx={CENTER.x}
              cy={CENTER.y}
              r={28 + breachPulseT * 55}
              fill="none"
              stroke={RED}
              strokeWidth={1.5}
              opacity={((1 - breachPulseT) * 0.6).toFixed(3)}
            />
          )}
        </svg>

        <div
          style={{
            position: "absolute",
            left: CENTER.x - 62,
            top: CENTER.y - 19,
            width: 124,
            height: 38,
            borderRadius: 8,
            border: `1px solid ${
              breachAlpha > 0
                ? `rgba(220,38,38,${(0.3 * breachAlpha).toFixed(3)})`
                : "rgba(255,255,255,0.08)"
            }`,
            backgroundColor:
              breachAlpha > 0
                ? `rgba(220,38,38,${(0.05 * breachAlpha).toFixed(3)})`
                : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: sansFont,
              fontSize: 13,
              fontWeight: 400,
              color:
                breachAlpha > 0
                  ? `rgba(220,38,38,${(0.4 + 0.3 * breachAlpha).toFixed(3)})`
                  : "rgba(255,255,255,0.4)",
              letterSpacing: "0.02em",
            }}
          >
            yourapp.com
          </span>
        </div>

        {breachAlpha > 0 && (
          <div
            style={{
              position: "absolute",
              left: CENTER.x - 62,
              top: CENTER.y + 27,
              width: 124,
              textAlign: "center",
              opacity: breachAlpha * 0.4,
            }}
          >
            <span
              style={{
                fontFamily: monoFont,
                fontSize: 11,
                color: RED,
                letterSpacing: "0.15em",
              }}
            >
              COMPROMISED
            </span>
          </div>
        )}

        {satellites.map((sat) => (
          <div
            key={`node-${sat.label}`}
            style={{
              position: "absolute",
              left: sat.pos.x - 46,
              top: sat.pos.y - 15,
              width: 92,
              height: 30,
              borderRadius: 6,
              border: `1px solid ${
                sat.isCompromised
                  ? `rgba(220,38,38,${(0.3 * sat.compromiseAlpha).toFixed(3)})`
                  : "rgba(255,255,255,0.08)"
              }`,
              backgroundColor: sat.isCompromised
                ? `rgba(220,38,38,${(0.04 * sat.compromiseAlpha).toFixed(3)})`
                : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: sansFont,
                fontSize: 12,
                fontWeight: 400,
                color: sat.isCompromised
                  ? `rgba(255,255,255,${(0.3 + 0.35 * sat.compromiseAlpha).toFixed(3)})`
                  : "rgba(255,255,255,0.4)",
                letterSpacing: "0.01em",
              }}
            >
              {sat.label}
            </span>
          </div>
        ))}

        {satellites.map((sat) => {
          if (!sat.isCompromised || sat.compromiseAlpha <= 0) return null;

          return (
            <div
              key={`vuln-${sat.label}`}
              style={{
                position: "absolute",
                left: sat.pos.x - 46,
                top: sat.pos.y + 20,
                width: 92,
                textAlign: "center",
                opacity: sat.compromiseAlpha,
              }}
            >
              <span
                style={{
                  fontFamily: monoFont,
                  fontSize: 9,
                  color: `rgba(220,38,38,${(0.5 * sat.compromiseAlpha).toFixed(3)})`,
                  letterSpacing: "0.06em",
                }}
              >
                {sat.vulnLabel}
              </span>
            </div>
          );
        })}

        {frame >= SCANNER_START && (
          <>
            <div
              style={{
                position: "absolute",
                left: AI_POS.x - 5,
                top: AI_POS.y - 5,
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: RED,
                opacity: scannerOpacity * scannerPulse,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: AI_POS.x + 12,
                top: AI_POS.y - 7,
                opacity: scannerOpacity,
              }}
            >
              <span
                style={{
                  fontFamily: monoFont,
                  fontSize: 10,
                  color: "rgba(220,38,38,0.5)",
                }}
              >
                AI
              </span>
            </div>
          </>
        )}

        {counterOpacity > 0 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 120,
              transform: "translateX(-50%)",
              opacity: counterOpacity * 0.15,
            }}
          >
            <span
              style={{
                fontFamily: sansFont,
                fontSize: 13,
                fontWeight: 400,
                color: "white",
                letterSpacing: "0.03em",
              }}
            >
              2,847 attack paths · 0.3s
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
