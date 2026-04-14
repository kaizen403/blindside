"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";

const terminalLines = [
  { text: "$ ai-scan --target yourapp.com --mode aggressive", type: "command" },
  { text: "[SCANNING] Port 443... open", type: "info" },
  { text: "[SCANNING] /api/v1/auth... exposed", type: "info" },
  { text: "[VULN] SQL injection: /api/users?id=", type: "vuln" },
  { text: "[VULN] Broken access control: /admin/dashboard", type: "vuln" },
  { text: "[VULN] Exposed API key in /config.js", type: "vuln" },
  { text: "[AI] Generating 847 attack paths...", type: "ai" },
  { text: "[AI] Testing 3 critical vectors simultaneously...", type: "ai" },
  { text: "[AI] Escalation complete. 12 exploits ready.", type: "ai" },
] as const;

type LineType = (typeof terminalLines)[number]["type"];

function lineColor(type: LineType): string {
  switch (type) {
    case "command":
      return "text-emerald-400";
    case "info":
      return "text-white/60";
    case "vuln":
      return "text-red-400";
    case "ai":
      return "text-amber-400";
  }
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (visibleLines >= terminalLines.length) return;
    const timeout = setTimeout(
      () => {
        setVisibleLines((prev) => prev + 1);
      },
      visibleLines === 0 ? 400 : 600 + Math.random() * 400,
    );
    return () => clearTimeout(timeout);
  }, [isInView, visibleLines]);

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
          className="liquid-glass rounded-2xl overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <span className="ml-3 font-mono text-xs text-white/40 tracking-wide">
              ai-scanner
            </span>
          </div>

          <div className="bg-black/40 p-5 font-mono text-sm min-h-[260px]">
            {terminalLines.slice(0, visibleLines).map((line) => (
              <motion.div
                key={line.text}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`leading-relaxed ${lineColor(line.type)}`}
              >
                {line.text}
              </motion.div>
            ))}

            {visibleLines >= terminalLines.length && (
              <span className="text-emerald-400 animate-pulse">█</span>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
