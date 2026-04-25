import { requireClient } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/app/dashboard/components/ui/KPI";
import Link from "next/link";

export default async function NotificationsPage() {
  const user = await requireClient();
  const notifs = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="font-serif text-3xl">Notifications</h2>
        <p className="text-sm text-[color:var(--muted-foreground)] mt-1">{notifs.length} total</p>
      </div>
      {notifs.length === 0 ? (
        <EmptyState title="You're caught up" description="New activity will show here." />
      ) : (
        <ul className="space-y-2">
          {notifs.map((n) => (
            <li key={n.id}>
              <Link
                href={n.href ?? "#"}
                className={`block liquid-glass rounded-xl p-4 hover:bg-white/[0.04] transition-colors ${n.readAt ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{n.title}</div>
                    {n.body && <div className="text-xs text-[color:var(--muted-foreground)] mt-1">{n.body}</div>}
                  </div>
                  <div className="text-[11px] text-[color:var(--muted-foreground)] shrink-0">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
