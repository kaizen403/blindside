"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const severities = [
  { label: "Critical", count: 3, color: "bg-red-400", width: "75%" },
  { label: "High", count: 2, color: "bg-orange-400", width: "50%" },
  { label: "Medium", count: 1, color: "bg-amber-400", width: "25%" },
  { label: "Low", count: 1, color: "bg-blue-400", width: "12.5%" },
];

const findings = [
  { text: "SQL injection", action: "Fix first" },
  { text: "Access control", action: "Review" },
  { text: "Exposed key", action: "Rotate" },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function Solution() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="solution"
      ref={sectionRef}
      className="px-8 md:px-28 py-24 md:py-32"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
          className="order-2 lg:order-1"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease }}
        >
          <div className="liquid-glass rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
              <div>
                <p className="text-sm font-semibold">Blind Side Security Report</p>
                <p className="text-xs text-muted-foreground mt-0.5">yourapp.com</p>
              </div>
              <div className="flex items-center gap-1.5">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400/60"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[10px] font-mono text-white/30">Scan complete</span>
              </div>
            </div>

            <div>
              {severities.map((severity, i) => (
                <div key={severity.label} className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-muted-foreground w-14 shrink-0">
                    {severity.label}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${severity.color}`}
                      initial={{ width: 0 }}
                      animate={isInView ? { width: severity.width } : { width: 0 }}
                      transition={{
                        duration: 1,
                        delay: 0.3 + i * 0.15,
                        ease,
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-white/40 w-12 text-right">
                    {severity.count} found
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-white/[0.06] my-4" />

            <div>
              {findings.map((finding, i) => (
                <motion.div
                  key={finding.text}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 1.2 + i * 0.15, ease }}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-4 h-4 rounded-full border border-emerald-400/40 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: 1.4 + i * 0.15 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </motion.div>
                    <span className="text-sm">{finding.text}</span>
                  </div>
                  <span className="text-xs font-mono text-white/30">{finding.action}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-muted-foreground">7 issues identified</span>
              <span className="text-xs text-emerald-400/70 font-medium">Fix critical first</span>
            </div>
          </div>
        </motion.div>

        <div className="order-1 lg:order-2">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="text-4xl md:text-5xl font-medium tracking-[-1.5px] mb-8"
          >
            Stay ahead of AI-powered{" "}
            <span className="font-serif italic font-normal">attacks</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="text-lg text-muted-foreground mb-4"
          >
            Blind Side helps you find security weaknesses before attackers do.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="text-lg text-muted-foreground"
          >
            We check your application for vulnerabilities and provide a simple,
            clear report showing what needs attention, what is at risk, and what
            should be fixed first. Instead of waiting for a real attack to expose
            the problem, you get visibility early — while there is still time to
            act.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
