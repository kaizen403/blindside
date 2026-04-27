"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function Solution() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const dashboardY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const textColY = useTransform(scrollYProgress, [0, 1], [0, -15]);

  return (
    <section
      id="solution"
      ref={sectionRef}
      className="px-6 md:px-28 py-20 md:py-32"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          style={{ y: dashboardY }}
          className="w-full"
        >
          <Image
            src="/security-dashboard.png"
            alt="Security Overview Dashboard showing 94% secure score with findings by severity"
            width={1200}
            height={700}
            className="w-full h-auto"
            priority
          />
        </motion.div>

        <motion.div style={{ y: textColY }}>
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
            Blindwall helps you find security weaknesses before attackers do.
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
        </motion.div>
      </div>
    </section>
  );
}
