import { requireClient } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { SeverityBadge, StatusBadge } from "@/app/dashboard/components/ui/Badge";
import { EmptyState } from "@/app/dashboard/components/ui/KPI";
import Link from "next/link";
import { severityRank } from "@/lib/severity";

export default async function FindingsPage() {
  const user = await requireClient();
  if (!user.orgId) return <EmptyState title="No organization" />;

  const findings = await prisma.finding.findMany({
    where: { engagement: { orgId: user.orgId } },
    include: { asset: true, engagement: true },
  });
  findings.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-serif text-3xl">Findings</h2>
          <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
            {findings.length} total across your engagements
          </p>
        </div>
      </div>
      {findings.length === 0 ? (
        <EmptyState title="No findings" description="Findings published by your analyst will appear here." />
      ) : (
        <div className="liquid-glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-[color:var(--muted-foreground)] border-b border-white/[0.06]">
                <th className="text-left py-3 px-4 font-medium">Severity</th>
                <th className="text-left py-3 px-4 font-medium">Title</th>
                <th className="text-left py-3 px-4 font-medium">Category</th>
                <th className="text-left py-3 px-4 font-medium">Asset</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Discovered</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((f) => (
                <tr key={f.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4"><SeverityBadge severity={f.severity} /></td>
                  <td className="py-3 px-4">
                    <Link href={`/app/findings/${f.id}`} className="font-medium hover:text-[color:var(--accent)]">
                      {f.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-[color:var(--muted-foreground)]">{f.category}</td>
                  <td className="py-3 px-4 text-[color:var(--muted-foreground)]">{f.asset?.name ?? "—"}</td>
                  <td className="py-3 px-4"><StatusBadge status={f.status} /></td>
                  <td className="py-3 px-4 text-[color:var(--muted-foreground)]">
                    {new Date(f.discoveredAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
