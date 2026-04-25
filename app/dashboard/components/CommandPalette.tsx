"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

export type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  href: string;
  group: string;
};

export function CommandPalette({ items }: { items: CommandItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setActive(0);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const filtered = query
    ? items.filter((i) =>
        (i.label + " " + (i.hint ?? "") + " " + i.group).toLowerCase().includes(query.toLowerCase()),
      )
    : items;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, i) => {
    (acc[i.group] = acc[i.group] ?? []).push(i);
    return acc;
  }, {});

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[active]) go(filtered[active].href);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] p-6"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-3d rounded-2xl w-full max-w-xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
              <Search size={16} className="text-[color:var(--muted-foreground)]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Jump to anything…"
                className="flex-1 bg-transparent border-0 outline-none text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)]"
              />
              <kbd className="text-[10px] font-mono text-[color:var(--muted-foreground)] px-1.5 py-0.5 rounded bg-white/5">esc</kbd>
            </div>
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-[color:var(--muted-foreground)]">
                  No matches
                </div>
              ) : (
                Object.entries(grouped).map(([group, gItems]) => (
                  <div key={group} className="py-2">
                    <div className="px-5 py-1 text-[10px] uppercase tracking-wider text-[color:var(--muted-foreground)]">
                      {group}
                    </div>
                    {gItems.map((item) => {
                      const idx = filtered.indexOf(item);
                      const isActive = idx === active;
                      return (
                        <button
                          key={item.id}
                          onClick={() => go(item.href)}
                          onMouseEnter={() => setActive(idx)}
                          className={`w-full text-left px-5 py-2.5 flex items-center justify-between transition-colors ${
                            isActive ? "bg-white/[0.06]" : ""
                          }`}
                        >
                          <div>
                            <div className="text-sm">{item.label}</div>
                            {item.hint && <div className="text-xs text-[color:var(--muted-foreground)] mt-0.5">{item.hint}</div>}
                          </div>
                          {isActive && <span className="text-[10px] font-mono text-[color:var(--muted-foreground)]">↵</span>}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CommandPaletteHint() {
  return (
    <div className="hidden md:flex items-center gap-1.5 px-2.5 h-8 rounded-md liquid-glass text-[11px] text-[color:var(--muted-foreground)] cursor-pointer hover:text-white"
      onClick={() => {
        const evt = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
        document.dispatchEvent(evt);
      }}
    >
      <kbd className="font-mono">⌘K</kbd>
      <span>Search</span>
    </div>
  );
}
