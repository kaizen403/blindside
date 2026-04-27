"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import Navbar from "@/app/(marketing)/components/Navbar";

const HEADING_WORDS = [
  "Find", "holes", "before",
  "AI", "penetrates.",
];

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 24, rotateX: 40, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      delay: 0.15 + i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -160]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        muted
        loop
        playsInline
        autoPlay
        src="https://pub-ad1790e90bf848a3a9f1b69e95207619.r2.dev/hero-bg.mp4"
      />

      <div className="absolute inset-0 bg-black/50 z-[1]" />

      <div className="relative z-[3] flex flex-col min-h-screen">
        <Navbar />

        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="flex-1 flex flex-col justify-center items-center px-5 pb-24 sm:pb-32"
        >
          <div className="max-w-4xl text-center px-2" style={{ perspective: 600 }}>
            <h1 className="text-[clamp(2rem,6vw,4.5rem)] font-medium tracking-[-0.04em] leading-[1.1] mb-6 flex flex-wrap justify-center gap-x-[0.3em]">
              {HEADING_WORDS.map((word, i) => (
                <motion.span
                  key={word}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={wordVariants}
                  className="inline-block"
                  style={{
                    fontStyle: word === "penetrates." ? "normal" : undefined,
                    fontFamily: word === "penetrates." ? "var(--font-sans)" : undefined,
                    fontWeight: word === "penetrates." ? 500 : undefined,
                    fontSize: word === "penetrates." ? "1.08em" : undefined,
                    letterSpacing: word === "penetrates." ? "-0.01em" : undefined,
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              custom={0.7}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-base leading-relaxed text-white/60 max-w-[520px] mx-auto mb-10"
            >
              AI is making cyberattacks faster, smarter, and more scalable.
              Blindwall helps you identify vulnerabilities in your website,
              app, or infrastructure before they can be exploited.
            </motion.p>

            <motion.div
              custom={0.85}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col items-center gap-5"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[var(--accent)] text-white rounded-full px-8 sm:px-12 py-4 text-base sm:text-lg font-semibold cursor-pointer hover:brightness-110 transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)]"
              >
                Get Protected for <span className="text-xl font-bold">₹999</span>
              </motion.button>

              <p className="text-[13px] text-white/30">
                For startups, small businesses, and growing teams.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--background)] to-transparent z-[4] pointer-events-none" />
    </section>
  );
}
