import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/app/dashboard/components/ui/Card";
import { stageLabel } from "@/lib/severity";
import Link from "next/link";

export default async function EngagementsPage() {
  await requireAdmin();
  const engagements = await prisma.engagement.findMany({
    include: { org: true, findings: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-3xl">Engagements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {engagements.map((e) => (
          <Link key={e.id} href={`/admin/engagements/${e.id}`}>
            <Card className="h-full hover:bg-white/[0.02]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-[color:var(--muted-foreground)]">
                    {e.status}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-[color:var(--muted-foreground)]">
                    {stageLabel[e.currentStage]}
                  </span>
                </div>
                <CardTitle className="mt-2">{e.name}</CardTitle>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="text-xs text-[color:var(--muted-foreground)]">
                  {e.org.name} · {e.findings.length} findings
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
