import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function KPI({
  label,
  value,
  trend,
  accent,
  className,
}: {
  label: string;
  value: ReactNode;
  trend?: ReactNode;
  accent?: string;
  className?: string;
}) {
  return (
    <div className={cn("liquid-glass rounded-2xl p-5", className)}>
      <div className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--muted-foreground)]">
        {label}
      </div>
      <div
        className="mt-2 font-serif text-4xl leading-none tracking-tight"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
      {trend && <div className="mt-2 text-xs text-[color:var(--muted-foreground)]">{trend}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 opacity-40">{icon}</div>}
      <h3 className="font-serif text-2xl mb-2">{title}</h3>
      {description && (
        <p className="max-w-md text-sm text-[color:var(--muted-foreground)]">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/5", className)}
      aria-hidden="true"
    />
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px bg-white/[0.06] w-full", className)} />;
}
