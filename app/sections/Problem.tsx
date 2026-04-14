"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const centerNode = { x: 200, y: 200, label: "yourapp.com" };

const satelliteNodes = [
  { x: 200, y: 60, label: "/api/auth", vuln: "Weak auth" },
  { x: 340, y: 130, label: "database", vuln: "SQLi" },
  { x: 340, y: 270, label: "/config", vuln: "Leaked key" },
  { x: 200, y: 340, label: "/users", vuln: "Exposed" },
  { x: 60, y: 270, label: "/admin", vuln: "No ACL" },
  { x: 60, y: 130, label: "API Keys", vuln: "Plaintext" },
] as const;

const aiNode = { x: 370, y: 30 };

const PHASE_DURATIONS = [1000, 1000, 2000, 2500, 1500, 1500, 500];

function getStatusText(phase: number): string {
  if (phase <= 1) return "Initializing scan...";
  if (phase === 2) return "Attacking 6 endpoints...";
  if (phase === 3) return "Compromising targets...";
  return "Full breach achieved · 847 paths · 0.4s";
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
          className="liquid-glass rounded-2xl p-6 md:p-8"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/20">
              Live Threat Simulation
            </span>
          </div>

          <svg
            viewBox="0 0 400 400"
            className="w-full"
            style={{ maxHeight: 380 }}
            role="img"
            aria-label="Animated network breach simulation showing AI attacking application endpoints"
          >
            {satelliteNodes.map((node) => (
              <line
                key={`conn-${node.label}`}
                x1={centerNode.x}
                y1={centerNode.y}
                x2={node.x}
                y2={node.y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
            ))}

            <AnimatePresence>
              {showBeams && (
                <motion.g
                  key={`beams-${loopKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {satelliteNodes.map((node, i) => (
                    <motion.path
                      key={`beam-${node.label}`}
                      d={`M ${aiNode.x} ${aiNode.y} L ${node.x} ${node.y}`}
                      stroke="rgba(6,182,212,0.6)"
                      strokeWidth={1.5}
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
                      stroke="rgba(239,68,68,0.6)"
                      strokeWidth={1}
                      initial={
                        { r: 6, opacity: 0.8 } as {
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

                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={6}
                  strokeWidth={1}
                  animate={{
                    fill:
                      phase >= 3
                        ? "rgba(239,68,68,0.8)"
                        : "rgba(255,255,255,0.15)",
                    stroke:
                      phase >= 3
                        ? "rgba(239,68,68,0.4)"
                        : "rgba(255,255,255,0.2)",
                  }}
                  transition={{
                    duration: 0.4,
                    delay: phase >= 3 ? i * 0.3 : 0,
                  }}
                />

                <text
                  x={node.x}
                  y={node.y + 16}
                  fontSize={9}
                  fill="rgba(255,255,255,0.3)"
                  textAnchor="middle"
                >
                  {node.label}
                </text>

                <AnimatePresence>
                  {showCompromise && (
                    <motion.text
                      key={`vuln-${node.label}-${loopKey}`}
                      x={node.x}
                      y={node.y + 26}
                      fontSize={8}
                      fill="rgba(239,68,68,0.7)"
                      textAnchor="middle"
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
                    stroke="rgba(239,68,68,0.5)"
                    strokeWidth={1.5}
                    initial={
                      { r: 10, opacity: 0.8 } as {
                        r: number;
                        opacity: number;
                      }
                    }
                    animate={
                      { r: 30, opacity: 0 } as {
                        r: number;
                        opacity: number;
                      }
                    }
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>

              <motion.circle
                cx={centerNode.x}
                cy={centerNode.y}
                r={10}
                strokeWidth={1.5}
                animate={{
                  fill:
                    phase >= 4
                      ? "rgba(239,68,68,0.9)"
                      : "rgba(255,255,255,0.2)",
                  stroke:
                    phase >= 4
                      ? "rgba(239,68,68,0.5)"
                      : "rgba(255,255,255,0.3)",
                }}
                transition={{ duration: 0.4 }}
              />

              <text
                x={centerNode.x}
                y={centerNode.y + 22}
                fontSize={9}
                fill="rgba(255,255,255,0.3)"
                textAnchor="middle"
              >
                {centerNode.label}
              </text>

              <AnimatePresence>
                {isBreached && (
                  <motion.text
                    key={`breach-${loopKey}`}
                    x={200}
                    y={238}
                    fontSize={11}
                    fill="rgba(239,68,68,0.8)"
                    fontWeight="600"
                    letterSpacing="0.15em"
                    textAnchor="middle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    BREACH
                  </motion.text>
                )}
              </AnimatePresence>
            </g>

            <AnimatePresence>
              {showAI && (
                <motion.g
                  key={`ai-orb-${loopKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.circle
                    cx={aiNode.x}
                    cy={aiNode.y}
                    r={16}
                    fill="rgba(6,182,212,0.15)"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <circle
                    cx={aiNode.x}
                    cy={aiNode.y}
                    r={8}
                    fill="rgba(6,182,212,0.7)"
                  />
                  <text
                    x={aiNode.x - 18}
                    y={aiNode.y + 4}
                    fontSize={9}
                    fill="rgba(6,182,212,0.8)"
                    textAnchor="middle"
                  >
                    AI
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
                  fontSize={10}
                  fill="rgba(255,255,255,0.25)"
                  textAnchor="middle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  847 paths · 0.4s
                </motion.text>
              )}
            </AnimatePresence>
          </svg>

          <div className="mt-4 flex items-center gap-2">
            <motion.div
              className={`w-1.5 h-1.5 rounded-full ${
                isBreached ? "bg-red-400/60" : "bg-emerald-400/40"
              }`}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] font-mono text-white/30 tracking-wide">
              {statusText}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
