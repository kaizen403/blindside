"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="pricing"
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
        <div className="liquid-glass rounded-2xl p-10 md:p-14 text-center">
          <p className="text-5xl md:text-6xl font-bold mb-2">{"\u20B9"}999</p>
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
            className="bg-white text-black rounded-full px-8 py-3.5 text-base font-medium cursor-pointer hover:opacity-90 transition"
          >
            Get Protected Now
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
