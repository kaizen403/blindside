"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const reportItems = [
  "What vulnerabilities were found",
  "How serious they are",
  "What areas are affected",
  "What actions should be taken next",
];

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function Report() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="report"
      ref={sectionRef}
      className="px-8 md:px-28 py-24 md:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-14"
      >
        <h2 className="text-4xl md:text-5xl font-medium tracking-[-1.5px] mb-4">
          Security insights you can actually{" "}
          <span className="font-serif italic font-normal">use</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Blind Side gives you a clean and simple view of your
          application&apos;s security findings.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.6,
          delay: 0.15,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        }}
        className="liquid-glass rounded-2xl p-8 max-w-2xl mx-auto"
      >
        <p className="text-sm text-muted-foreground mb-6">
          Your report is designed to help you quickly understand:
        </p>

        <ul className="flex flex-col gap-3">
          {reportItems.map((item, i) => (
            <motion.li
              key={item}
              custom={i}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={itemVariants}
              className="flex items-start gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0" />
              <span className="text-sm text-foreground/80">{item}</span>
            </motion.li>
          ))}
        </ul>

        <p className="text-sm text-muted-foreground mt-6 pt-4 border-t border-white/[0.06]">
          No unnecessary complexity. Just useful visibility.
        </p>
      </motion.div>
    </section>
  );
}
