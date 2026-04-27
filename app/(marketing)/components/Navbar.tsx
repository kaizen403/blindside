"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        }}
        className="flex items-center justify-between px-6 md:px-28 py-4 transition-[background,border-color,backdrop-filter] duration-500"
        style={{
          background: scrolled ? "rgba(255, 255, 255, 0.04)" : "transparent",
          borderBottom: scrolled
            ? "1px solid rgba(255, 255, 255, 0.06)"
            : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="flex items-center gap-12 md:gap-20">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">Blindwall</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="hidden sm:block bg-[var(--accent)] text-white rounded-lg text-sm font-semibold px-4 py-2 hover:brightness-110 transition cursor-pointer"
          >
            Get Protected
          </motion.button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] cursor-pointer"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block w-5 h-[1.5px] bg-white rounded-full"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              className="block w-5 h-[1.5px] bg-white rounded-full"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block w-5 h-[1.5px] bg-white rounded-full"
            />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 bottom-0 w-[280px] bg-[#0a0a0c] border-l border-white/[0.06] p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-lg font-bold tracking-tight">Blindwall</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white cursor-pointer"
                  aria-label="Close menu"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="text-lg font-medium text-white/70 hover:text-white py-3 border-b border-white/[0.04] transition-colors"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              <div className="mt-auto pt-8">
                <a
                  href="#pricing"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center bg-[var(--accent)] text-white rounded-lg text-sm font-semibold px-4 py-3 hover:brightness-110 transition"
                >
                  Get Protected
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
