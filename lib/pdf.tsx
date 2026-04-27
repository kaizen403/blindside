import { Document, Page, Text, View, StyleSheet, renderToBuffer, Font } from "@react-pdf/renderer";
import type { Severity } from "@prisma/client";

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, lineHeight: 1.5, fontFamily: "Helvetica", color: "#0a0a0a", backgroundColor: "#ffffff" },
  cover: { padding: 64, justifyContent: "space-between", height: "100%" },
  brand: { fontSize: 14, letterSpacing: 2, textTransform: "uppercase", color: "#dc2626" },
  title: { fontSize: 32, marginTop: 16 },
  subtitle: { fontSize: 12, color: "#525252", marginTop: 8 },
  meta: { marginTop: 32, fontSize: 10, color: "#525252" },
  metaRow: { flexDirection: "row", marginBottom: 4 },
  metaLabel: { width: 100, color: "#a1a1aa", textTransform: "uppercase", fontSize: 8, letterSpacing: 1 },
  h1: { fontSize: 18, marginTop: 24, marginBottom: 12, color: "#0a0a0a" },
  h2: { fontSize: 14, marginTop: 20, marginBottom: 8, color: "#0a0a0a" },
  h3: { fontSize: 11, marginTop: 12, marginBottom: 4, color: "#0a0a0a" },
  p: { marginBottom: 8, color: "#262626" },
  finding: { marginBottom: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#e5e5e5" },
  findingTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, fontSize: 8, fontWeight: 700, marginRight: 8 },
  findingTitle: { fontSize: 14, flex: 1 },
  metaInline: { fontSize: 8, color: "#737373", marginBottom: 8 },
  remediation: { backgroundColor: "#fafafa", padding: 12, borderRadius: 4, marginTop: 8 },
  footer: { position: "absolute", bottom: 24, left: 48, right: 48, textAlign: "center", fontSize: 8, color: "#a3a3a3" },
});

const sevColors: Record<Severity, string> = {
  CRITICAL: "#dc2626",
  HIGH: "#f97316",
  MEDIUM: "#eab308",
  LOW: "#38bdf8",
  INFO: "#a3a3a3",
};

export type PdfFinding = {
  title: string;
  severity: Severity;
  category: string;
  cweId?: string | null;
  cvssScore?: number | null;
  asset?: string | null;
  status: string;
  bodyMarkdown: string;
  remediation: string;
};

export type PdfReportInput = {
  engagementName: string;
  orgName: string;
  generatedAt: Date;
  findings: PdfFinding[];
  summary: { criticalCount: number; highCount: number; mediumCount: number; lowCount: number; infoCount: number };
};

function ReportDoc(input: PdfReportInput) {
  return (
    <Document>
      <Page size="A4" style={styles.cover}>
        <View>
          <Text style={styles.brand}>BLINDWALL</Text>
          <Text style={styles.title}>{input.engagementName}</Text>
          <Text style={styles.subtitle}>Penetration testing report</Text>
        </View>
        <View style={styles.meta}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Client</Text>
            <Text>{input.orgName}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Generated</Text>
            <Text>{input.generatedAt.toLocaleDateString()}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Findings</Text>
            <Text>{input.findings.length}</Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Executive summary</Text>
        <Text style={styles.p}>
          This report covers {input.findings.length} findings discovered during the {input.engagementName.toLowerCase()} engagement.
        </Text>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
          {(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"] as Severity[]).map((s) => {
            const counts: Record<Severity, number> = {
              CRITICAL: input.summary.criticalCount,
              HIGH: input.summary.highCount,
              MEDIUM: input.summary.mediumCount,
              LOW: input.summary.lowCount,
              INFO: input.summary.infoCount,
            };
            return (
              <View key={s} style={{ flex: 1, padding: 8, borderRadius: 4, borderWidth: 1, borderColor: "#e5e5e5" }}>
                <Text style={{ fontSize: 8, color: sevColors[s], textTransform: "uppercase", letterSpacing: 1 }}>{s}</Text>
                <Text style={{ fontSize: 18, marginTop: 4 }}>{counts[s]}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.h1}>Findings</Text>
        {input.findings.map((f, i) => (
          <View key={i} style={styles.finding} wrap={false}>
            <View style={styles.findingTitleRow}>
              <Text style={[styles.badge, { backgroundColor: sevColors[f.severity], color: "#ffffff" }]}>
                {f.severity}
              </Text>
              <Text style={styles.findingTitle}>{f.title}</Text>
            </View>
            <Text style={styles.metaInline}>
              {f.category}
              {f.cweId ? ` · ${f.cweId}` : ""}
              {f.cvssScore ? ` · CVSS ${f.cvssScore}` : ""}
              {f.asset ? ` · ${f.asset}` : ""}
              {` · ${f.status}`}
            </Text>
            <Text style={styles.h3}>Details</Text>
            <Text style={styles.p}>{f.bodyMarkdown.slice(0, 800)}</Text>
            {f.remediation && (
              <View style={styles.remediation}>
                <Text style={[styles.h3, { marginTop: 0 }]}>Remediation</Text>
                <Text>{f.remediation}</Text>
              </View>
            )}
          </View>
        ))}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Blindwall · ${input.engagementName} · ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

export async function renderReportPdf(input: PdfReportInput): Promise<Buffer> {
  return await renderToBuffer(ReportDoc(input));
}
