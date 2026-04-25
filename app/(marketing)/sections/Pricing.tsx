"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const cardY = useTransform(scrollYProgress, [0, 1], [50, -20]);
  const cardScale = useTransform(scrollYProgress, [0.2, 0.5], [0.97, 1]);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="px-8 md:px-28 py-32 md:py-44"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-14"
      >
        <h2 className="text-4xl md:text-5xl font-medium tracking-[-1.5px] mb-4">
          Simple <span className="font-serif italic font-normal">pricing</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.6,
          delay: 0.15,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        }}
        className="max-w-lg mx-auto"
      >
        <motion.div style={{ y: cardY, scale: cardScale }}>
          <div className="liquid-glass rounded-2xl p-10 md:p-14 text-center">
          <p className="text-7xl md:text-8xl font-bold tracking-[-2px] mb-2">{"\u20B9"}999</p>
          <p className="text-lg text-muted-foreground mb-6">
            per security check
          </p>

          <div className="w-16 h-px bg-white/10 my-6 mx-auto" />

          <p className="text-sm text-foreground/80 leading-relaxed mb-4">
            A fast and affordable way to understand where your application may
            be exposed to AI threats.
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            Ideal for businesses looking for an initial security review and a
            clear starting point for improving security.
          </p>

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[var(--accent)] text-white rounded-full px-10 py-4 text-base font-semibold cursor-pointer hover:brightness-110 transition"
          >
            Get Protected Now
          </motion.button>
        </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
