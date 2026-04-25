import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderReportPdf } from "@/lib/pdf";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return new Response("unauthorized", { status: 401 });

  const engagement = await prisma.engagement.findUnique({
    where: { id },
    include: {
      org: true,
      findings: { include: { asset: true }, orderBy: [{ severity: "asc" }, { discoveredAt: "desc" }] },
    },
  });
  if (!engagement) return new Response("not found", { status: 404 });

  if (
    session.user.role === "CLIENT" &&
    engagement.orgId !== session.user.orgId
  ) {
    return new Response("forbidden", { status: 403 });
  }

  const summary = {
    criticalCount: engagement.findings.filter((f) => f.severity === "CRITICAL").length,
    highCount: engagement.findings.filter((f) => f.severity === "HIGH").length,
    mediumCount: engagement.findings.filter((f) => f.severity === "MEDIUM").length,
    lowCount: engagement.findings.filter((f) => f.severity === "LOW").length,
    infoCount: engagement.findings.filter((f) => f.severity === "INFO").length,
  };

  const buffer = await renderReportPdf({
    engagementName: engagement.name,
    orgName: engagement.org.name,
    generatedAt: new Date(),
    summary,
    findings: engagement.findings.map((f) => ({
      title: f.title,
      severity: f.severity,
      category: f.category,
      cweId: f.cweId,
      cvssScore: f.cvssScore,
      asset: f.asset?.name ?? null,
      status: f.status,
      bodyMarkdown: f.bodyMarkdown,
      remediation: f.remediation,
    })),
  });

  const filename = `${engagement.org.slug}-${engagement.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
