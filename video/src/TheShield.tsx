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
const GREEN = "#27c93f";
const RED = "#dc2626";
const YELLOW = "#ffbd2e";

const CX = 960;
const CY = 540;
const PERIMETER_RADIUS = 160;
const THREAT_START_RADIUS = 280;
const DOT_COUNT = 36;
const DOT_STEP_DEG = 360 / DOT_COUNT;

const FADE_IN_END = 8;
const SCAN_START = 0;
const SCAN_END = 45;
const T1_APPEAR = 45;
const T1_HIT = 75;
const T2_APPEAR = 60;
const T2_HIT = 90;
const T3_APPEAR = 75;
const T3_HIT = 105;
const REPORT_START = 105;
const BAR1_START = 108;
const BAR2_START = 114;
const BAR3_START = 120;
const BAR_DURATION = 9;
const STATUS_START = 150;
const STATUS_FADE_END = 158;
const FADE_OUT_START = 165;
const TOTAL = 180;

interface ThreatDef {
  label: string;
  angleDeg: number;
  appearFrame: number;
  hitFrame: number;
}

const THREAT_DEFS: ThreatDef[] = [
  { label: "SQLi", angleDeg: 225, appearFrame: T1_APPEAR, hitFrame: T1_HIT },
  { label: "IDOR", angleDeg: 350, appearFrame: T2_APPEAR, hitFrame: T2_HIT },
  { label: "XSS", angleDeg: 135, appearFrame: T3_APPEAR, hitFrame: T3_HIT },
];

const toRad = (deg: number) => (deg * Math.PI) / 180;

const polarToXY = (angleDeg: number, radius: number) => ({
  x: CX + radius * Math.cos(toRad(angleDeg)),
  y: CY + radius * Math.sin(toRad(angleDeg)),
});

const nearestDotIndex = (angleDeg: number) =>
  Math.round((((angleDeg % 360) + 360) % 360) / DOT_STEP_DEG) % DOT_COUNT;

export const TheShield: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const globalOpacity = interpolate(
    frame,
    [0, FADE_IN_END, FADE_OUT_START, TOTAL],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const scanAngleRad = interpolate(
    frame,
    [SCAN_START, SCAN_END],
    [0, Math.PI * 2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const scanAngleDeg = (scanAngleRad * 180) / Math.PI;
  const scannerPos = polarToXY(scanAngleDeg, PERIMETER_RADIUS);
  const showScanner = frame >= SCAN_START && frame < SCAN_END;

  const threats = THREAT_DEFS.map((def) => {
    const isActive = frame >= def.appearFrame;
    const isHit = frame >= def.hitFrame;

    const currentRadius = isActive
      ? interpolate(
          frame,
          [def.appearFrame, def.hitFrame],
          [THREAT_START_RADIUS, PERIMETER_RADIUS],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : THREAT_START_RADIUS;

    const pos = polarToXY(def.angleDeg, currentRadius);

    const dotOpacity = isHit
      ? interpolate(
          frame,
          [def.hitFrame, def.hitFrame + 10],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : isActive
        ? interpolate(
            frame,
            [def.appearFrame, def.appearFrame + 6],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        : 0;

    const pulseT = isHit
      ? interpolate(
          frame,
          [def.hitFrame, def.hitFrame + 25],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 0;

    const dotSpring = isHit
      ? spring({
          frame: frame - def.hitFrame,
          fps,
          config: { damping: 8, stiffness: 120, mass: 0.5 },
        })
      : 0;
    // spring: 0 → 1. 1 - spring: 1 → 0. Flash starts bright, decays to 0.
    const nearestDotPulseAmp = Math.max(0, 1 - dotSpring);

    const impactPos = polarToXY(def.angleDeg, PERIMETER_RADIUS);

    return {
      ...def,
      isActive,
      isHit,
      pos,
      dotOpacity,
      pulseT,
      nearestDotPulseAmp,
      impactPos,
      closestDotIdx: nearestDotIndex(def.angleDeg),
    };
  });

  const perimeterDots = Array.from({ length: DOT_COUNT }, (_, i) => {
    const dotDeg = i * DOT_STEP_DEG;
    const pos = polarToXY(dotDeg, PERIMETER_RADIUS);

    // Scanner trailing illumination: dot glows green as scanner passes
    // behindAngle: how far the dot is "behind" the current scanner position
    const behindAngle =
      frame < SCAN_END
        ? ((scanAngleDeg - dotDeg + 360) % 360)
        : 360; // no illumination after scan ends
    // 0 = scanner just at this dot, 20 = scanner is 20° ahead (trailing window)
    const scanIllum = behindAngle <= 20 ? 1 - behindAngle / 20 : 0;

    let threatPulseAmp = 0;
    for (const t of threats) {
      if (t.closestDotIdx === i) {
        threatPulseAmp = Math.max(threatPulseAmp, t.nearestDotPulseAmp);
      }
    }

    let fillColor: string;
    let fillOpacity: number;
    if (threatPulseAmp > 0) {
      fillColor = GREEN;
      fillOpacity = 0.04 + 0.36 * threatPulseAmp;
    } else if (scanIllum > 0) {
      fillColor = GREEN;
      fillOpacity = 0.04 + 0.11 * scanIllum;
    } else {
      fillColor = "white";
      fillOpacity = 0.04;
    }

    return { dotDeg, pos, fillColor, fillOpacity };
  });

  const reportAlpha = interpolate(
    frame,
    [REPORT_START, REPORT_START + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const bar1 =
    frame >= BAR1_START
      ? interpolate(
          frame,
          [BAR1_START, BAR1_START + BAR_DURATION],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          },
        )
      : 0;

  const bar2 =
    frame >= BAR2_START
      ? interpolate(
          frame,
          [BAR2_START, BAR2_START + BAR_DURATION],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          },
        )
      : 0;

  const bar3 =
    frame >= BAR3_START
      ? interpolate(
          frame,
          [BAR3_START, BAR3_START + BAR_DURATION],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          },
        )
      : 0;

  const statusFade = interpolate(
    frame,
    [STATUS_START, STATUS_FADE_END],
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
          aria-label="Security shield visualization"
        >
          {perimeterDots.map((dot) => (
            <circle
              key={`dot-${dot.dotDeg}`}
              cx={dot.pos.x}
              cy={dot.pos.y}
              r={2}
              fill={dot.fillColor}
              opacity={dot.fillOpacity}
            />
          ))}

          {showScanner && (
            <circle
              cx={scannerPos.x}
              cy={scannerPos.y}
              r={4}
              fill="rgba(39,201,63,0.5)"
            />
          )}

          {threats.map((t) => {
            if (!t.isActive || t.dotOpacity <= 0) return null;
            return (
              <circle
                key={`threat-${t.label}`}
                cx={t.pos.x}
                cy={t.pos.y}
                r={3.5}
                fill={`rgba(220,38,38,${(0.3 * t.dotOpacity).toFixed(3)})`}
              />
            );
          })}

          {threats.map((t) => {
            if (!t.isHit || t.pulseT <= 0 || t.pulseT >= 1) return null;
            return (
              <circle
                key={`ring-${t.label}`}
                cx={t.impactPos.x}
                cy={t.impactPos.y}
                r={4 + t.pulseT * 22}
                fill="none"
                stroke={GREEN}
                strokeWidth={1}
                opacity={((1 - t.pulseT) * 0.4).toFixed(3)}
              />
            );
          })}
        </svg>

        <div
          style={{
            position: "absolute",
            left: CX - 70,
            top: CY - 22,
            width: 140,
            height: 44,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.06)",
            backgroundColor: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: sansFont,
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.02em",
            }}
          >
            yourapp.com
          </span>
        </div>

        {threats.map((t) => {
          if (!t.isActive || t.dotOpacity <= 0) return null;
          return (
            <div
              key={`lbl-${t.label}`}
              style={{
                position: "absolute",
                left: t.pos.x + 6,
                top: t.pos.y - 6,
                opacity: t.dotOpacity,
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  fontFamily: monoFont,
                  fontSize: 9,
                  color: "rgba(220,38,38,0.25)",
                  letterSpacing: "0.06em",
                }}
              >
                {t.label}
              </span>
            </div>
          );
        })}

        {reportAlpha > 0 && (
          <div
            style={{
              position: "absolute",
              left: CX - 60,
              top: CY + 80,
              width: 120,
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.06)",
              backgroundColor: "transparent",
              padding: "10px 12px",
              opacity: reportAlpha,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  fontFamily: monoFont,
                  fontSize: 8,
                  color: GREEN,
                  width: 44,
                  flexShrink: 0,
                  letterSpacing: "0.02em",
                }}
              >
                safe
              </span>
              <div
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
              >
                <div
                  style={{
                    width: `${bar1 * 90}%`,
                    height: "100%",
                    borderRadius: 2,
                    backgroundColor: GREEN,
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  fontFamily: monoFont,
                  fontSize: 8,
                  color: "rgba(255,189,46,0.4)",
                  width: 44,
                  flexShrink: 0,
                  letterSpacing: "0.02em",
                }}
              >
                warning
              </span>
              <div
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
              >
                <div
                  style={{
                    width: `${bar2 * 60}%`,
                    height: "100%",
                    borderRadius: 2,
                    backgroundColor: YELLOW,
                    opacity: 0.4,
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: monoFont,
                  fontSize: 8,
                  color: "rgba(220,38,38,0.3)",
                  width: 44,
                  flexShrink: 0,
                  letterSpacing: "0.02em",
                }}
              >
                critical
              </span>
              <div
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
              >
                <div
                  style={{
                    width: `${bar3 * 20}%`,
                    height: "100%",
                    borderRadius: 2,
                    backgroundColor: RED,
                    opacity: 0.3,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {statusFade > 0 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: CY + 175,
              transform: "translateX(-50%)",
              opacity: statusFade * 0.15,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontFamily: monoFont,
                fontSize: 10,
                color: "white",
                letterSpacing: "0.03em",
              }}
            >
              3 threats blocked · 0 breaches
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
