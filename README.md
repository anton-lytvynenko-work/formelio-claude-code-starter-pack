# Formelio Claude Code Pack

A Claude Code template for Formelio projects. Bundles a 5-command workflow (`/start → /define → /plan → /implement → /verify`), 11 core skills, and the HINQ ZNO design system in full.

The goal: copy this folder once, run `/start`, answer a few questions — your project is set up correctly with the right Claude Code automation. Then keep going through the workflow to get from "an idea" to "verified, tested, deployed code" without ad-hoc deviations.

---

## Quick start — the "hit start" path

```bash
# 1. Copy the starter into your new project location
cp -r ~/Downloads/formelio-claude-code-pack ~/dev/my-new-project

# 2. Init git and make an initial commit
cd ~/dev/my-new-project
git init
git add -A
git commit -m "initial: from formelio-claude-code-pack"

# 3. Launch Claude Code and run the workflow
claude

# Inside Claude Code:
> /start         # project name, design-system. NO stack picked yet.
> /define        # PRD via prd-creator → docs/prds/
> /plan          # reads PRD, picks the stack as a design question, writes the plan
> /implement     # Task 1 scaffolds the stack; then builds the feature
> /verify        # tests, rules audit, code review
```

That's it. The rest of this README explains *why* the workflow is shaped this way and what every piece does.

---

## Why this shape?

Two design principles drive the workflow:

**1. Stack choice should follow understanding, not precede it.** You can't pick the right tech stack until you know what you're building, for whom, and under what constraints. So `/start` deliberately *doesn't* ask about stacks. It only sets up project identity and the design system. `/define` then captures the PRD. `/plan` picks the stack as one of its design questions, informed by the PRD. `/implement` does the scaffolding as Task 1.

**2. Specialized skills beat sprawling system prompts.** Instead of one giant `CLAUDE.md` that tries to know everything, the starter splits knowledge into commands (workflow steps), skills (on-demand capabilities), rules (always-on guidance), hooks (active enforcement), and agent docs (reference material). Each piece is small, greppable, and replaceable.

---

## The five commands

| Command | What it does | Inputs | Outputs |
|---|---|---|---|
| `/start` | Lightweight project bootstrap. Pre-flight checks, project name, description. Fills name/description placeholders. **Does NOT pick a stack.** | Project name (kebab-case), description | `.claude/` in place; hinq-zno-design-system/ kept; CLAUDE.md/AGENTS.md/README.md partially filled |
| `/define` | Pre-flight: if `src/` already has code, runs a focused `Explore` subagent to produce an `## Existing code context` block. Then invokes the `prd-creator` skill (v2.0, hierarchical) — two rounds of clarifying questions (grounded in the existing-code block when present), proposes structure (standalone PRD vs master plan + child PRDs), waits for approval, writes the PRD(s) with the existing-code context embedded. | Your answers about what, who, constraints, scope | `docs/prds/<N>-prd-<slug>.md` (or master plan + child PRDs) |
| `/plan` | Reads PRDs, runs in PRD-driven mode. Phase 0: pre-flight questions about ambiguous PRD lines. Phase 1: exploration. Phase 2: design decisions including **stack choice as the first design question for greenfield projects**. Phase 3: implementation tasks (Task 1 = scaffold stack if greenfield). Phase 4: writes the plan file. Phase 5: waits for your explicit confirmation. | A PRD in `docs/prds/`; your answers to design questions | `docs/plans/YYYY-MM-DD-prd-<N>-<feature>.md` |
| `/implement` | Reads the plan. If Task 1 is "Scaffold stack", invokes `project-init` first (generates package.json/tsconfig/etc., prunes irrelevant hooks, fills remaining placeholders). Then executes feature tasks one by one, marking each `[x]` in the plan as it completes. | A confirmed plan file | Code; updated CLAUDE.md/docs; auto-generated `.claude/rules/custom/project.md` |
| `/verify` | Runs tests, code review, rules audit, feature parity check. Status moves to `VERIFIED` when it passes. | A complete plan with tasks marked done | Test results, code-review notes, audit; plan status updated |

---

## The 11 core skills

Skills load on demand based on triggers (see `.claude/agent_docs/workflow-triggers.md`).

| # | Skill | What it does | When it fires |
|---|---|---|---|
| 1 | `task-planner` | Breaks complex work into a checkbox task list | Multi-step work in any command |
| 2 | `debug-fresh` | Restarts a debugging session with minimal context | After 3 stuck attempts on the same bug |
| 3 | `code-review` | Reviews code for AI-generated patterns and anti-patterns | Before commits and inside `/verify` |
| 4 | `git-commit` | Conventional commit messages | When the user asks to commit |
| 5 | `project-init` | Stack-specific scaffolding (Node, Python, Rust, Go) | First task of `/implement` on greenfield projects |
| 6 | `diagram-gen` | Mermaid diagrams — 6 types (see below) | Inside `/plan` Phase 2 for STRUCTURAL plans |
| 7 | `complexity-killer` | Audit and remove unnecessary abstractions | User asks to simplify or reduce indirection |
| 8 | `skill-creator` | Create new skills following best practices | User wants to add a skill |
| 9 | `skill-updater` | Capture session learnings into CLAUDE.md and improve skills | Before `/clear` at end of a feature session |
| 10 | `prd-creator` (v2.0) | Structured PRDs with hierarchical numbering | Invoked by `/define` |
| 11 | `visual-parity` | Section-by-section visual comparison of a rebuilt UI against its reference (live site, Figma, or screenshot) using Playwright MCP; writes a parity report | UI work with a visual reference; "compare to design", "check parity" |

### Diagram triggers (`diagram-gen` skill)

| Mermaid type | Trigger | Lives in |
|---|---|---|
| Architecture (`graph TB`) | STRUCTURAL plan adds services/components | `docs/diagrams/architecture-overview.md` |
| Sequence (`sequenceDiagram`) | Multi-service flow or auth flow | `docs/diagrams/<feature>-sequence.md` |
| Flowchart (user flow) | STRUCTURAL plan **with UI changes** — required | `docs/diagrams/<feature>-user-flow.md` |
| State machine | Object lifecycle | `docs/diagrams/<thing>-states.md` |
| ERD | New DB tables/relationships | `docs/diagrams/data-model.md` |
| Class | OOP structure (on request) | `docs/diagrams/<feature>-classes.md` |

Diagrams are first **proposed in the plan file** during `/plan` Phase 2; you edit the markdown directly during Phase 4 review; `/implement`'s final task reconciles them against the actual code.

---

## Design system (always present)

The starter ships with the HINQ ZNO design system in `hinq-zno-design-system/` (2.9 MB — mostly Montserrat + Open Sans variable fonts).

| File | Purpose |
|---|---|
| `hinq-zno-design-system/CLAUDE.md` | Hard rules (sentence case, no emoji, no gradients, etc.) — **read before any UI work** |
| `hinq-zno-design-system/SKILL.md` | Component recipes, layout patterns, copy patterns |
| `hinq-zno-design-system/README.md` | Brand voice, color philosophy, typography rationale |
| `hinq-zno-design-system/HOW_TO_USE.md` | Integration steps |
| `hinq-zno-design-system/colors_and_type.css` | 74 design tokens + @font-face declarations |
| `hinq-zno-design-system/fonts/` | Self-hosted Montserrat + Open Sans variable fonts |
| `hinq-zno-design-system/assets/icons/` | 25 SVG icons (nav + content) + logo |
| `hinq-zno-design-system/preview/` | 17 HTML preview pages (colors, type, components) |
| `hinq-zno-design-system/ui_kits/zno-app/` | Working React reference (App, AppBar, Sidebar, Primitives, dashboards) |

The `.claude/rules/hinq-zno-design-system.md` rule is always active. It tells the agent to read `hinq-zno-design-system/CLAUDE.md` before any UI change and never to hardcode colors or fonts.

If your project is **not** a HINQ project: delete `hinq-zno-design-system/` and `.claude/rules/hinq-zno-design-system.md`. The starter still works without them.

To import the CSS into your app:
```html
<link rel="stylesheet" href="../hinq-zno-design-system/colors_and_type.css" />
```

---

## Workflow triggers

`.claude/agent_docs/workflow-triggers.md` is the single source of truth for "which command/skill should I use right now?". The decision tree there covers: how to map a user request to a command, escalation patterns (bug fix attempts, feature complexity tiers), automatic behaviors (read anti-patterns before code review, consider debug-fresh after 2 failures), MCP server configuration, PRD/planning conventions, and Think Triggers (`think`, `think hard`, `ultrathink`).

If you're unsure how to respond to a user request, read that file first.

---

## Project memory

The starter doesn't use `MEMORY.md` files. Instead, project memory is layered across files that the agent reads automatically:

| Layer | Where | When loaded |
|---|---|---|
| Project entry point | `CLAUDE.md` (root) | Always |
| Agent paradigm | `AGENTS.md` | Reference |
| Always-on guidance | `.claude/rules/*.md` | Always |
| Auto-generated stack facts | `.claude/rules/custom/project.md` | Always (generated by `/implement`) |
| Scoped context | `hinq-zno-design-system/CLAUDE.md` | When working in `hinq-zno-design-system/` |
| Authoritative requirements | `docs/prds/` | Read by `/plan` |
| Decision history | `docs/adr/` | Referenced when context needed |

**Hygiene**: run `/skill-updater` before `/clear` so session learnings land in `CLAUDE.md` and skill files. Update `docs/architecture.md` when structure changes (enforced by `/plan` for STRUCTURAL plans). Write ADRs (`docs/adr/`) for decisions whose *why* would surprise a future reader.

Avoid using Claude's user-level memory (`~/.claude/projects/...`) for project-specific facts — that's per-user, per-machine. Put project facts in the project.

---

## File layout

```
formelio-claude-code-pack/
├── README.md                   ← this file (the starter's own README)
├── CLAUDE.md                   ← per-project context template
├── AGENTS.md                   ← agent instructions template
├── .gitignore
├── .env.example
│
├── .claude/
│   ├── commands/               ← /start, /define, /plan, /implement, /verify
│   ├── skills/                 ← 11 core skills (incl. prd-creator v2.0, visual-parity)
│   │   └── project-init/templates/
│   │       ├── README.template.md   ← installed by /start
│   │       └── node/, python/, rust/, go/   ← installed by /implement
│   ├── rules/                  ← coding-standards, mcp-security, design-system, etc.
│   ├── hooks/                  ← warn-debug-code, block-hardcoded-secrets, block-mcp-injection
│   ├── agent_docs/             ← workflow-triggers, anti-patterns, prompt-engineering
│   ├── prompts/                ← ai-vibe-coding-architect.md
│   └── settings.json           ← skill-updater reminder hook
│
├── hinq-zno-design-system/              ← HINQ ZNO design system (always present, 2.9 MB)
│
├── docs/
│   ├── best_practices.md       ← The 1,161-line "vibe coding" manifesto
│   ├── setup.md                ← Filled by /implement scaffold
│   ├── architecture.md         ← Filled as work progresses
│   ├── prds/                   ← Created by /define
│   ├── plans/                  ← Created by /plan
│   ├── adr/                    ← Architecture Decision Records
│   └── diagrams/               ← Mermaid diagrams (auto-managed)
│
├── tasks/                      ← Task checklists + template
└── scripts/                    ← Deterministic automation
```

---

## Editing the starter itself

This starter is meant to evolve. When you discover a better pattern in a real project, fold it back into the starter:

1. Make the change in this repo (`~/Downloads/formelio-claude-code-pack/`).
2. Commit it with a clear "starter:" prefix.
3. Future projects you `cp -r` will get the improvement.

For breaking changes (e.g. workflow shape), bump a version number in this README and document the migration steps in `docs/adr/`.

---

## Status

- **Workflow**: 5 commands (`/start → /define → /plan → /implement → /verify`).
- **PRD source**: `docs/prds/` (v2.0 convention with hierarchical numbering).
- **Design system**: HINQ ZNO, always present.
- **Core skills**: 11 (incl. prd-creator v2.0 and visual-parity).
- **Stack support** (via project-init): Node.js/TypeScript, Node.js/JavaScript, Python, Rust, Go.

For questions about which command/skill to use, read `.claude/agent_docs/workflow-triggers.md` — that's the decision tree.
