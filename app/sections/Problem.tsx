"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="px-8 md:px-28 py-24 md:py-32"
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
          AI is changing how attacks{" "}
          <span className="font-serif italic font-normal">happen</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
          className="text-lg text-muted-foreground mx-auto mb-4"
        >
          Attackers no longer rely only on manual methods. With AI, they can
          move faster, test more paths, and uncover vulnerabilities quicker than
          ever before.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
          className="text-lg text-muted-foreground mx-auto"
        >
          That means websites, applications, APIs, and infrastructure are now
          exposed to a new wave of smarter, faster threats. Most businesses are
          not prepared for this shift.
        </motion.p>
      </div>
    </section>
  );
}
