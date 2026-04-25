"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await signOut();
        router.push("/login");
        router.refresh();
      }}
      className="mt-2 w-full text-left px-3 py-2 rounded-lg text-xs text-[color:var(--muted-foreground)] hover:text-white hover:bg-white/5 transition-colors"
    >
      Sign out
    </button>
  );
}
