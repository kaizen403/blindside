import type { Stage } from "@prisma/client";
import { Check } from "lucide-react";
import { stageLabel, stageOrder } from "@/lib/severity";
import { cn } from "@/lib/cn";

export type StageSnapshot = {
  stage: Stage;
  state: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";
  startedAt?: Date | null;
  completedAt?: Date | null;
  note?: string | null;
};

export function TimelineStrip({ stages }: { stages: StageSnapshot[] }) {
  const byStage = new Map(stages.map((s) => [s.stage, s]));
  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl">Engagement timeline</h3>
        <span className="text-xs text-[color:var(--muted-foreground)]">
          {stages.filter((s) => s.state === "COMPLETED").length} of {stageOrder.length} complete
        </span>
      </div>
      <div className="relative flex items-start justify-between gap-2 overflow-x-auto">
        <div className="absolute top-3 left-5 right-5 h-px bg-white/[0.08]" aria-hidden />
        {stageOrder.map((stage, i) => {
          const snap = byStage.get(stage);
          const state = snap?.state ?? "PENDING";
          const color =
            state === "COMPLETED"
              ? "rgba(255,255,255,0.6)"
              : state === "IN_PROGRESS"
                ? "var(--accent)"
                : "rgba(255,255,255,0.12)";
          return (
            <div key={stage} className="relative flex flex-col items-center min-w-[90px] flex-1 z-10">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border-2 bg-[color:var(--background)]",
                  state === "IN_PROGRESS" && "animate-pulse",
                )}
                style={{ borderColor: color }}
              >
                {state === "COMPLETED" ? (
                  <Check size={12} style={{ color }} strokeWidth={3} />
                ) : state === "IN_PROGRESS" ? (
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                ) : (
                  <span className="text-[10px] font-mono text-white/30">{i + 1}</span>
                )}
              </div>
              <div className="mt-3 text-[11px] font-medium text-center" style={{ color: state === "PENDING" ? "var(--muted-foreground)" : "var(--foreground)" }}>
                {stageLabel[stage]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TimelineVertical({ stages }: { stages: StageSnapshot[] }) {
  const byStage = new Map(stages.map((s) => [s.stage, s]));
  return (
    <ol className="space-y-4">
      {stageOrder.map((stage, i) => {
        const snap = byStage.get(stage);
        const state = snap?.state ?? "PENDING";
        const color =
          state === "COMPLETED"
            ? "rgba(255,255,255,0.6)"
            : state === "IN_PROGRESS"
              ? "var(--accent)"
              : "rgba(255,255,255,0.15)";
        return (
          <li key={stage} className="flex gap-4">
            <div className="flex flex-col items-center shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-[color:var(--background)]"
                style={{ borderColor: color }}
              >
                {state === "COMPLETED" ? (
                  <Check size={14} style={{ color }} strokeWidth={3} />
                ) : (
                  <span className="text-xs font-mono" style={{ color }}>{i + 1}</span>
                )}
              </div>
              {i < stageOrder.length - 1 && (
                <div className="w-px flex-1 bg-white/[0.08] my-2 min-h-[40px]" />
              )}
            </div>
            <div className="flex-1 pb-6">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h4 className="font-serif text-lg">{stageLabel[stage]}</h4>
                <span className="text-xs" style={{ color }}>
                  {state === "IN_PROGRESS" ? "In progress" : state === "COMPLETED" ? "Completed" : state === "SKIPPED" ? "Skipped" : "Pending"}
                </span>
              </div>
              {snap?.startedAt && (
                <div className="text-xs text-[color:var(--muted-foreground)] mt-1">
                  Started {new Date(snap.startedAt).toLocaleDateString()}
                  {snap.completedAt && ` · Completed ${new Date(snap.completedAt).toLocaleDateString()}`}
                </div>
              )}
              {snap?.note && (
                <p className="mt-3 text-sm text-[color:var(--foreground)]/80 leading-relaxed">{snap.note}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
