"use client";

import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Blind Side?",
    answer:
      "Blind Side helps businesses identify vulnerabilities in their website, app, or infrastructure so they can stay protected from modern AI-driven threats.",
  },
  {
    question: "What do I get for \u20b9999?",
    answer:
      "You get a security check and a report that highlights vulnerabilities, risk levels, and next steps.",
  },
  {
    question: "Who is this for?",
    answer:
      "Blind Side is built for startups, small businesses, SaaS teams, agencies, and anyone who wants a simple security check.",
  },
  {
    question: "What can be checked?",
    answer:
      "Websites, applications, APIs, admin panels, and selected infrastructure assets.",
  },
  {
    question: "Will I get a report?",
    answer:
      "Yes. You will receive a clear report showing the findings and what needs attention.",
  },
  {
    question: "Is this suitable for small businesses?",
    answer:
      "Yes. Blind Side is designed to make security more accessible and affordable.",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingParallax = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const itemsParallax = useTransform(scrollYProgress, [0, 1], [30, -10]);

  return (
    <section id="faq" ref={sectionRef} className="px-8 md:px-28 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ y: headingParallax }}
        className="text-center mb-14"
      >
        <h2 className="text-4xl md:text-5xl font-medium tracking-[-1.5px] mb-4">
          Frequently asked{" "}
          <span className="font-serif italic font-normal">questions</span>
        </h2>
      </motion.div>

      <motion.div style={{ y: itemsParallax }} className="flex flex-col gap-3 max-w-2xl mx-auto">
        {faqs.map((faq, i) => (
          <motion.div
            key={faq.question}
            custom={i}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={itemVariants}
            className="liquid-glass rounded-xl"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex items-center justify-between w-full text-left p-5"
              aria-expanded={openIndex === i}
            >
              <span className="text-base font-medium">{faq.question}</span>
              <ChevronDown
                size={18}
                className="text-muted-foreground transition-transform duration-300 shrink-0 ml-4"
                style={{
                  transform:
                    openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1] as [
                      number,
                      number,
                      number,
                      number,
                    ],
                  }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
