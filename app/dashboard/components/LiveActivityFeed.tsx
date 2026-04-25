"use client";

import { useActivityStream } from "@/lib/use-activity-stream";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";

export function LiveActivityFeed({ engagementId }: { engagementId: string }) {
  const { events, connected } = useActivityStream(engagementId);
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            connected ? "bg-white/60 animate-pulse" : "bg-white/20"
          }`}
        />
        <span className="text-[11px] uppercase tracking-wider text-[color:var(--muted-foreground)]">
          {connected ? "Live" : "Reconnecting…"}
        </span>
      </div>
      {events.length === 0 ? (
        <div className="flex items-center gap-3 text-sm text-[color:var(--muted-foreground)] py-6">
          <Activity size={16} className="opacity-40" />
          Waiting for new activity…
        </div>
      ) : (
        <ol className="space-y-3">
          <AnimatePresence initial={false}>
            {events.map((e) => {
              const p = (e.payload ?? {}) as Record<string, string>;
              return (
                <motion.li
                  key={e.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-sm border-l-2 border-[color:var(--accent)]/40 pl-3"
                >
                  <div>
                    {e.type.replaceAll("_", " ").toLowerCase()}
                    {p.title && (
                      <span className="text-[color:var(--foreground)]"> — {p.title}</span>
                    )}
                  </div>
                  <div className="text-[11px] text-[color:var(--muted-foreground)] mt-0.5">
                    {new Date(e.createdAt).toLocaleTimeString()}
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      )}
    </div>
  );
}
