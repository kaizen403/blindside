import Link from "next/link";
import { SignOutButton } from "./SignOutButton";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon?: ReactNode;
};

export function DashboardShell({
  nav,
  user,
  title,
  children,
}: {
  nav: NavItem[];
  user: { name: string; email: string; role?: string | null };
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      <aside className="fixed left-0 top-0 bottom-0 w-[240px] border-r border-[color:var(--border)] bg-[color:var(--background)] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[color:var(--border)]">
          <Link href="/" className="font-serif text-lg tracking-tight">Blind Side</Link>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[color:var(--muted-foreground)] hover:text-white hover:bg-white/5 transition-colors",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-[color:var(--border)]">
          <div className="px-3 py-2">
            <div className="text-xs font-medium truncate">{user.name}</div>
            <div className="text-[11px] text-[color:var(--muted-foreground)] truncate">{user.email}</div>
            <div className="mt-1 inline-block px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider bg-white/5 text-[color:var(--muted-foreground)]">
              {user.role ?? "USER"}
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>
      <div className="pl-[240px]">
        <header className="h-16 border-b border-[color:var(--border)] flex items-center justify-between px-8 sticky top-0 z-10 bg-[color:var(--background)]/80 backdrop-blur">
          <h1 className="font-serif text-2xl tracking-tight">{title}</h1>
        </header>
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
