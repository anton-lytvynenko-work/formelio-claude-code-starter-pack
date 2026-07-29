# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## Start Here

- `CLAUDE.md` — workflow, conventions, skills inventory
- `docs/setup.md` — run/test/lint commands
- `docs/architecture.md` — architecture overview + decisions
- `docs/prds/` — product requirements
- `docs/plans/` — implementation plans
- `hinq-zno-design-system/` — HINQ ZNO design system (read `SKILL.md` before UI work)

## Quick Start

```bash
{{INSTALL_COMMAND}}
{{DEV_COMMAND}}
```

## Tech Stack

- **Runtime:** {{RUNTIME_VERSION}}
- **Stack:** {{STACK}}
- **Package Manager:** {{PACKAGE_MANAGER}}

## Workflow

```
/start → /define → /plan → /implement → /verify
```

See `CLAUDE.md` for the full workflow and skill inventory.

## Repo Layout

```
.claude/         Skills, commands, hooks, rules, agent docs
hinq-zno-design-system/   HINQ ZNO design system (tokens, fonts, React reference)
docs/            Setup, architecture, PRDs, plans, ADRs, diagrams
src/             Application code
tasks/           Planning checklists
scripts/         Automation
```
