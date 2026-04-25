import { requireUser } from "@/lib/auth-helpers";
import { DashboardShell } from "@/app/dashboard/components/DashboardShell";
import { Home, ListTodo, Network, Clock, Bell, FileText, Settings } from "lucide-react";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

const iconSize = 16;

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  if (user.role !== "CLIENT") redirect("/admin");

  const nav = [
    { href: "/app", label: "Overview", icon: <Home size={iconSize} /> },
    { href: "/app/findings", label: "Findings", icon: <ListTodo size={iconSize} /> },
    { href: "/app/assets", label: "Assets", icon: <Network size={iconSize} /> },
    { href: "/app/timeline", label: "Timeline", icon: <Clock size={iconSize} /> },
    { href: "/app/notifications", label: "Notifications", icon: <Bell size={iconSize} /> },
    { href: "/app/reports", label: "Reports", icon: <FileText size={iconSize} /> },
    { href: "/app/settings", label: "Settings", icon: <Settings size={iconSize} /> },
  ];

  return (
    <DashboardShell nav={nav} user={{ name: user.name, email: user.email, role: user.role }}>
      {children}
    </DashboardShell>
  );
}
