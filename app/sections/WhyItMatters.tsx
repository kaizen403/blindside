"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

export default function WhyItMatters() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="why-it-matters"
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
          Why businesses need protection from AI{" "}
          <span className="font-serif italic font-normal">threats</span>
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
          AI is making it easier for attackers to identify weak points at scale.
          A vulnerability that once went unnoticed can now be discovered much
          faster.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
          className="text-lg text-muted-foreground mx-auto mb-4"
        >
          For startups and growing businesses, even a small security gap can
          lead to bigger consequences — lost trust, downtime, exposed data, or
          financial damage.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
          className="text-lg text-foreground font-medium mx-auto"
        >
          Blind Side helps you take action before that happens.
        </motion.p>
      </div>
    </section>
  );
}
