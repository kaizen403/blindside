"use client";

import { motion, useInView, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useMotionValueEvent(
    useTransform(() => (isInView ? 1 : 0)),
    "change",
    (v) => {
      if (v === 1) {
        const duration = 1800;
        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }
  );

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function ThreatPulse() {
  const [alerts, setAlerts] = useState<{ id: number; text: string; x: number; y: number; color: string }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const threats = [
      { text: "SQLi detected", color: "#dc2626" },
      { text: "XSS payload", color: "#f97316" },
      { text: "CSRF token missing", color: "#dc2626" },
      { text: "Open port 3306", color: "#eab308" },
      { text: "Exposed .env", color: "#dc2626" },
      { text: "Weak cipher", color: "#f97316" },
      { text: "Path traversal", color: "#eab308" },
      { text: "Unpatched CVE", color: "#dc2626" },
      { text: "API key leaked", color: "#dc2626" },
      { text: "SSRF attempt", color: "#f97316" },
      { text: "DNS rebind", color: "#eab308" },
      { text: "RCE vector", color: "#dc2626" },
    ];

    const interval = setInterval(() => {
      const t = threats[Math.floor(Math.random() * threats.length)];
      const id = idRef.current++;
      setAlerts((prev) => [
        ...prev.slice(-8),
        { id, text: t.text, x: 15 + Math.random() * 70, y: 10 + Math.random() * 80, color: t.color },
      ]);
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[200px]">
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-[0.07]">
        {Array.from({ length: 6 }).map((_, i) => (
          <circle key={i} cx={100} cy={100} r={20 + i * 18} fill="none" stroke="#dc2626" strokeWidth={0.5} />
        ))}
        <line x1={100} y1={0} x2={100} y2={200} stroke="#dc2626" strokeWidth={0.3} />
        <line x1={0} y1={100} x2={200} y2={100} stroke="#dc2626" strokeWidth={0.3} />
      </svg>

      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        <line x1={100} y1={0} x2={100} y2={200} stroke="#dc2626" strokeWidth={1.5} opacity={0.08}>
          <animate attributeName="x1" values="0;200" dur="3s" repeatCount="indefinite" />
          <animate attributeName="x2" values="0;200" dur="3s" repeatCount="indefinite" />
        </line>
      </svg>

      {alerts.map((a) => (
        <motion.div
          key={a.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1, 0.8] }}
          transition={{ duration: 2.8, ease: "easeOut" }}
          className="absolute font-mono text-[9px] whitespace-nowrap pointer-events-none"
          style={{ left: `${a.x}%`, top: `${a.y}%`, color: a.color }}
        >
          <span className="opacity-60">⚠</span> {a.text}
        </motion.div>
      ))}
    </div>
  );
}

export default function WhyItMatters() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineWidth = useTransform(scrollYProgress, [0.05, 0.25], ["0%", "100%"]);
  const statOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const statY = useTransform(scrollYProgress, [0.15, 0.35], [60, 0]);
  const closingOpacity = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);
  const closingY = useTransform(scrollYProgress, [0.45, 0.65], [80, 0]);
  const videoY = useTransform(scrollYProgress, [0, 1], [60, -30]);
  const videoScale = useTransform(scrollYProgress, [0.3, 0.7], [0.95, 1.02]);

  return (
    <section
      id="why-it-matters"
      ref={sectionRef}
      className="relative px-6 md:px-28 py-24 md:py-48 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-6 md:mb-8"
        >
          <span className="inline-flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.2em] text-[#dc2626]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#dc2626] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#dc2626]" />
            </span>
            Active Threat Environment
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.06, ease: EASE }}
          className="mb-20 md:mb-28"
        >
          <h2 className="text-[clamp(2.8rem,8vw,7rem)] font-medium tracking-[-0.03em] leading-[0.92] max-w-[14ch]">
            Why businesses need{" "}
            <span className="font-serif italic font-normal">protection</span>{" "}
            from AI{" "}
            <span className="text-[#dc2626] font-serif italic font-normal">
              threats
            </span>
          </h2>
          <div className="mt-6 h-px bg-white/[0.08] max-w-xl relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[#dc2626]"
              style={{ width: lineWidth }}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-28 md:mb-40">
          <div className="md:col-span-5 md:col-start-1">
            <motion.div
              style={{ opacity: statOpacity, y: statY }}
              className="mb-8"
            >
              <div className="text-[clamp(5rem,14vw,12rem)] font-medium leading-[0.85] tracking-[-0.04em] text-[#dc2626]">
                <AnimatedCounter target={277} suffix="d" />
              </div>
              <p className="text-sm text-white/40 mt-3 font-mono tracking-wide uppercase">
                Average days to detect a security breach
              </p>
            </motion.div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              className="text-lg md:text-xl leading-relaxed max-w-xl mb-12 text-white/[0.55]"
            >
              AI is making it easier for attackers to identify weak points at
              scale. A vulnerability that once went unnoticed can now be
              discovered far faster than before.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.28, ease: EASE }}
              className="text-lg md:text-xl leading-relaxed max-w-xl text-white/[0.55]"
            >
              For startups and growing businesses, even a small security gap can
              lead to serious consequences: lost trust, downtime, exposed data, or
              financial damage.
            </motion.p>
          </div>
        </div>

        <motion.div
          style={{ opacity: closingOpacity, y: closingY }}
          className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
        >
          <div className="md:col-span-7 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#dc2626] hidden md:block" />
            <div className="md:pl-12">
              <p className="text-[clamp(1.8rem,5vw,4.5rem)] font-medium tracking-[-0.02em] leading-[1.05] max-w-[18ch] text-white">
                Blindwall helps you take action{" "}
                <span className="font-serif italic font-normal text-[#dc2626]">
                  before
                </span>{" "}
                that happens.
              </p>
            </div>
          </div>
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <motion.div
              style={{ y: videoY, scale: videoScale }}
              className="w-full max-w-[320px]"
            >
              <ThreatPulse />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
