import { cn } from "@/lib/cn";
import type { ReactNode, HTMLAttributes } from "react";

export function Card({
  children,
  className,
  glass3d = false,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode; glass3d?: boolean }) {
  return (
    <div
      className={cn(
        glass3d ? "glass-3d" : "liquid-glass",
        "rounded-2xl",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-6 pt-6 pb-3", className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-6 pb-6", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-base font-semibold tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-sm text-[color:var(--muted-foreground)] mt-1", className)}>
      {children}
    </p>
  );
}
