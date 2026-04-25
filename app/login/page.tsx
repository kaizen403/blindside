"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/app/dashboard/components/ui/Button";
import { Input, Field } from "@/app/dashboard/components/ui/Input";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn.email({ email, password });
    setLoading(false);
    if (result.error) {
      setError(result.error.message || "Sign in failed");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-3d rounded-2xl p-8 w-full max-w-md"
    >
      <h1 className="font-serif text-3xl mb-2">Welcome back</h1>
      <p className="text-sm text-[color:var(--muted-foreground)] mb-8">
        Sign in to access your dashboard.
      </p>

      <div className="space-y-4">
        <Field label="Email" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="Password" htmlFor="password" required>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </div>

      <div className="mt-8 pt-6 border-t border-white/[0.06] text-xs text-[color:var(--muted-foreground)] space-y-1">
        <div>Seed credentials:</div>
        <div className="font-mono">admin@blindside.local / Admin@123456</div>
        <div className="font-mono">ceo@acme.local / Client@123456</div>
      </div>
    </motion.form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 built-for-orb" aria-hidden />
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="font-serif text-lg tracking-tight">Blind Side</Link>
      </div>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
