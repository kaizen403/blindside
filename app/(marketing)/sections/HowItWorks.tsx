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
      "Share your website, app, API, or target asset. We define the scope, rules of engagement, and success criteria together.",
  },
  {
    number: 2,
    title: "We identify security gaps",
    description:
      "Our team maps the attack surface, runs targeted scans, and validates findings with safe proof-of-concept exploits.",
  },
  {
    number: 3,
    title: "Receive your report",
    description:
      "Get a clear vulnerability report with severity levels, remediation steps, and a prioritized fix list you can act on immediately.",
  },
  {
    number: 4,
    title: "Fix and verify",
    description:
      "Follow the prioritized remediation plan, apply fixes at your own pace, and we re-test to confirm vulnerabilities are resolved.",
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
      className="relative flex gap-6 md:gap-8 cursor-default"
    >
      <div className="flex flex-col items-center">
        <motion.div
          style={{ scale: nodeScale, opacity: nodeOpacity }}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 liquid-glass"
        >
          <motion.span
            className="text-sm font-semibold tabular-nums"
            animate={stepInView ? { color: "#fafafa" } : { color: "rgba(250,250,250,0.4)" }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {step.number}
          </motion.span>
        </motion.div>
        {index < steps.length - 1 && (
          <div className="w-px flex-1 my-2 relative">
            <div className="absolute inset-0 bg-white/[0.06]" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-emerald-500/40 to-emerald-500/10 origin-top"
              initial={{ scaleY: 0 }}
              animate={stepInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.15 + 0.3,
                ease,
              }}
            />
          </div>
        )}
      </div>

      <div className={index < steps.length - 1 ? "pb-14 md:pb-16" : "pb-0"}>
        <motion.h3
          className="text-base font-semibold leading-tight mb-2"
          animate={stepInView ? { opacity: 1, x: 0 } : { opacity: 0.4, x: 4 }}
          transition={{ duration: 0.4, ease }}
        >
          {step.title}
        </motion.h3>
        <motion.p
          className="text-sm text-muted-foreground leading-relaxed max-w-sm"
          animate={stepInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease }}
        >
          {step.description}
        </motion.p>
      </div>
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

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const headingParallax = useTransform(scrollYProgress, [0, 0.3], [20, 0]);
  const stepsParallax = useTransform(scrollYProgress, [0, 1], [30, -15]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="px-8 md:px-28 py-24 md:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
        style={{ y: headingParallax }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-medium tracking-[-1.5px] mb-4">
          How Blind Side{" "}
          <span className="font-serif italic font-normal">works</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Four simple steps from submission to verified protection.
        </p>
      </motion.div>

      <motion.div style={{ y: stepsParallax }} className="max-w-lg mx-auto relative">
        <motion.div
          className="absolute left-[19px] md:left-[19px] top-0 w-px bg-emerald-500/20"
          style={{ height: lineHeight }}
        />

        <div className="relative flex flex-col">
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
      </motion.div>
    </section>
  );
}
