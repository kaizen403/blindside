# Dashboard Execution Plan

Source plan: `/home/kaizen/blindside/plan.md`
Mode: ultrawork, full auto, all 10 phases, no compromises
Stack: Next 16 + React 19 + Tailwind v4 + Prisma + Better Auth + local Postgres

---

## Wave Strategy

| Wave | Phases | Parallelism | Why |
|------|--------|-------------|-----|
| W0 | Phase 0 | Sequential | Schema/auth are foundation - everything else needs them |
| W1 | Phase 1 | High parallel (5+ tasks) | Design system primitives are independent |
| W2 | Phase 2 + Phase 3 | High parallel (8+ tasks) | Client + admin pages own disjoint files |
| W3 | Phase 4 + Phase 5 | Medium parallel | Markdown ingest + status writes |
| W4 | Phase 6 + 7 + 8 | Medium parallel | Notifications + reports + audit |
| W5 | Phase 9 + 10 | Sequential sweep | Hardening + perf as final pass |

---

## Hard Blockers Checklist (stop and ask if hit)

- pnpm not installed → use npm
- Port 5432 in use → ask user to free
- Docker daemon not running → ask user to start
- Prisma schema validation fails → consult oracle
- Better Auth schema generation conflicts with manual schema → consult oracle
- Build fails after Phase 0 → consult oracle, do not proceed

---

## Phase Boundary Verification

After each phase:
```bash
cd /home/kaizen/blindside
pnpm prisma validate 2>/dev/null || npx prisma validate    # schema valid
pnpm build 2>/dev/null || npm run build                     # build clean
```

After Wave 0: docker compose ps; npx prisma db push; npx prisma db seed
After every wave: lsp_diagnostics on changed dirs

---

## Execution Tracker

Wave 0 tasks fire sequentially. Wave 1+ tasks fire in parallel within each wave.

This file is a record. Actual prompts are sent inline from the orchestrator session.
