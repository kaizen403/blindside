"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus } from "lucide-react";
import { Button } from "@/app/dashboard/components/ui/Button";
import { Input, Field } from "@/app/dashboard/components/ui/Input";
import { inviteClientUserAction } from "@/app/actions";

export function InviteUserButton({ orgId }: { orgId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await inviteClientUserAction(orgId, email, name);
      if (res.ok) {
        setSuccess(`Invite sent to ${email}.`);
        setEmail("");
        setName("");
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <UserPlus size={14} />
        Invite member
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setOpen(false)}
          >
            <motion.form
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={onSubmit}
              className="glass-3d rounded-2xl p-7 max-w-sm w-full"
            >
              <h3 className="font-serif text-2xl mb-2">Invite member</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] mb-6">
                They&apos;ll get a magic-link email to sign in.
              </p>
              <div className="space-y-3">
                <Field label="Full name" htmlFor="invite-name" required>
                  <Input id="invite-name" value={name} onChange={(e) => setName(e.target.value)} required />
                </Field>
                <Field label="Email" htmlFor="invite-email" required>
                  <Input
                    id="invite-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>
                {error && (
                  <div className="text-xs bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2 text-red-300">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-md px-3 py-2 text-emerald-300">
                    {success}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={pending}>
                  {pending ? "Sending…" : "Send invite"}
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
