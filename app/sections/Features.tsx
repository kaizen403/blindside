"use client";

import { motion } from "framer-motion";
import { Search, Eye, FileText, ArrowRight, Shield } from "lucide-react";
import { useRef } from "react";
import { useInView } from "framer-motion";

const features = [
  {
    icon: Search,
    title: "Vulnerability Detection",
    description:
      "Find hidden security weaknesses in your application and digital assets.",
  },
  {
    icon: Eye,
    title: "Clear Risk Visibility",
    description:
      "Understand which issues matter most and where your biggest risks are.",
  },
  {
    icon: FileText,
    title: "Simple Reporting",
    description:
      "Get an easy-to-understand report with findings and priority levels.",
  },
  {
    icon: ArrowRight,
    title: "Actionable Next Steps",
    description:
      "Know what should be fixed first to improve your security posture.",
  },
  {
    icon: Shield,
    title: "Affordable Protection",
    description: "Start securing your application for just \u20B9999.",
  },
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

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="px-8 md:px-28 py-24 md:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14"
      >
        <h2 className="text-4xl md:text-5xl font-medium tracking-[-1.5px] mb-4">
          What you get with{" "}
          <span className="font-serif italic font-normal">Blind Side</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl">
          Simple security checks that give you clear visibility and actionable
          next steps.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="liquid-glass rounded-2xl p-6 cursor-default transition-shadow hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
            >
              <div className="mb-4 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5">
                <Icon size={20} className="text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
