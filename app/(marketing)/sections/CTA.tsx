"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const contentY = useTransform(scrollYProgress, [0, 1], [30, -10]);

  return (
    <section id="cta" ref={sectionRef} className="relative py-32 md:py-40 px-8 md:px-28">
      <motion.div
        aria-hidden
        style={{ y: orbY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-[600px] h-[400px] rounded-full bg-white/[0.03] blur-[120px]" />
      </motion.div>

      <motion.div
        style={{ y: contentY }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <h2 className="text-4xl md:text-5xl font-medium tracking-[-1.5px] mb-4">
          Do not wait for attackers to find the{" "}
          <span className="font-serif italic font-normal">problem</span> first
        </h2>

        <p className="text-lg text-muted-foreground mb-10 max-w-md">
          AI threats are growing fast. Blind Side helps you discover
          vulnerabilities early, understand your risks, and take action before
          damage is done.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[var(--accent)] text-white rounded-full px-10 py-4 text-base font-semibold cursor-pointer hover:brightness-110 transition"
          >
            Protect My Application for ₹999
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-sm text-muted-foreground"
        >
          Starting protection for startups and growing businesses.
        </motion.p>
      </motion.div>
    </section>
  );
}
