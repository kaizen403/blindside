import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/app/dashboard/components/DashboardShell";
import { CommandPalette, type CommandItem } from "@/app/dashboard/components/CommandPalette";
import { Home, Building2, Briefcase, BookOpen, Users, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

const iconSize = 16;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();
  const nav = [
    { href: "/admin", label: "Overview", icon: <Home size={iconSize} /> },
    { href: "/admin/clients", label: "Clients", icon: <Building2 size={iconSize} /> },
    { href: "/admin/engagements", label: "Engagements", icon: <Briefcase size={iconSize} /> },
    { href: "/admin/library", label: "Library", icon: <BookOpen size={iconSize} /> },
    { href: "/admin/users", label: "Users", icon: <Users size={iconSize} /> },
    { href: "/admin/audit", label: "Audit", icon: <ShieldAlert size={iconSize} /> },
  ];

  const [orgs, engagements] = await Promise.all([
    prisma.org.findMany({ select: { id: true, name: true, slug: true } }),
    prisma.engagement.findMany({ select: { id: true, name: true, org: { select: { name: true } } } }),
  ]);

  const commandItems: CommandItem[] = [
    ...nav.map((n) => ({ id: `nav-${n.href}`, label: n.label, href: n.href, group: "Navigate" })),
    ...orgs.map((o) => ({ id: `org-${o.id}`, label: o.name, hint: o.slug, href: `/admin/clients/${o.id}`, group: "Clients" })),
    ...engagements.map((e) => ({
      id: `eng-${e.id}`,
      label: e.name,
      hint: e.org.name,
      href: `/admin/engagements/${e.id}`,
      group: "Engagements",
    })),
  ];

  return (
    <DashboardShell nav={nav} user={{ name: user.name, email: user.email, role: user.role }}>
      {children}
      <CommandPalette items={commandItems} />
    </DashboardShell>
  );
}
