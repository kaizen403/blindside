"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { yaml } from "@codemirror/lang-yaml";
import { EditorView } from "@codemirror/view";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/dashboard/components/ui/Button";
import { publishReportAction } from "@/app/actions";

const SAMPLE = `---
engagement: ENGAGEMENT_ID_HERE
report_version: 1
stage_update:
  stage: SCANNING
  state: COMPLETED
  note: "Scan phase wrapped. New findings queued."
findings:
  - title: "Example finding"
    slug: example-finding
    severity: HIGH
    cvss: "CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N"
    cvssScore: 8.7
    category: "A03:2021 — Injection"
    cwe: CWE-79
    asset: api.acme.com
    discovered: 2026-04-22
    refs:
      - https://owasp.org/Top10/A03_2021-Injection/
    remediation: "Parameterize queries and sanitize output."
---

## Example finding

Describe the vulnerability here. Markdown supported, including \`code\` and **bold**.

### Reproduction
1. Step one
2. Step two

### Impact
Session hijacking, account takeover.
`;

const editorTheme = EditorView.theme(
  {
    "&": { backgroundColor: "transparent", color: "#fafafa", fontSize: "12px" },
    ".cm-gutters": { backgroundColor: "transparent", color: "#525252", border: "none" },
    ".cm-activeLineGutter": { backgroundColor: "rgba(255,255,255,0.04)" },
    ".cm-activeLine": { backgroundColor: "rgba(255,255,255,0.02)" },
    ".cm-content": { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" },
    ".cm-cursor": { borderColor: "#dc2626" },
    "&.cm-focused": { outline: "none" },
  },
  { dark: true },
);

type PublishResult =
  | { ok: true; created: number; updated: number }
  | { ok: false; errors: { line?: number; message: string; path?: string }[] };

export function UploadEditor({ engagementId }: { engagementId: string }) {
  const router = useRouter();
  const [value, setValue] = useState(SAMPLE.replace("ENGAGEMENT_ID_HERE", engagementId));
  const [errors, setErrors] = useState<{ line?: number; message: string; path?: string }[]>([]);
  const [diff, setDiff] = useState<{ created: number; updated: number } | null>(null);
  const [pending, startTransition] = useTransition();

  function onPublish() {
    setErrors([]);
    setDiff(null);
    startTransition(async () => {
      const res: PublishResult = await publishReportAction(engagementId, value);
      if (res.ok) {
        setDiff({ created: res.created, updated: res.updated });
      } else {
        setErrors(res.errors);
      }
    });
  }

  function onConfirm() {
    setDiff(null);
    router.push(`/admin/engagements/${engagementId}`);
    router.refresh();
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-200px)]">
        <div className="flex flex-col">
          <div className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted-foreground)] mb-2">
            Markdown source
          </div>
          <div className="flex-1 overflow-hidden rounded-lg bg-[#0c0c0c] border border-white/[0.06] focus-within:border-[color:var(--accent)] transition-colors">
            <CodeMirror
              value={value}
              onChange={setValue}
              theme="dark"
              extensions={[markdown(), yaml(), editorTheme, EditorView.lineWrapping]}
              height="100%"
              basicSetup={{ lineNumbers: true, highlightActiveLine: true, foldGutter: true }}
              style={{ height: "100%" }}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted-foreground)] mb-2">
            Validation
          </div>
          <div className="flex-1 overflow-auto liquid-glass rounded-lg p-5 space-y-3">
            {errors.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  {errors.length} error{errors.length === 1 ? "" : "s"}
                </div>
                {errors.map((e, i) => (
                  <div key={i} className="text-xs bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
                    {e.line && <span className="font-mono text-red-400">Line {e.line} · </span>}
                    {e.path && <span className="font-mono text-red-400">{e.path} · </span>}
                    <span className="text-red-300">{e.message}</span>
                  </div>
                ))}
              </div>
            )}
            {errors.length === 0 && !diff && (
              <div className="text-xs text-[color:var(--muted-foreground)]">
                Click Publish to validate and write findings. Errors appear here with line numbers.
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={onPublish} disabled={pending}>
              {pending ? "Validating…" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {diff && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass-3d rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="font-serif text-2xl mb-2">Published</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] mb-6">
                Your changes are live for the client.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="liquid-glass rounded-lg p-4">
                  <div className="text-[11px] uppercase tracking-wider text-[color:var(--muted-foreground)]">Created</div>
                  <div className="font-serif text-3xl mt-1">{diff.created}</div>
                </div>
                <div className="liquid-glass rounded-lg p-4">
                  <div className="text-[11px] uppercase tracking-wider text-[color:var(--muted-foreground)]">Updated</div>
                  <div className="font-serif text-3xl mt-1">{diff.updated}</div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setDiff(null)}>Stay here</Button>
                <Button onClick={onConfirm}>View engagement</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
