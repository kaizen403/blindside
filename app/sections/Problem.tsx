"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const centerNode = { x: 200, y: 200, label: "APP" };

const satelliteNodes = [
  { x: 200, y: 65, label: "AUTH", fullLabel: "/api/auth", vuln: "BYPASS" },
  { x: 330, y: 140, label: "DB", fullLabel: "postgres:5432", vuln: "SQLi" },
  { x: 330, y: 260, label: "ENV", fullLabel: ".env.prod", vuln: "LEAKED" },
  { x: 200, y: 335, label: "USR", fullLabel: "/api/users", vuln: "IDOR" },
  { x: 70, y: 260, label: "ADM", fullLabel: "/admin", vuln: "NO ACL" },
  { x: 70, y: 140, label: "KEY", fullLabel: "api-keys", vuln: "PLAIN" },
] as const;

const aiNode = { x: 360, y: 35 };

const PHASE_DURATIONS = [1200, 800, 2000, 2500, 1500, 1500, 500];

function getStatusText(phase: number): string {
  if (phase <= 1) return "IDLE · AWAITING SCAN";
  if (phase === 2) return "ACTIVE · 6 TARGETS";
  if (phase === 3) return "CRITICAL · COMPROMISING";
  return "COMPLETE · 2,847 VECTORS · 0.3s";
}

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [phase, setPhase] = useState(0);
  const [loopKey, setLoopKey] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const next = (phase + 1) % 7;
    const timeout = setTimeout(() => {
      setPhase(next);
      if (next === 0) {
        setLoopKey((k) => k + 1);
      }
    }, PHASE_DURATIONS[phase]);
    return () => clearTimeout(timeout);
  }, [isInView, phase]);

  const showAI = phase >= 1 && phase <= 5;
  const showBeams = phase >= 2 && phase <= 5;
  const showCompromise = phase >= 3 && phase <= 5;
  const isBreached = phase >= 4 && phase <= 5;
  const underAttack = phase >= 2;

  const statusText = getStatusText(phase);

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="px-8 md:px-28 py-24 md:py-32"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="text-4xl md:text-5xl font-medium tracking-[-1.5px] mb-8"
          >
            AI is changing how attacks{" "}
            <span className="font-serif italic font-normal">happen</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="text-lg text-muted-foreground mb-4"
          >
            Attackers no longer rely only on manual methods. With AI, they can
            move faster, test more paths, and uncover vulnerabilities quicker
            than ever before.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="text-lg text-muted-foreground"
          >
            That means websites, applications, APIs, and infrastructure are now
            exposed to a new wave of smarter, faster threats. Most businesses
            are not prepared for this shift.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="rounded-2xl border border-white/[0.06] relative overflow-hidden p-6 md:p-8"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 60%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-white/15" />
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/15">
                Threat Simulation
              </span>
            </div>
            <span className="text-[9px] font-mono text-white/10">LIVE</span>
          </div>

          <svg
            viewBox="0 0 400 400"
            className="w-full"
            style={{ maxHeight: 380 }}
            role="img"
            aria-label="Animated network breach simulation showing AI attacking application endpoints"
          >
            <defs>
              <filter
                id="beam-glow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {satelliteNodes.map((node) => (
              <motion.line
                key={`conn-${node.label}`}
                x1={centerNode.x}
                y1={centerNode.y}
                x2={node.x}
                y2={node.y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={0.5}
                strokeDasharray="4 4"
                animate={underAttack ? { strokeDashoffset: [0, -8] } : {}}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ))}

            <AnimatePresence>
              {showBeams && (
                <motion.g
                  key={`beams-${loopKey}`}
                  filter="url(#beam-glow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {satelliteNodes.map((node, i) => (
                    <motion.path
                      key={`beam-${node.label}`}
                      d={`M ${aiNode.x} ${aiNode.y} L ${node.x} ${node.y}`}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth={1}
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        pathLength: { duration: 0.8, delay: i * 0.05 },
                        opacity: { duration: 0.3, delay: i * 0.05 },
                      }}
                    />
                  ))}
                </motion.g>
              )}
            </AnimatePresence>

            {satelliteNodes.map((node, i) => (
              <g key={`satellite-${node.label}`}>
                <AnimatePresence>
                  {showCompromise && (
                    <motion.circle
                      key={`pulse-${node.label}-${loopKey}`}
                      cx={node.x}
                      cy={node.y}
                      fill="none"
                      stroke="rgba(220,38,38,0.15)"
                      strokeWidth={0.5}
                      initial={
                        { r: 10, opacity: 0.6 } as {
                          r: number;
                          opacity: number;
                        }
                      }
                      animate={
                        { r: 24, opacity: 0 } as {
                          r: number;
                          opacity: number;
                        }
                      }
                      transition={{
                        duration: 1,
                        ease: "easeOut",
                        delay: i * 0.3,
                      }}
                    />
                  )}
                </AnimatePresence>

                <motion.rect
                  x={node.x - 10}
                  y={node.y - 10}
                  width={20}
                  height={20}
                  rx={4}
                  strokeWidth={0.5}
                  animate={{
                    fill:
                      phase >= 3
                        ? "rgba(220,38,38,0.12)"
                        : "rgba(255,255,255,0.04)",
                    stroke:
                      phase >= 3
                        ? "rgba(220,38,38,0.3)"
                        : "rgba(255,255,255,0.12)",
                  }}
                  transition={{
                    duration: 0.4,
                    delay: phase >= 3 ? i * 0.3 : 0,
                  }}
                />

                <text
                  x={node.x}
                  y={node.y + 3}
                  fontSize={8}
                  fill="rgba(255,255,255,0.5)"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {node.label}
                </text>

                <text
                  x={node.x}
                  y={node.y + 22}
                  fontSize={8}
                  fill="rgba(255,255,255,0.15)"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {node.fullLabel}
                </text>

                <AnimatePresence>
                  {showCompromise && (
                    <motion.text
                      key={`vuln-${node.label}-${loopKey}`}
                      x={node.x}
                      y={node.y + 32}
                      fontSize={7}
                      fill="rgba(220,38,38,0.5)"
                      textAnchor="middle"
                      fontFamily="monospace"
                      letterSpacing="0.1em"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.3 + 0.2 }}
                    >
                      {node.vuln}
                    </motion.text>
                  )}
                </AnimatePresence>
              </g>
            ))}

            <g>
              <AnimatePresence>
                {isBreached && (
                  <motion.circle
                    key={`center-pulse-${loopKey}`}
                    cx={centerNode.x}
                    cy={centerNode.y}
                    fill="none"
                    stroke="rgba(220,38,38,0.15)"
                    strokeWidth={0.5}
                    initial={
                      { r: 14, opacity: 0.6 } as {
                        r: number;
                        opacity: number;
                      }
                    }
                    animate={
                      { r: 34, opacity: 0 } as {
                        r: number;
                        opacity: number;
                      }
                    }
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>

              <motion.rect
                x={centerNode.x - 14}
                y={centerNode.y - 14}
                width={28}
                height={28}
                rx={4}
                strokeWidth={0.5}
                animate={{
                  fill:
                    phase >= 4
                      ? "rgba(220,38,38,0.2)"
                      : "rgba(255,255,255,0.04)",
                  stroke:
                    phase >= 4
                      ? "rgba(220,38,38,0.4)"
                      : "rgba(255,255,255,0.12)",
                }}
                transition={{ duration: 0.4 }}
              />

              <text
                x={centerNode.x}
                y={centerNode.y + 3}
                fontSize={8}
                fill="rgba(255,255,255,0.5)"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {centerNode.label}
              </text>

              <text
                x={centerNode.x}
                y={centerNode.y + 24}
                fontSize={8}
                fill="rgba(255,255,255,0.15)"
                textAnchor="middle"
                fontFamily="monospace"
              >
                yourapp.com
              </text>

              <AnimatePresence>
                {isBreached && (
                  <motion.text
                    key={`breach-${loopKey}`}
                    x={200}
                    y={238}
                    fontSize={7}
                    fill="rgba(220,38,38,0.4)"
                    letterSpacing="0.2em"
                    textAnchor="middle"
                    fontFamily="monospace"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    COMPROMISED
                  </motion.text>
                )}
              </AnimatePresence>
            </g>

            <AnimatePresence>
              {showAI && (
                <motion.g
                  key={`ai-node-${loopKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.rect
                    x={aiNode.x - 12}
                    y={aiNode.y - 12}
                    width={24}
                    height={24}
                    rx={4}
                    fill="rgba(255,255,255,0.06)"
                    stroke="none"
                    animate={{ opacity: [0.02, 0.06, 0.02] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <rect
                    x={aiNode.x - 6}
                    y={aiNode.y - 6}
                    width={12}
                    height={12}
                    rx={1}
                    fill="rgba(255,255,255,0.08)"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={0.5}
                    transform={`rotate(45, ${aiNode.x}, ${aiNode.y})`}
                  />

                  <text
                    x={aiNode.x}
                    y={aiNode.y + 18}
                    fontSize={7}
                    fill="rgba(255,255,255,0.25)"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    SCANNER
                  </text>
                </motion.g>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isBreached && (
                <motion.text
                  key={`counter-${loopKey}`}
                  x={200}
                  y={390}
                  fontSize={8}
                  fill="rgba(255,255,255,0.12)"
                  textAnchor="middle"
                  fontFamily="monospace"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  2,847 vectors · 0.3s elapsed
                </motion.text>
              )}
            </AnimatePresence>
          </svg>

          <div className="relative mt-4 pt-3 border-t border-white/[0.04]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: isBreached
                      ? "rgba(220,38,38,0.5)"
                      : "rgba(255,255,255,0.2)",
                  }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[9px] font-mono text-white/15 tracking-wider">
                  {statusText}
                </span>
              </div>
              <span className="text-[9px] font-mono text-white/10">v2.4.1</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
