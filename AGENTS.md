# Agent Instructions

This repository follows the Formelio Claude Code workflow. Optimize for simplicity, greppability, and easy rollback.

## Quick Start

1. Read this file and `CLAUDE.md` for full context.
2. Run the workflow in order: `/start → /define → /plan → /implement → /verify`.
3. Don't skip `/define` — stack and design choices in `/plan` depend on a PRD.
4. For any UI work, read `hinq-zno-design-system/CLAUDE.md` before anything else.

## Non-negotiables

- Prefer **flat files in git** over external dashboards/services.
- Keep code **flat, explicit, and greppable** (avoid deep nesting and "magic" abstractions).
- Keep diffs **small, focused, and reversible**.
- Don't add dependencies unless there's a clear, written justification.
- **No commits without explicit user request.**
- All UI work must follow `hinq-zno-design-system/SKILL.md` — use tokens from `colors_and_type.css`, reuse primitives from `ui_kits/zno-app/components/`.

## Architecture (T2 paradigm)

```
Agent (frozen) → Tools (adaptive) → Metrics (measured)
```

- **Agent stays constant** — no model fine-tuning required.
- **Tools evolve** — skills, hooks, commands adapt based on feedback.
- **Everything measured** — track what actually works and update skills accordingly.

## Directory structure

```
.claude/
  commands/     Slash commands (/start, /define, /plan, /implement, /verify)
  skills/       On-demand capabilities (invoke by name or trigger phrase)
  hooks/        Active enforcement (warn/block patterns)
  rules/        Always-on guidance (loaded automatically)
  agent_docs/   Reference docs (read on demand — workflow-triggers, anti-patterns, prompt-engineering)
hinq-zno-design-system/  HINQ ZNO design system (always present; remove if non-HINQ project)
docs/
  prds/         Source-of-truth PRDs (produced by /define)
  plans/        Implementation plans (produced by /plan)
  architecture.md  System architecture map
  best_practices.md  Code discipline manifesto
  adr/          Architecture Decision Records
  diagrams/     Mermaid diagrams (auto-managed by /plan + /implement)
src/            Application code
tasks/          Task checklists + scratchpads
scripts/        Deterministic automation
```

## Core workflow

```
1. /start      lightweight init: name, design-system. No stack yet.
2. /define     PRD via prd-creator → docs/prds/
3. /plan       Reads PRD, picks stack as a design question, writes plan
4. /implement  Task 1 = "Scaffold stack" (project-init skill). Then feature tasks.
5. /verify     Tests, rules audit, code review.

Mid-workflow:
6. Reflect — /skill-updater before /clear (capture learnings)
7. Debug — debug-fresh skill if stuck (after 3 failed attempts)
8. Commit — /git-commit (conventional commits)
```

## Available skills

| Skill | When to use |
|-------|-------------|
| `task-planner` | Breaking down complex tasks |
| `debug-fresh` | Stuck after 3 attempts |
| `code-review` | Before commits or PRs |
| `git-commit` | Creating commits |
| `project-init` | Stack scaffolding (called by /implement Task 1) |
| `diagram-gen` | Visualizing code (Mermaid: architecture, sequence, state, ERD, flowchart, class) |
| `complexity-killer` | Reducing abstractions |
| `skill-creator` | Creating new skills |
| `skill-updater` | End-of-session learnings capture |
| `prd-creator` | Drafting PRDs (called by /define; v2.0 hierarchical) |
| `visual-parity` | Section-by-section visual parity check vs a reference (Playwright MCP) |

See `.claude/agent_docs/workflow-triggers.md` for the full decision tree.

## Slash commands

| Command | Purpose |
|---------|---------|
| `/start` | Lightweight bootstrap (name, design-system). No stack yet. |
| `/define` | PRD via prd-creator → `docs/prds/` |
| `/plan` | Reads PRD, picks stack, writes implementation plan |
| `/implement` | Scaffolds stack (Task 1), then executes feature tasks |
| `/verify` | Tests, rules audit, code review |

## Hooks (active enforcement)

| Hook | Action | Catches |
|------|--------|---------|
| `warn-debug-code` | warn | console.log, debugger |
| `block-hardcoded-secrets` | block | hardcoded API keys, passwords |
| `block-mcp-injection` | block | MCP prompt injection |

## Escalation rules

### Bug fix
```
Attempt 1: Quick fix based on error
Attempt 2: Trace data flow, form hypothesis
Attempt 3: STOP → Use debug-fresh skill
```

### Feature implementation
```
Simple (1-2 files): Implement directly
Medium (3+ files): Use task-planner first, or /plan
Complex (architectural): Use /plan with a PRD
```

### Stuck pattern
```
Going in circles → debug-fresh
Context is long → /skill-updater then start fresh
Unsure of approach → Ask user, don't guess
```

## When requirements are ambiguous

- Ask 1–3 clarifying questions before making assumptions.
- If a safe default exists, state it explicitly and proceed.
- Never guess on architectural decisions — ask first.

## Documentation locations

| Topic | Location |
|-------|----------|
| Run/test/lint commands | `docs/setup.md` |
| Architecture decisions | `docs/architecture.md` |
| Best practices | `docs/best_practices.md` |
| ADRs | `docs/adr/` |
| Task checklists | `tasks/` |
| Source PRDs | `docs/prds/` |
| Implementation plans | `docs/plans/` |
| Design system | `hinq-zno-design-system/` |

## Key rules (always active)

Rules in `.claude/rules/` are loaded automatically:

- `coding-standards.md` — DRY, YAGNI, naming
- `systematic-debugging.md` — phase-based debugging
- `verification-before-completion.md` — evidence before claims
- `git-operations.md` — read-only git (user controls commits)
- `mcp-security.md` — validate MCP responses
- `mcp-tools.md` — when to use which MCP tool
- `no-production-data.md` — never use real customer/production data
- `hinq-zno-design-system.md` — bind UI work to `hinq-zno-design-system/`
- `custom/project.md` — auto-generated by /implement scaffold (real stack facts)
