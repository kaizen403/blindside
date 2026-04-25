import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

const BG = "#09090b";
const RED = "#dc2626";
const GREEN = "#34d399";

const CX = 400;
const CY = 300;

const BEAMS = [
  { x1: 0, y1: 50, x2: 400, y2: 300 },
  { x1: 800, y1: 150, x2: 400, y2: 300 },
  { x1: 150, y1: 600, x2: 400, y2: 300 },
  { x1: 650, y1: 0, x2: 400, y2: 300 },
  { x1: 100, y1: 0, x2: 400, y2: 300 },
  { x1: 700, y1: 600, x2: 400, y2: 300 },
];

export const TakeAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg
        width={800}
        height={600}
        viewBox="0 0 800 600"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <g opacity={fadeOut}>
          {BEAMS.map((beam, i) => {
            const delay = i * 3;
            const startFrame = 5 + delay;
            const convergeFrame = 45 + delay;
            const shatterFrame = 52 + delay;

            const progress = interpolate(
              frame,
              [startFrame, convergeFrame],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }
            );

            const currentX = beam.x1 + (beam.x2 - beam.x1) * progress;
            const currentY = beam.y1 + (beam.y2 - beam.y1) * progress;

            const opacity = interpolate(
              frame,
              [startFrame, startFrame + 8, shatterFrame, shatterFrame + 10],
              [0, 0.7, 0.7, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            if (opacity <= 0) return null;

            return (
              <line
                key={i}
                x1={beam.x1}
                y1={beam.y1}
                x2={currentX}
                y2={currentY}
                stroke={RED}
                strokeWidth={1.5}
                opacity={opacity}
                strokeLinecap="round"
              />
            );
          })}

          {BEAMS.map((beam, i) => {
            const delay = i * 3;
            const shatterFrame = 52 + delay;
            const endShatter = shatterFrame + 20;

            const shatterProgress = interpolate(
              frame,
              [shatterFrame, endShatter],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            if (shatterProgress <= 0 || shatterProgress >= 1) return null;

            return (
              <g key={`dust-${i}`}>
                {Array.from({ length: 5 }).map((_, j) => {
                  const angle = ((i * 60 + j * 72) * Math.PI) / 180;
                  const dist = 40 * shatterProgress;
                  const x = beam.x2 + Math.cos(angle) * dist;
                  const y = beam.y2 + Math.sin(angle) * dist;
                  const dustOpacity = (1 - shatterProgress) * 0.4;

                  return (
                    <circle
                      key={j}
                      cx={x}
                      cy={y}
                      r={1.5}
                      fill={j % 2 === 0 ? RED : "#f59e0b"}
                      opacity={dustOpacity}
                    />
                  );
                })}
              </g>
            );
          })}

          {(() => {
            const flashStart = 50;
            const flashEnd = 65;
            const flashProgress = interpolate(
              frame,
              [flashStart, flashEnd],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
            );

            const flashFade = interpolate(
              frame,
              [flashStart + 10, flashEnd + 15],
              [0.8, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            if (flashProgress <= 0) return null;

            return (
              <>
                <circle
                  cx={CX}
                  cy={CY}
                  r={flashProgress * 300}
                  fill="none"
                  stroke={GREEN}
                  strokeWidth={2}
                  opacity={Math.max(0, flashFade)}
                />
                <circle
                  cx={CX}
                  cy={CY}
                  r={flashProgress * 200}
                  fill="none"
                  stroke={GREEN}
                  strokeWidth={1}
                  opacity={Math.max(0, flashFade * 0.5)}
                />
                <circle
                  cx={CX}
                  cy={CY}
                  r={flashProgress * 100}
                  fill="none"
                  stroke={GREEN}
                  strokeWidth={0.5}
                  opacity={Math.max(0, flashFade * 0.25)}
                />
                <circle
                  cx={CX}
                  cy={CY}
                  r={4}
                  fill={GREEN}
                  opacity={interpolate(frame, [flashStart, flashStart + 5], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                />
              </>
            );
          })()}

          {(() => {
            const textStart = 75;
            const textOpacity = interpolate(
              frame,
              [textStart, textStart + 12],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
            );
            const textY = interpolate(
              frame,
              [textStart, textStart + 12],
              [15, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
            );

            if (textOpacity <= 0) return null;

            return (
              <g transform={`translate(0, ${textY})`} opacity={textOpacity}>
                <text
                  x={400}
                  y={260}
                  textAnchor="middle"
                  fill="#fafafa"
                  fontSize={26}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontWeight={500}
                  letterSpacing={-0.5}
                >
                  Blind Side helps you take action
                </text>
                <text
                  x={400}
                  y={300}
                  textAnchor="middle"
                  fill="#dc2626"
                  fontSize={26}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontWeight={500}
                  letterSpacing={-0.5}
                  fontStyle="italic"
                >
                  before
                </text>
                <text
                  x={400}
                  y={340}
                  textAnchor="middle"
                  fill="#fafafa"
                  fontSize={26}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontWeight={500}
                  letterSpacing={-0.5}
                >
                  that happens.
                </text>
              </g>
            );
          })()}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
