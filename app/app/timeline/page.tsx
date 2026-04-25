import { requireClient } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { TimelineVertical } from "@/app/dashboard/components/Timeline";
import { EmptyState } from "@/app/dashboard/components/ui/KPI";

export default async function TimelinePage() {
  const user = await requireClient();
  if (!user.orgId) return <EmptyState title="No organization" />;
  const engagement = await prisma.engagement.findFirst({
    where: { orgId: user.orgId, status: "ACTIVE" },
    include: { stages: { orderBy: { createdAt: "asc" } } },
  });
  if (!engagement) return <EmptyState title="No active engagement" />;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-serif text-3xl">Timeline</h2>
        <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
          Full progression of {engagement.name}.
        </p>
      </div>
      <TimelineVertical stages={engagement.stages} />
    </div>
  );
}
