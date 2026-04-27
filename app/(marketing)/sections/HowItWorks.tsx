"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Submit your application",
    description:
      "Share your target asset. We define scope and rules together.",
  },
  {
    number: 2,
    title: "We identify security gaps",
    description:
      "We map the attack surface, scan, and validate findings.",
  },
  {
    number: 3,
    title: "Receive your report",
    description:
      "Get a clear report with severity levels and a prioritized fix list.",
  },
  {
    number: 4,
    title: "Fix and verify",
    description:
      "Apply fixes at your pace. We re-test to confirm resolution.",
  },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function StepCard({
  step,
  index,
  isInView,
  progress,
}: {
  step: (typeof steps)[number];
  index: number;
  isInView: boolean;
  progress: MotionValue<number>;
}) {
  const stepRef = useRef<HTMLDivElement>(null);
  const stepInView = useInView(stepRef, { once: true, margin: "-40px" });

  const threshold = index / steps.length;
  const nodeScale = useTransform(progress, [threshold, threshold + 0.05], [1, 1.15]);
  const nodeOpacity = useTransform(progress, [threshold, threshold + 0.05], [0.5, 1]);

  return (
    <motion.div
      ref={stepRef}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease,
      }}
      className="relative flex flex-col items-center text-center cursor-default"
    >
      <motion.div
        style={{ scale: nodeScale, opacity: nodeOpacity }}
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 liquid-glass bg-[#09090b] mb-5"
      >
        <motion.span
          className="text-sm font-semibold tabular-nums"
          animate={stepInView ? { color: "#fafafa" } : { color: "rgba(250,250,250,0.4)" }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {step.number}
        </motion.span>
      </motion.div>

      <motion.h3
        className="text-base font-semibold leading-tight mb-2"
        animate={stepInView ? { opacity: 1 } : { opacity: 0.4 }}
        transition={{ duration: 0.4, ease }}
      >
        {step.title}
      </motion.h3>
      <motion.p
        className="text-sm text-muted-foreground leading-relaxed max-w-[240px]"
        animate={stepInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease }}
      >
        {step.description}
      </motion.p>
    </motion.div>
  );
}

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end 0.5"],
  });

  const lineWidth = useTransform(scrollYProgress, [0, 0.6], ["0%", "100%"]);
  const headingParallax = useTransform(scrollYProgress, [0, 0.3], [20, 0]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="px-6 md:px-28 py-20 md:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
        style={{ y: headingParallax }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-medium tracking-[-1.5px] mb-4">
          How Blindwall{" "}
          <span className="font-serif italic font-normal">works</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Four simple steps from submission to verified protection.
        </p>
      </motion.div>

      <div className="relative max-w-5xl mx-auto">
        <div className="hidden md:block absolute top-[20px] left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-px z-0">
          <div className="absolute inset-0 bg-white/[0.06]" />
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500/40 to-emerald-500/10"
            style={{ width: lineWidth }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
          {steps.map((step, i) => (
            <StepCard
              key={step.number}
              step={step}
              index={i}
              isInView={isInView}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
