import type { Severity, Stage, StageState, FindingStatus } from "@prisma/client";

export const severityColor: Record<Severity, string> = {
  CRITICAL: "var(--sev-critical)",
  HIGH: "var(--sev-high)",
  MEDIUM: "var(--sev-medium)",
  LOW: "var(--sev-low)",
  INFO: "var(--sev-info)",
};

export const severityLabel: Record<Severity, string> = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
  INFO: "Info",
};

export const severityRank: Record<Severity, number> = {
  CRITICAL: 5,
  HIGH: 4,
  MEDIUM: 3,
  LOW: 2,
  INFO: 1,
};

export const stageLabel: Record<Stage, string> = {
  SCOPING: "Scoping",
  RECON: "Recon",
  SCANNING: "Scanning",
  EXPLOITATION: "Exploitation",
  REPORTING: "Reporting",
  REMEDIATION: "Remediation",
};

export const stageOrder: Stage[] = [
  "SCOPING",
  "RECON",
  "SCANNING",
  "EXPLOITATION",
  "REPORTING",
  "REMEDIATION",
];

export const stageDescription: Record<Stage, string> = {
  SCOPING: "Defining targets, rules of engagement, success criteria",
  RECON: "Mapping the attack surface",
  SCANNING: "Automated and manual vulnerability discovery",
  EXPLOITATION: "Validating findings with safe proof-of-concept",
  REPORTING: "Compiling findings, severities, and remediation",
  REMEDIATION: "Tracking fixes and re-testing",
};

export const stageStateLabel: Record<StageState, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  SKIPPED: "Skipped",
};

export const findingStatusLabel: Record<FindingStatus, string> = {
  OPEN: "Open",
  ACKNOWLEDGED: "Acknowledged",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  RISK_ACCEPTED: "Risk accepted",
  FALSE_POSITIVE: "False positive",
};

export const findingStatusColor: Record<FindingStatus, string> = {
  OPEN: "var(--accent)",
  ACKNOWLEDGED: "#d4d4d8",
  IN_PROGRESS: "#a1a1aa",
  RESOLVED: "#71717a",
  RISK_ACCEPTED: "#52525b",
  FALSE_POSITIVE: "var(--muted-foreground)",
};

export function riskScore(findings: { severity: Severity; status: FindingStatus }[]) {
  const weights = { CRITICAL: 25, HIGH: 10, MEDIUM: 4, LOW: 1, INFO: 0 };
  const active = findings.filter((f) => f.status !== "RESOLVED" && f.status !== "FALSE_POSITIVE");
  const raw = active.reduce((sum, f) => sum + weights[f.severity], 0);
  return Math.max(0, Math.min(100, 100 - raw));
}
