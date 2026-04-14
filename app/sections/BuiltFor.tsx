"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const audiences = [
  "Startups",
  "SaaS Products",
  "Small Businesses",
  "Founders & Indie Builders",
  "Agencies",
  "Growing Product Teams",
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function BuiltFor() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="built-for"
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
          Who Blind Side is{" "}
          <span className="font-serif italic font-normal">for</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Designed for teams that want practical, affordable security without
          unnecessary complexity.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {audiences.map((audience, i) => (
          <motion.div
            key={audience}
            custom={i}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            className="liquid-glass rounded-2xl p-6 text-center cursor-default transition-shadow hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
          >
            <span className="text-base font-semibold">{audience}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
