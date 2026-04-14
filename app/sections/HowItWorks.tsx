"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Submit your application",
    tag: "INPUT",
    description: "Share your website, app, API, or target asset for review.",
  },
  {
    number: 2,
    title: "We identify security gaps",
    tag: "ANALYZE",
    description:
      "We analyze your application for weaknesses that could be exposed to modern AI-driven threats.",
  },
  {
    number: 3,
    title: "Receive your report",
    tag: "OUTPUT",
    description:
      "Get a clear vulnerability report with insights, severity levels, and recommended next steps.",
  },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function HowItWorks() {
  const [active, setActive] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="px-8 md:px-28 py-24 md:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
        className="mb-14"
      >
        <h2 className="text-4xl md:text-5xl font-medium tracking-[-1.5px] mb-4">
          How Blind Side{" "}
          <span className="font-serif italic font-normal">works</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl">
          Three simple steps from submission to actionable security insights.
        </p>
      </motion.div>

      <div className="max-w-xl">
        <div className="relative flex flex-col">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease,
              }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="relative flex gap-6 cursor-default"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${
                    active === i
                      ? "bg-white/10 border border-white/20"
                      : "liquid-glass"
                  }`}
                >
                  <span className="text-sm font-semibold tabular-nums">
                    {step.number}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <motion.div
                    className="w-px flex-1 my-1 bg-border origin-top"
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.1 + 0.3,
                      ease,
                    }}
                  />
                )}
              </div>

              <div
                className={`transition-opacity duration-300 ${
                  i < steps.length - 1 ? "pb-10" : "pb-0"
                } ${active !== null && active !== i ? "opacity-30" : "opacity-100"}`}
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <h3 className="text-base font-semibold leading-tight">
                    {step.title}
                  </h3>
                  <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-white/25">
                    {step.tag}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
