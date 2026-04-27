"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    title: "Vulnerability Detection",
    description:
      "Find hidden security weaknesses in your application and digital assets.",
    image: "/Vulnerability Detection.png",
  },
  {
    title: "Clear Risk Visibility",
    description:
      "Understand which issues matter most and where your biggest risks are.",
    image: "/Clear Risk Visibility.png",
  },
  {
    title: "Simple Reporting",
    description:
      "Get an easy-to-understand report with findings and priority levels.",
    image: "/Simple Reporting.png",
  },
  {
    title: "Actionable Next Steps",
    description:
      "Know what should be fixed first to improve your security posture.",
    image: "/Actionable Next Steps.png",
  },
  {
    title: "Affordable Protection",
    description: "Start securing your application for just ₹999.",
    image: "/Affordable Protection.png",
  },
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const cardConfigs = [
  { span: "lg:col-span-4", aspect: "16/10", numSize: "text-5xl" },
  { span: "lg:col-span-4", aspect: "16/10", numSize: "text-5xl" },
  { span: "lg:col-span-4", aspect: "16/10", numSize: "text-5xl" },
  { span: "lg:col-span-6", aspect: "16/9", numSize: "text-7xl" },
  { span: "lg:col-span-6", aspect: "16/9", numSize: "text-7xl" },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end start"],
  });

  const lineWidth = useTransform(scrollYProgress, [0, 0.15], ["0%", "100%"]);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="px-6 md:px-28 py-24 md:py-48"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
        className="mb-6 md:mb-8"
      >
        <span className="inline-flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.2em] text-[#dc2626]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#dc2626] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#dc2626]" />
          </span>
          Feature Set
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.06, ease: EASE }}
        className="mb-20 md:mb-28"
      >
        <h2 className="text-[clamp(2.8rem,8vw,7.5rem)] font-medium tracking-[-0.03em] leading-[0.92] max-w-[14ch]">
          What you get with{" "}
          <span className="font-serif italic font-normal">Blindwall</span>
        </h2>
        <div className="mt-6 h-px bg-white/[0.08] max-w-xl relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-[#dc2626]"
            style={{ width: lineWidth }}
          />
        </div>
        <p className="text-lg md:text-xl text-white/[0.45] max-w-xl mt-8 leading-relaxed">
          Simple security checks that give you clear visibility and actionable
          next steps.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 md:gap-6">
        {features.map((feature, i) => {
          const config = cardConfigs[i];
          const isHero = i === 0;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40, x: i % 2 === 0 ? -8 : 8 }}
              animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 + i * 0.1,
                ease: EASE,
              }}
              whileHover={{ y: -4 }}
              className={`liquid-glass rounded-2xl overflow-hidden cursor-default transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)] ${config.span}`}
            >
              <div className="relative">
                <div className="absolute top-4 right-5 z-10">
                  <span className={`font-medium tracking-[-0.02em] text-white/20 ${config.numSize}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div
                  className="w-full"
                  style={{ aspectRatio: config.aspect }}
                >
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                    style={{
                      maskImage:
                        "linear-gradient(to bottom, black 60%, transparent 100%), linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, black 60%, transparent 100%), linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                      maskComposite: "intersect",
                      WebkitMaskComposite: "source-in",
                    }}
                  />
                </div>
              </div>
              <div className="px-6 pb-6 pt-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/25">
                    {isHero ? "Primary" : "Feature"}
                  </span>
                </div>
                <h3 className={`font-semibold mb-2 ${isHero ? "text-xl md:text-2xl" : "text-base"}`}>
                  {feature.title}
                </h3>
                <p className="text-sm text-white/[0.45] leading-relaxed max-w-md">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-16 md:mt-24 flex flex-col items-center gap-3">
        <div className="w-px h-12 bg-gradient-to-b from-white/[0.06] to-transparent" />
        <div className="w-1 h-1 rounded-full bg-white/10" />
      </div>
    </section>
  );
}
