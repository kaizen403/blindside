"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/app/components/Navbar";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroTextY = useTransform(scrollYProgress, [0, 0.5], [0, -200]);
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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

      <div className="absolute inset-0 bg-black/40 z-[1]" />

      <motion.div
        aria-hidden
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(circle, rgba(120, 119, 198, 0.15), rgba(120, 119, 198, 0.05) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-[3]">
        <Navbar />

        <motion.div
          style={{ y: heroTextY, opacity: heroTextOpacity }}
          className="flex flex-col items-center text-center mt-16 md:mt-24 px-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-[5.5rem] tracking-[-3px] font-medium leading-tight md:leading-[1.15] mb-3"
          >
            Protect your application from AI{" "}
            <span className="font-serif italic font-normal">threats</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg font-normal leading-6 opacity-90 mb-8 text-[var(--hero-subtitle)]"
          >
            AI is making cyberattacks faster, smarter, and more scalable.
            <br />
            Blind Side helps you identify vulnerabilities in your website, app,
            or infrastructure before they can be exploited.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[var(--accent)] text-white rounded-full px-10 py-4 text-base font-semibold cursor-pointer hover:brightness-110 transition"
            >
              Get Protected for ₹999
            </motion.button>
          </motion.div>

          <p className="text-sm text-muted-foreground mt-6">
            Affordable security checks for startups, small businesses, and
            growing teams.
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--background)] to-transparent z-[4] pointer-events-none" />
    </section>
  );
}
