import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

const fieldBase =
  "w-full rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 py-2 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20 transition-colors";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cn(fieldBase, className)} {...rest} />;
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...rest }, ref) {
    return <textarea ref={ref} className={cn(fieldBase, "min-h-[96px] resize-y", className)} {...rest} />;
  }
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <select ref={ref} className={cn(fieldBase, "appearance-none pr-8", className)} {...rest}>
        {children}
      </select>
    );
  }
);

export function Label({ children, htmlFor, required }: { children: ReactNode; htmlFor?: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium text-[color:var(--muted-foreground)] mb-1.5">
      {children}
      {required && <span className="text-[color:var(--accent)] ml-0.5">*</span>}
    </label>
  );
}

export function Field({ label, htmlFor, error, required, children }: { label: string; htmlFor?: string; error?: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <Label htmlFor={htmlFor} required={required}>{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
