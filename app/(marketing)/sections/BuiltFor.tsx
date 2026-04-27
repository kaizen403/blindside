"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const bgImages: Record<string, string> = {
  startup: "/images/startups.png",
  saas: "/images/saasproducts.png",
  business: "/images/smallbusinesses.png",
  founder: "/images/founder.png",
  agency: "/images/agencies.png",
  team: "/images/growingteams.png",
};

const audiences = [
  {
    label: "Startups",
    desc: "Move fast without leaving security gaps.",
    variant: "startup" as const,
  },
  {
    label: "SaaS Products",
    desc: "Protect your platform and your customers' trust.",
    variant: "saas" as const,
  },
  {
    label: "Small Businesses",
    desc: "Enterprise-grade protection at a fraction of the cost.",
    variant: "business" as const,
  },
  {
    label: "Founders & Indie",
    desc: "Ship confidently knowing your stack is covered.",
    variant: "founder" as const,
  },
  {
    label: "Agencies",
    desc: "Secure every client project without the overhead.",
    variant: "agency" as const,
  },
  {
    label: "Growing Teams",
    desc: "Scale securely as your team and codebase expand.",
    variant: "team" as const,
  },
];

export default function BuiltFor() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingParallax = useTransform(scrollYProgress, [0, 1], [0, -25]);
  const gridParallax = useTransform(scrollYProgress, [0, 1], [40, -15]);

  return (
    <section
      id="built-for"
      ref={sectionRef}
      className="px-6 md:px-28 py-20 md:py-32 relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ y: headingParallax }}
        className="mb-20 md:mb-24 relative z-10 text-center"
      >
        <div className="flex items-center gap-3 mb-5 justify-center">
          <span className="h-2 w-2 rounded-full bg-[#dc2626]" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#dc2626]">
            Audience
          </span>
        </div>
        <h2 className="text-5xl md:text-7xl font-medium tracking-[-0.03em] leading-[0.95] mb-6">
          Who Blindwall is{" "}
          <span className="font-serif italic font-normal">for</span>
        </h2>
        <p className="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed mx-auto">
          Designed for teams that want practical, affordable security without
          unnecessary complexity.
        </p>
      </motion.div>

      <motion.div
        style={{ y: gridParallax }}
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto"
      >
        {audiences.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              y: -6,
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
            }}
            className="group cursor-default"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-[#dc2626]/30 transition-colors duration-500">
              <Image
                src={bgImages[item.variant]}
                alt=""
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[1]" />
              <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
                <span className="block text-xl md:text-2xl font-serif italic tracking-tight leading-snug text-white mb-1">
                  {item.label}
                </span>
                <span className="block text-sm text-white/70 leading-relaxed">
                  {item.desc}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
