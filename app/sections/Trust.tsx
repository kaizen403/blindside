"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

export default function Trust() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="trust"
      ref={sectionRef}
      className="px-8 md:px-28 py-16 md:py-24 border-t border-b border-white/[0.06]"
    >
      <div className="text-center max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
          className="text-4xl md:text-5xl font-medium tracking-[-1.5px] mb-8"
        >
          Security checks for{" "}
          <span className="font-serif italic font-normal">authorized</span>{" "}
          systems only
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
          className="text-lg text-muted-foreground mx-auto"
        >
          Blind Side only works with applications, websites, and infrastructure
          that you own or are explicitly authorized to test. We are focused on
          helping businesses improve security responsibly.
        </motion.p>
      </div>
    </section>
  );
}
