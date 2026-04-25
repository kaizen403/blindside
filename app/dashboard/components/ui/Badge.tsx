import type { Severity, FindingStatus, StageState } from "@prisma/client";
import { severityColor, severityLabel, findingStatusColor, findingStatusLabel, stageStateLabel } from "@/lib/severity";
import { cn } from "@/lib/cn";

export function SeverityDot({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <span
      aria-label={`${severityLabel[severity]} severity`}
      className={cn("inline-block rounded-full w-2.5 h-2.5 shrink-0", className)}
      style={{ background: severityColor[severity], boxShadow: `0 0 10px ${severityColor[severity]}40` }}
    />
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider"
      style={{
        color: severityColor[severity],
        background: `${severityColor[severity]}15`,
        border: `1px solid ${severityColor[severity]}30`,
      }}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: severityColor[severity] }} />
      {severityLabel[severity]}
    </span>
  );
}

export function StatusBadge({ status }: { status: FindingStatus }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium"
      style={{
        color: findingStatusColor[status],
        background: `${findingStatusColor[status]}15`,
        border: `1px solid ${findingStatusColor[status]}25`,
      }}
    >
      {findingStatusLabel[status]}
    </span>
  );
}

export function StageBadge({ state }: { state: StageState }) {
  const colors: Record<StageState, string> = {
    PENDING: "var(--muted-foreground)",
    IN_PROGRESS: "var(--accent)",
    COMPLETED: "var(--status-success)",
    SKIPPED: "var(--muted-foreground)",
  };
  const c = colors[state];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium"
      style={{ color: c, background: `${c}15`, border: `1px solid ${c}25` }}
    >
      {state === "IN_PROGRESS" && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: c }}
        />
      )}
      {stageStateLabel[state]}
    </span>
  );
}
