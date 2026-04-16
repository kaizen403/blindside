"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

type LogEntry = {
  id: number;
  type: "scan" | "found" | "breach" | "status" | "prompt";
  text: string;
  detail?: string;
  severity?: "critical" | "high" | "medium";
};

const ATTACK_SEQUENCE: { delay: number; entry: Omit<LogEntry, "id"> }[] = [
  { delay: 500, entry: { type: "prompt", text: "blindside-agent --target yourapp.com --mode full-auto" } },
  { delay: 600, entry: { type: "status", text: "[init] loading model gpt-4o … ready" } },
  { delay: 350, entry: { type: "status", text: "[recon] enumerating endpoints … 2,847 paths found" } },
  { delay: 400, entry: { type: "scan", text: "[scan] POST /api/auth → testing auth bypass" } },
  { delay: 700, entry: { type: "found", text: "[VULN] /api/auth — JWT secret brute-forced in 0.04s", severity: "critical" } },
  { delay: 200, entry: { type: "scan", text: "[scan] GET /api/users/:id → testing IDOR" } },
  { delay: 500, entry: { type: "found", text: "[VULN] /api/users/1 — IDOR: all user records exposed", severity: "critical" } },
  { delay: 150, entry: { type: "scan", text: "[scan] GET /admin → testing access control" } },
  { delay: 400, entry: { type: "found", text: "[VULN] /admin — no authentication required", severity: "critical" } },
  { delay: 200, entry: { type: "scan", text: "[scan] SELECT * FROM users → testing SQLi" } },
  { delay: 650, entry: { type: "found", text: "[VULN] postgres:5432 — SQLi: database dumped (4.2GB)", severity: "high" } },
  { delay: 100, entry: { type: "scan", text: "[scan] GET /.env.prod → checking exposed files" } },
  { delay: 300, entry: { type: "found", text: "[VULN] .env.prod — AWS_SECRET_KEY + DB creds leaked", severity: "high" } },
  { delay: 150, entry: { type: "scan", text: "[scan] GET /api/keys → checking key storage" } },
  { delay: 400, entry: { type: "found", text: "[VULN] api-keys — stored plaintext in localStorage", severity: "medium" } },
  { delay: 600, entry: { type: "status", text: "[done] scan complete in 0.3s" } },
  { delay: 300, entry: { type: "breach", text: "⣿ COMPROMISED — 6 vulns found across 2,847 attack paths" } },
];

function useCyclingLog(isActive: boolean) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [vulnCount, setVulnCount] = useState(0);
  const idRef = useRef(0);
  const pendingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = useCallback(() => {
    pendingTimers.current.forEach(clearTimeout);
    pendingTimers.current = [];
  }, []);

  const runSequence = useCallback(() => {
    clearAllTimers();
    let accumulated = 0;
    ATTACK_SEQUENCE.forEach(({ delay, entry }) => {
      accumulated += delay;
      const t = setTimeout(() => {
        const id = idRef.current++;
        setEntries((prev) => [...prev.slice(-14), { ...entry, id }]);
        if (entry.type === "found") setVulnCount((c) => c + 1);
        if (entry.type === "breach") {
          const restart = setTimeout(() => {
            setEntries([]);
            setVulnCount(0);
            runSequence();
          }, 3500);
          pendingTimers.current.push(restart);
        }
      }, accumulated);
      pendingTimers.current.push(t);
    });
  }, [clearAllTimers]);

  useEffect(() => {
    if (!isActive) return;
    runSequence();
    return clearAllTimers;
  }, [isActive, runSequence, clearAllTimers]);

  return { entries, vulnCount };
}

const SEVERITY_COLOR: Record<string, string> = {
  critical: "#ff5f56",
  high: "#ffbd2e",
  medium: "#8a8a8a",
};

function LogLine({ entry }: { entry: LogEntry }) {
  const isFound = entry.type === "found";
  const isBreach = entry.type === "breach";
  const isScan = entry.type === "scan";
  const isPrompt = entry.type === "prompt";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease }}
      className="font-mono leading-relaxed whitespace-nowrap"
      style={{ fontSize: 12.5 }}
    >
      {isPrompt ? (
        <span>
          <span style={{ color: "#a0d468" }}>❯</span>
          <span style={{ color: "#c8c8c8" }}> {entry.text}</span>
        </span>
      ) : isBreach ? (
        <span
          style={{ color: "#ff5f56", fontWeight: 600 }}
        >
          {entry.text}
        </span>
      ) : isFound ? (
        <span>
          <span style={{ color: SEVERITY_COLOR[entry.severity ?? "medium"] }}>
            {entry.text}
          </span>
          {entry.severity && (
            <span
              style={{
                color: "#000",
                backgroundColor: SEVERITY_COLOR[entry.severity],
                padding: "0 4px",
                marginLeft: 8,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.04em",
                borderRadius: 2,
              }}
            >
              {entry.severity.toUpperCase()}
            </span>
          )}
        </span>
      ) : isScan ? (
        <span style={{ color: "#6a6a6a" }}>{entry.text}</span>
      ) : (
        <span style={{ color: "#888" }}>{entry.text}</span>
      )}
    </motion.div>
  );
}

function BlinkingCursor() {
  return (
    <motion.span
      className="inline-block font-mono"
      style={{ color: "#a0d468", fontSize: 12.5 }}
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
    >
      ❯ █
    </motion.span>
  );
}

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const { entries, vulnCount } = useCyclingLog(isInView);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (entries.length > 0 && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [entries]);

  const hasBreach = entries.some((e) => e.type === "breach");

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
          className="rounded-lg overflow-hidden"
          style={{
            backgroundColor: "#0c0c0c",
            border: "1px solid #2a2a2a",
            boxShadow: "0 25px 60px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
          }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{
              backgroundColor: "#1a1a1a",
              borderBottom: "1px solid #2a2a2a",
            }}
          >
            <div className="flex items-center gap-[7px]">
              <div className="w-[11px] h-[11px] rounded-full" style={{ backgroundColor: "#ff5f56" }} />
              <div className="w-[11px] h-[11px] rounded-full" style={{ backgroundColor: "#ffbd2e" }} />
              <div className="w-[11px] h-[11px] rounded-full" style={{ backgroundColor: "#27c93f" }} />
            </div>
            <div className="flex-1 text-center">
              <span className="font-mono text-[11px]" style={{ color: "#666" }}>
                blindside-agent — zsh — 80×24
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              {vulnCount > 0 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-mono text-[11px] font-semibold"
                  style={{ color: "#ff5f56" }}
                >
                  {vulnCount} VULN{vulnCount !== 1 ? "S" : ""}
                </motion.span>
              )}
            </div>
          </div>

          <div
            ref={logContainerRef}
            className="px-4 py-3 h-[340px] overflow-y-auto overflow-x-hidden scrollbar-none"
            style={{ backgroundColor: "#0c0c0c" }}
          >
            <AnimatePresence mode="popLayout">
              {entries.map((entry) => (
                <LogLine key={entry.id} entry={entry} />
              ))}
            </AnimatePresence>
            {!hasBreach && <BlinkingCursor />}
          </div>

          <div
            className="px-4 py-2 flex items-center justify-between"
            style={{
              backgroundColor: hasBreach ? "#1c0a0a" : "#1a1a1a",
              borderTop: `1px solid ${hasBreach ? "#3a1515" : "#2a2a2a"}`,
              transition: "background-color 0.5s, border-color 0.5s",
            }}
          >
            <span
              className="font-mono text-[11px]"
              style={{ color: hasBreach ? "#ff5f56" : "#444" }}
            >
              {hasBreach
                ? "yourapp.com compromised"
                : entries.length > 0
                  ? "scanning…"
                  : "ready"}
            </span>
            <span className="font-mono text-[10px]" style={{ color: "#333" }}>
              blind-side v2.4
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
