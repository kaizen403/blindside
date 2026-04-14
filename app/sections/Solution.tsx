"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

export default function Solution() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="solution"
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
          Stay ahead of AI-powered{" "}
          <span className="font-serif italic font-normal">attacks</span>
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
          Blind Side helps you find security weaknesses before attackers do.
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
          We check your application for vulnerabilities and provide a simple,
          clear report showing what needs attention, what is at risk, and what
          should be fixed first. Instead of waiting for a real attack to expose
          the problem, you get visibility early — while there is still time to
          act.
        </motion.p>
      </div>
    </section>
  );
}
