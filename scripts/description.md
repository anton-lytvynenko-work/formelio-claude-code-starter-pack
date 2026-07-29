# scripts/

This folder is for **deterministic automation**: one-off utilities, migrations, exports, generators, and maintenance scripts that are easier/safer to run than to “hand edit”.

## What Belongs Here

- Export/migration scripts (prefer API exports over clicking dashboards)
- Repo maintenance scripts (rename, scaffold, cleanup)
- Generators (create boilerplate, sync content, etc.)

## What Does *Not* Belong Here

- Product documentation (use `docs/`)
- Long-lived “scratch notes” (use `tasks/`)
- Raw content/data (use `content/`)

## Script Rules (AI-Friendly)

- Runnable from repo root (use relative paths)
- Idempotent where possible (safe to re-run)
- No hardcoded absolute paths
- Require secrets via env vars (never committed)
