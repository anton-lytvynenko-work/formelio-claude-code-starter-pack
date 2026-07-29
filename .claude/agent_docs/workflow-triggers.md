# Workflow Triggers

When to use each command, skill, and pattern. Read this to decide the right approach.

## Commands

The five core commands form a workflow. Run them in order on a new project.

| Trigger | Command | Description |
|---------|---------|-------------|
| Just copied the starter into a new directory | `/start` | Project name, optional modules, design-system. No stack yet. |
| Need to clarify what we're building before code | `/define` | Invokes prd-creator → `docs/prds/` |
| PRD exists; ready to design and plan | `/plan` | Stack as a design question, writes implementation plan |
| Plan approved; ready to build | `/implement` | Task 1 scaffolds the stack; then feature tasks |
| Feature built; validate it | `/verify` | Tests, rules audit, code review |

For ad-hoc research questions ("how does X work?", "where is Y defined?"), no slash command is needed — ask Claude directly. The harness will use the `Explore` subagent or grep/glob as appropriate.

## Skills

| Trigger | Skill | When to Invoke |
|---------|-------|----------------|
| Writing product requirements | `/define` → `prd-creator` | When user wants to create a PRD for a new feature or product. /define is the discoverable entry point. |
| Converting a PRD into tasks | `/plan` (PRD mode) | When a source PRD exists in `docs/prds/`; `/plan` auto-detects and runs in PRD-driven mode |
| Planning a complex task | `task-planner` | Before starting multi-step work |
| Stuck on a bug (3+ attempts) | `debug-fresh` | Reset context, systematic debug |
| Need to visualize code | `diagram-gen` | Architecture, sequence, state diagrams |
| Removing abstraction | `complexity-killer` | Deleting unnecessary complexity |
| Creating a new skill | `skill-creator` | Adding new skills to repo |
| End of session analysis | `skill-updater` | Capture learnings, improve skills, sync CLAUDE.md |

## Escalation Patterns

### Bug Fix Escalation
```
Attempt 1: Quick fix based on error message
Attempt 2: Trace data flow, form hypothesis
Attempt 3 (failed twice): STOP → Use debug-fresh skill
```

### Feature Escalation
```
Simple feature: Just implement
Complex feature (3+ files): Use task-planner first
Very complex (architectural): Use Plan agent, get approval
```

### Stuck Pattern
```
If going in circles → Invoke debug-fresh
If context is long → Start fresh conversation
If unsure of approach → Ask user, don't guess
```

## Automatic Behavior

### Before Code Review
1. Read `.claude/agent_docs/anti-patterns.md`
2. Check for AI-generated patterns
3. Verify against project conventions

### Before Complex Implementation
1. Check if task-planner skill applies
2. Break into subtasks
3. Git checkpoint before starting

### After Failed Fix
1. Count attempts
2. If 2+ failures, consider debug-fresh
3. If 3+ failures, MUST use debug-fresh

## Decision Tree

```
User request received
│
├─ Just received the starter? → /start
├─ Need to spec what we're building? → /define
├─ Have a PRD, need a plan? → /plan
├─ Plan approved, ready to build? → /implement
├─ Feature done, validate it? → /verify
├─ Question about code? → ask directly (no slash needed; harness uses Explore subagent)
│
├─ Is it a bug fix?
│   ├─ First attempt → Try quick fix
│   ├─ Second attempt → Trace and hypothesize
│   └─ Third attempt → debug-fresh skill
│
├─ Is it a new feature?
│   ├─ Simple (1-2 files) → Implement directly
│   ├─ Medium (3+ files) → task-planner first
│   └─ Complex (architectural) → /plan with a PRD
│
├─ Is it a refactor/deletion? → complexity-killer skill
├─ Is it a new PRD? → /define
├─ Is it visualization? → diagram-gen skill
└─ Is it a UI parity/visual check vs a reference? → visual-parity skill
```

## Superseded Plans

When a plan is replaced by a newer plan (e.g. a brute-force approach superseded by a simpler removal), delete or archive the old plan file immediately. Leaving multiple conflicting plans in `docs/plans/` creates confusion about which one is current. If the old plan has useful context, move it to `docs/plans/_archived/` rather than leaving it alongside active plans.

---

## Auth Status Check

When user asks "am I logged in?", "which auth mode am I using?", or "am I using API key or Claude AI?", run `claude auth status` immediately and report the result — don't explain options first.

```bash
claude auth status
```

Returns JSON with `loggedIn`, `authMethod` (`claude.ai` or `apiKey`), `email`, and `subscriptionType`.

---

## MCP Server Configuration

MCP servers do **not** go in `settings.json`. The schema rejects `mcpServers` as an unrecognised field.

**Always use `claude mcp add` to register MCP servers.** Do not manually edit config files — the VS Code extension ignores `~/.claude/mcp.json` and `.vscode/mcp.json` for MCP registration.

```bash
# Add a project-scoped MCP server (recommended)
claude mcp add <name> -- <command> <args...>

# List all servers and their connection status
claude mcp list

# Remove a server
claude mcp remove <name>
```

`claude mcp add` writes to the project-specific section of `~/.claude.json`, which both the CLI and VS Code extension read.

| File | Purpose | Read by VS Code extension? |
|------|---------|---------------------------|
| `~/.claude.json` (project section) | MCP servers registered via `claude mcp add` | Yes |
| `~/.claude/mcp.json` | Legacy global MCP config | No (CLI only) |
| `.vscode/mcp.json` | VS Code native MCP (not Claude Code) | No |
| `~/.claude/settings.json` | Claude Code settings only — no MCP here | N/A |

**MCP servers added mid-session may become available without restarting.** After `claude mcp add`, new tools can appear in the deferred tool list within the current session. If they don't appear, start a new chat session. Verify with `claude mcp list` that the server shows `✓ Connected`.

When the MCP server requires secrets (API keys, tokens), use placeholder tokens and have the user replace them in the file editor — never ask for secrets in chat (see `anti-patterns.md`).

## PRD and Planning Workflow

### Architecture doc — when to update

Architecture updates are **enforced by `/plan` and `/implement`**, not manual guidance:

1. `/plan` classifies every plan as STRUCTURAL or NON-STRUCTURAL
2. STRUCTURAL plans include an **Architecture Impact** section with update checklists
3. STRUCTURAL plans include a final task for architecture docs + diagrams
4. `/implement` incrementally updates Directory Map at each task (step 11b)
5. `/implement` verifies architecture completeness before marking COMPLETE (step 1b)

**Trigger reference** (used by `/plan` during classification):

| What changed | Update |
|---|---|
| New API route | Directory Map + architecture-overview diagram |
| New page | Directory Map + architecture-overview diagram + user flow |
| New lib module | Directory Map + architecture-overview diagram |
| New DB table | Directory Map + architecture-overview DB node |
| New end-to-end flow | Key Flows + new sequence diagram + Diagrams table |

Do NOT update for: bug fixes, modifying existing files, refactors within documented paths.

---

### At the start of any project or PRD session

1. **Store source PRDs** — If the user supplies original PRD documents, save them immediately to `docs/prds/` as markdown files. Name them `<N>-prd-<slug>.md` (e.g. `1-prd-onboarding-flow.md`). Add a header noting they are source documents. For new PRDs the user wants drafted from scratch, invoke `/define` → `prd-creator` instead of writing by hand.
2. **Cross-check before planning** — Before generating an implementation plan, read the source PRD line by line. Every requirement must map to a task. Flag any that don't.
3. **Fetch external reference URLs proactively** — If the PRD lists a "Reference sources" section with URLs (e.g. API docs, GitHub repos, specs), fetch them before generating the plan — don't wait for the user to prompt. Missing spec details become missing requirements.

### Common gaps to check when converting PRD → implementation plan

- Language support (e.g. Dutch + English, not just English)
- Data model fields mentioned in requirements but missing from schema
- Features marked for v2 in the PRD that the plan accidentally implements now
- Features the plan silently downgrades (e.g. "shared team dashboards" → "personal views only")
- Terminology mismatches between PRD and plan

Use `/plan` for this workflow — it auto-detects the source PRD and switches into PRD-driven mode.

### Plan workflow coexistence — `/plan` skill vs built-in plan mode

The project has two planning mechanisms that can collide when both are active:

| Mechanism | Plan file location | Approval signal |
|-----------|--------------------|-----------------|
| Built-in plan mode (Shift+Tab in CLI) | `~/.claude/plans/<auto-name>.md` | `ExitPlanMode` tool |
| `/plan` command | `docs/plans/YYYY-MM-DD[-prd-NN]-<feature>.md` | Written file + user confirmation; command says **do not** use `ExitPlanMode` |

**If you are already in built-in plan mode and the user invokes `/plan`:**

1. The project convention wins — save the plan to `docs/plans/YYYY-MM-DD-<feature>.md` using the `/plan` skill's template (Summary / Scope / Prerequisites / Progress Tracking / Implementation Tasks / Testing Strategy / Risks).
2. Writing to that path from plan mode auto-exits built-in plan mode cleanly — you do not need to call `ExitPlanMode` first.
3. Do not leave content in the ad-hoc `~/.claude/plans/<auto-name>.md` file; treat it as scratch.

**Choosing between planning mechanisms:**

- PRD document supplied → `/plan` (auto-detects PRD; runs in PRD-driven mode with traceable requirement mapping)
- Complex multi-file implementation without a PRD → `/plan` (ad-hoc mode; structured template with tasks + DoD)
- Quick checkbox breakdown for a single task → `task-planner` skill
- Ad-hoc exploration before implementation → built-in plan mode (Shift+Tab)

Don't stack `/plan` on top of built-in plan mode unless the user explicitly asks for both.

### Audit → Plan pipeline

When a `ui-comparison-audit` produces `REQ-*` requirements, the natural next step is `/plan` consuming the audit documents. The workflow:

1. `ui-comparison-audit` produces: main audit (REQ-001–018), optional supplementary requirements (REQ-019+), optional reference spec
2. `/plan` reads all audit documents before planning — instruct it to read all three (or however many exist)
3. The plan groups REQs into tasks, respecting the 10–12 task limit — if REQs exceed this, use `AskUserQuestion` to propose tier-based scoping (e.g. "core UI" vs "proxy/network" vs "polish")

All audit documents live in `docs/audits/` and plans in `docs/plans/`. The plan should reference specific `REQ-*` IDs in each task so traceability is maintained.

### Plan status for deliverable-only plans

Plans that produce only documentation (reports, audits, specs) — no application code changes — can be marked `VERIFIED` without running `/verify`. There is no code to test. The user can set `Status: VERIFIED` directly after confirming the deliverable is complete.

---

## Think Triggers

| Phrase in User Request | Action |
|------------------------|--------|
| "think" | Light reasoning |
| "think hard" | Multi-step analysis |
| "think harder" | Deep architectural thinking |
| "ultrathink" | Maximum reasoning depth |
