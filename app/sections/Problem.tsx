"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const targets = [
  { endpoint: "/api/auth", vuln: "Weak Authentication", severity: "critical" },
  { endpoint: "/api/users", vuln: "IDOR Detected", severity: "critical" },
  { endpoint: "/admin", vuln: "Missing Access Control", severity: "critical" },
  { endpoint: "postgres:5432", vuln: "SQL Injection", severity: "high" },
  { endpoint: ".env.prod", vuln: "Secrets Exposed", severity: "high" },
  { endpoint: "api-keys", vuln: "Plaintext Storage", severity: "medium" },
] as const;

type ScanPhase = "idle" | "scanning" | "found" | "complete";

function getPhaseForTarget(
  globalPhase: number,
  targetIndex: number,
): ScanPhase {
  if (globalPhase === 0) return "idle";
  if (globalPhase === 1) {
    return targetIndex <= 1 ? "scanning" : "idle";
  }
  if (globalPhase === 2) {
    if (targetIndex <= 1) return "found";
    if (targetIndex <= 3) return "scanning";
    return "idle";
  }
  if (globalPhase === 3) {
    if (targetIndex <= 3) return "found";
    if (targetIndex <= 5) return "scanning";
    return "idle";
  }
  return "found";
}

function getProgress(phase: number): number {
  if (phase === 0) return 0;
  if (phase === 1) return 18;
  if (phase === 2) return 45;
  if (phase === 3) return 72;
  return 100;
}

function getStatusText(phase: number): string {
  if (phase === 0) return "Initializing...";
  if (phase <= 3) return "Scanning endpoints...";
  return "Scan complete";
}

function getVulnCount(phase: number): number {
  if (phase === 0) return 0;
  if (phase === 1) return 0;
  if (phase === 2) return 2;
  if (phase === 3) return 4;
  return 6;
}

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const durations = [1200, 1800, 1800, 1800, 3000, 500];
    const timeout = setTimeout(() => {
      setPhase((prev) => (prev + 1) % 6);
    }, durations[phase]);
    return () => clearTimeout(timeout);
  }, [isInView, phase]);

  const progress = getProgress(phase);
  const vulnCount = getVulnCount(phase);
  const isComplete = phase >= 4;

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
          className="rounded-2xl border border-white/[0.06] overflow-hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 60%)",
          }}
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: isComplete
                    ? "rgba(239,68,68,0.7)"
                    : "rgba(255,255,255,0.25)",
                }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: isComplete ? 1 : 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="text-xs font-mono text-white/40 tracking-wide">
                AI Threat Scanner
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/20">
              {isComplete ? "6 FOUND" : "SCANNING"}
            </span>
          </div>

          <div className="px-5 py-5">
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/60">yourapp.com</span>
                <span className="text-xs font-mono text-white/25">
                  {progress}%
                </span>
              </div>
              <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: isComplete
                      ? "rgba(239,68,68,0.5)"
                      : "rgba(255,255,255,0.2)",
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              {targets.map((target, i) => {
                const targetPhase = getPhaseForTarget(phase, i);
                return (
                  <motion.div
                    key={target.endpoint}
                    initial={{ opacity: 0, x: -8 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.06, ease }}
                    className="flex items-center justify-between py-2 px-3 rounded-lg transition-colors duration-500"
                    style={{
                      backgroundColor:
                        targetPhase === "found"
                          ? "rgba(239,68,68,0.06)"
                          : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                        {targetPhase === "idle" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        )}
                        {targetPhase === "scanning" && (
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-white/30"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                        {targetPhase === "found" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, ease }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              role="img"
                              aria-label="Vulnerability found"
                            >
                              <circle
                                cx="7"
                                cy="7"
                                r="6"
                                stroke="rgba(239,68,68,0.4)"
                                strokeWidth="1"
                              />
                              <path
                                d="M4.5 7L6.5 9L9.5 5"
                                stroke="rgba(239,68,68,0.7)"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>

                      <span
                        className="text-sm font-mono transition-colors duration-500"
                        style={{
                          color:
                            targetPhase === "found"
                              ? "rgba(255,255,255,0.7)"
                              : "rgba(255,255,255,0.3)",
                        }}
                      >
                        {target.endpoint}
                      </span>
                    </div>

                    <div className="text-right">
                      {targetPhase === "idle" && (
                        <span className="text-[11px] font-mono text-white/10">
                          Queued
                        </span>
                      )}
                      {targetPhase === "scanning" && (
                        <motion.span
                          className="text-[11px] font-mono text-white/25"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          Scanning...
                        </motion.span>
                      )}
                      {targetPhase === "found" && (
                        <motion.span
                          className="text-[11px] font-mono text-red-400/60"
                          initial={{ opacity: 0, x: 4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {target.vuln}
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              className="mt-5 pt-4 border-t border-white/[0.04]"
              animate={{ opacity: vulnCount > 0 ? 1 : 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-white/20 mb-0.5">
                      Vulnerabilities
                    </p>
                    <p
                      className="text-lg font-mono font-medium transition-colors duration-500"
                      style={{
                        color:
                          vulnCount > 0
                            ? "rgba(239,68,68,0.7)"
                            : "rgba(255,255,255,0.15)",
                      }}
                    >
                      {vulnCount}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-white/[0.04]" />
                  <div>
                    <p className="text-xs text-white/20 mb-0.5">
                      Paths tested
                    </p>
                    <p className="text-lg font-mono font-medium text-white/30">
                      {isComplete ? "2,847" : phase >= 2 ? "1,204" : "—"}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-white/[0.04]" />
                  <div>
                    <p className="text-xs text-white/20 mb-0.5">Time</p>
                    <p className="text-lg font-mono font-medium text-white/30">
                      {isComplete ? "0.3s" : phase >= 1 ? "..." : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="px-5 py-3 border-t border-white/[0.04] flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/15">
              {getStatusText(phase)}
            </span>
            <span className="text-[10px] font-mono text-white/10">
              blind-side v2.4
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
