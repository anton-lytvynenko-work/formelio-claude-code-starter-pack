# Project Context

`{{PROJECT_NAME}}` — {{PROJECT_DESCRIPTION}}

This project uses **{{STACK}}** and follows the Formelio Claude Code workflow: `/start → /define → /plan → /implement → /verify`.

For non-Claude agents (e.g., Codex CLI), see `AGENTS.md`.

## Essential Commands

| Task | Command |
|------|---------|
| Install | `{{INSTALL_COMMAND}}` |
| Run | `{{DEV_COMMAND}}` |
| Test | `{{TEST_COMMAND}}` |
| Lint | `{{LINT_COMMAND}}` |
| Build | `{{BUILD_COMMAND}}` |

> Placeholders are filled by `/implement`'s scaffold task once a stack is chosen in `/plan`. If they're still `{{...}}`, you haven't run `/plan` and `/implement` yet.

## Workflow — the 5 commands

```
/start      lightweight init: project name, design-system.
            No stack picked yet.
/define     PRD via prd-creator → docs/prds/<N>-prd-<slug>.md
            Clarifies WHAT you're building before tech choices.
/plan       Reads docs/prds/, picks stack as a design question,
            writes docs/plans/YYYY-MM-DD-<feature>.md
/implement  First task = "Scaffold stack" (project-init skill).
            Then executes feature tasks per the plan.
/verify     Tests, rules audit, code review.
```

## Design System — HINQ ZNO

This project ships with the HINQ ZNO design system at `hinq-zno-design-system/`. **All UI work must follow it.** Read `hinq-zno-design-system/CLAUDE.md` before any UI change. Use tokens from `hinq-zno-design-system/colors_and_type.css`. Reuse primitives from `hinq-zno-design-system/ui_kits/zno-app/components/`. See `.claude/rules/hinq-zno-design-system.md` for the binding rule.

If this is not a HINQ project, delete `hinq-zno-design-system/` and `.claude/rules/hinq-zno-design-system.md`.

## Code Discipline

**Code Discipline**: understand before building, delete aggressively, use proven patterns, minimize dependencies, be explicit and boring, fail fast.

**Quick reference**: Simple > clever. Readable > fast. Explicit > implicit. Small functions > god objects.

See `docs/best_practices.md` for the full manifesto (1,161 lines, the "vibe coding" reference).

## Prompting AI Agents Effectively

- **Describe outcomes, not steps** — what you want, not how
- **State preconditions** — when NOT to act
- **Provide examples** — concrete > abstract
- **Define success** — tests or validation criteria
- **One change per prompt** — multiple changes lose context

Full guide: `.claude/agent_docs/prompt-engineering.md`.

## Architecture

```
.claude/skills/     → Agent capabilities (load on demand)
.claude/commands/   → Reusable slash commands (start, define, plan, implement, verify)
.claude/hooks/      → Active enforcement (warn/block)
.claude/rules/      → Always-on guidance (coding standards, security, design system)
.claude/agent_docs/ → Reference docs (workflow-triggers, anti-patterns, prompt-engineering)
hinq-zno-design-system/      → HINQ ZNO design system (tokens, fonts, icons, React reference)
docs/               → Documentation
docs/prds/          → PRDs (source of truth for /plan)
docs/plans/         → Implementation plans
docs/architecture.md → System architecture map (updated by /plan + /implement)
docs/best_practices.md → Code discipline manifesto
docs/adr/           → Architecture Decision Records
docs/diagrams/      → Mermaid diagrams (auto-managed by /plan + /implement)
src/                → Application code
tasks/              → Task checklists + scratchpads
scripts/            → Deterministic automation
```

## Principles

1. **Raw files > abstractions** — flat files, not databases for project state
2. **Skills > system prompts** — modular, composable capabilities in `.claude/skills/`
3. **Flat, explicit, greppable** — code easy to search and understand
4. **Deletion is a feature** — abstraction cost with AI is high; delete aggressively

## Skills available

| Skill | Purpose |
|-------|---------|
| `task-planner` | Break work into checkbox tasks |
| `debug-fresh` | Clean debugging session after 3 stuck attempts |
| `code-review` | Review for AI-generated patterns |
| `git-commit` | Conventional commit messages |
| `project-init` | Stack-specific scaffolding (invoked by `/implement` Task 1) |
| `diagram-gen` | Mermaid architecture/sequence/state/ERD/flowchart diagrams |
| `complexity-killer` | Remove unnecessary abstractions |
| `skill-creator` | Create new skills |
| `prd-creator` | Structured PRDs in `docs/prds/` (v2.0, hierarchical) |
| `skill-updater` | Capture session learnings before `/clear` |
| `visual-parity` | Section-by-section visual parity check vs a reference (Playwright MCP) |

## Conventions

- Use kebab-case for file and folder names
- Keep functions small and explicit
- Avoid deep nesting (max 3 levels)
- No barrel files (`index.ts` re-exports)
- Comments only where the WHY is non-obvious

## Memory (where to put what)

| What | Where |
|---|---|
| Project workflow + conventions (this file) | `CLAUDE.md` |
| Real stack facts (auto-generated) | `.claude/rules/custom/project.md` |
| Design system scoped guidance | `hinq-zno-design-system/CLAUDE.md` |
| Architecture map | `docs/architecture.md` |
| Authoritative requirements | `docs/prds/` |
| Decision history ("why X") | `docs/adr/` |
| Cross-session learnings | run `/skill-updater` before `/clear` |

## Hooks

Active enforcement rules in `.claude/hooks/`:

| Hook | Action | Catches |
|------|--------|---------|
| warn-debug-code | warn | console.log, debugger |
| block-hardcoded-secrets | block | hardcoded secrets |
| block-mcp-injection | block | MCP prompt injection |

## Slash commands

| Command | Purpose |
|---------|---------|
| `/start` | Lightweight bootstrap (name, design-system). No stack yet. |
| `/define` | PRD via prd-creator → `docs/prds/` |
| `/plan` | Reads PRD, picks stack, writes implementation plan |
| `/implement` | Scaffolds stack (Task 1), then executes feature tasks |
| `/verify` | Tests, rules audit, code review |

## Agent docs

| Doc | When to Read |
|-----|--------------|
| `workflow-triggers.md` | Deciding which command/skill to use (single source of truth for triggers) |
| `anti-patterns.md` | Before code review or PR |
| `prompt-engineering.md` | Writing effective prompts |
