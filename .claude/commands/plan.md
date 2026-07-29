---
description: Create a detailed implementation plan, with PRD-driven mode when a source PRD exists
model: opus
---

# PLAN MODE: Implementation Planning

> **WARNING: DO NOT use the built-in `ExitPlanMode` or `EnterPlanMode` tools.**
> This project has its own planning workflow using `/plan`, `/implement`, and `/verify` slash commands.
> The built-in Claude Code plan-mode tools write to different paths and are incompatible.
> When planning is complete, simply inform the user and wait for confirmation — no special tool needed.

## Two modes — auto-detected

`/plan` operates in one of two modes depending on whether a source PRD exists.

### Detection (always run first)

1. Glob `docs/prds/*.md`
2. **Exclude master-plan files** (`*-master-plan-*.md`) from the candidate set — master plans orchestrate child PRDs and are not directly plannable. Use them to read context, but plan against a specific child PRD.
3. If **0 matches** → **Ad-hoc mode** (use `Phase 0b` below)
4. If **1 match** that clearly relates to the user's request → **PRD mode** (use `Phase 0a`); the matched file is the source PRD
5. If **2+ matches** → use `AskUserQuestion` to pick one PRD or "none of these (ad-hoc)"

In PRD mode the source PRD is the authoritative requirements document. Updates flow back into it whenever clarifying questions reveal a gap.

---

## Using AskUserQuestion — Core Planning Tool

**`AskUserQuestion` is essential for effective planning.** Group related questions into batches so users answer them together without interruption.

### Batching strategy

| Batch | When | Purpose |
|-------|------|---------|
| **Batch 1** | Phase 0 (before exploration) | Clarify task, scope, priorities (ad-hoc mode), or pre-flight clarifications (PRD mode) |
| **Batch 2** | Phase 2 (after exploration) | Architecture choices, design decisions |

Don't scatter questions across phases — gather them and present together.

### When to use

| Situation | Example |
|-----------|---------|
| **Unclear requirements** | "Should this feature support batch processing or single items only?" |
| **Multiple valid approaches** | Present 2–3 options with trade-offs |
| **Ambiguous scope** | "Include error recovery, or fail fast?" |
| **Technology choices** | "async/await or callbacks for this integration?" |
| **Priority decisions** | "Performance or simplicity — which matters more here?" |
| **Missing domain knowledge** | "How does the existing auth flow work in production?" |

### How to structure questions

Present options, not open-ended questions when possible. Include trade-offs for each option. **Don't proceed with assumptions — ask.**

```
Question: "Which authentication approach should we use?"
Options:
- Option A: JWT tokens (stateless, scalable, requires token refresh logic)
- Option B: Session-based (simpler, requires session storage)
- Option C: OAuth integration (most secure, more complex setup)
```

---

## Extending Existing Plans

**When adding tasks to an existing plan:**

1. Load existing plan: `Read(file_path="docs/plans/...")`
2. Parse structure (architecture, completed tasks, pending tasks)
3. Check git status for partially completed work
4. Verify new tasks are compatible with existing architecture
5. If `original + new > 12` tasks, suggest splitting
6. Mark new tasks with `[NEW]` prefix
7. Update total count: `Total Tasks: X (Originally: Y)`
8. Add extension history: `> Extended [Date]: Tasks X–Y for [feature]`

---

## ⚠️ CRITICAL: Migration / Refactoring Tasks

**When the task involves migrating, refactoring, or replacing existing code, complete these additional steps to prevent missing features.** These rules apply in both PRD and ad-hoc modes.

### Mandatory Feature Inventory (Phase 2.5)

**After exploration but BEFORE creating tasks:**

1. **List ALL files being replaced:**

   ```markdown
   ## Feature Inventory — Files Being Replaced

   | Old File | Functions/Classes | Status |
   |----------|-------------------|--------|
   | `old/module1.ts` | `funcA()`, `funcB()`, `ClassX` | ⬜ Not mapped |
   | `old/module2.ts` | `funcC()`, `funcD()` | ⬜ Not mapped |
   ```

2. **Map EVERY function/feature to a new task:**

   ```markdown
   ## Feature Mapping — Old → New

   | Old Feature | New Location | Task # |
   |-------------|--------------|--------|
   | `module1.funcA()` | `new/step1.ts` | Task 3 |
   | `module1.funcB()` | `new/step1.ts` | Task 3 |
   | `module2.funcC()` | `new/step2.ts` | Task 5 |
   | `module2.funcD()` | ❌ MISSING | ⚠️ NEEDS TASK |
   ```

3. **Verify 100% coverage before proceeding:**
   - Every row must have a Task # or explicit "Out of Scope" justification
   - "Out of Scope" means the feature is INTENTIONALLY REMOVED (with user confirmation)
   - "Out of Scope" does NOT mean "migrate as-is" — that still needs a task

### "Out of Scope" — precise meaning

| Phrase | Meaning | Requires Task? |
|--------|---------|----------------|
| "Out of Scope: Changes to X" | X migrates AS-IS, no modifications | ✅ YES — migration task |
| "Out of Scope: Feature X" | X is intentionally REMOVED/not included | ❌ NO — but needs user confirmation |
| "Out of Scope: New features for X" | X migrates as-is, no NEW features added | ✅ YES — migration task |

When in doubt, ask:

```
"The old code has [feature]. Should we:
A) Migrate it as-is (needs implementation task)
B) Intentionally remove it (truly out of scope)
C) Improve it (new feature, needs implementation task)"
```

### Pre-Task Verification Gate

Before finalizing Phase 3, verify:

- [ ] All old files listed in Feature Inventory
- [ ] All functions/classes from old files identified
- [ ] Every feature mapped to a task OR explicitly marked "REMOVED" with user confirmation
- [ ] No row in Feature Mapping has "⬜ Not mapped" status
- [ ] User has confirmed any features marked for removal

If any checkbox is unchecked, **DO NOT proceed to Phase 4.**

---

## Creating New Plans

### Phase 0a — PRD-driven mode (when a source PRD exists)

**1. Read the source PRD line-by-line.** Do not skim. Do not proceed until every line is read.

**2. Build pre-flight questions** anchored in the PRD. For each requirement, work through these categories and surface anything ambiguous:

| Category | What to look for |
|----------|------------------|
| **Scope** | Is this v1 or explicitly deferred to v2? Anything that looks like v1 but might be scope creep? |
| **Ambiguity** | Can this requirement be interpreted in more than one way? Which interpretation are you about to use? |
| **Missing data** | Does this feature need fields not yet in the data model or field map? |
| **Language/locale** | Does the UI need multiple languages? Is it stated explicitly? |
| **Terminology** | Does the PRD use product/concept names consistently across sections? |
| **Dependencies** | Does this PRD depend on output from another PRD? |
| **Auth / access** | Are there access restrictions implied but not stated? |
| **Edge cases** | What happens at zero results? At scale? On error paths? |

**3. Present a "Pre-flight Questions" block** before generating anything:

```markdown
## Pre-flight Questions

Before I generate the plan, I need to clarify:

1. [Quote the ambiguous requirement] — I was about to assume [Y]. Is that correct?
2. [Quote the missing data field] — Should this be added to the data model now?
3. [Scope question about feature W] — The PRD doesn't mark this as v2. Should it be in scope?

Please answer these before I continue. If you correct any of these, I will update the source PRD to reflect your answer.
```

Use `AskUserQuestion` to pose them. **Stop and wait for answers.** Do not generate the plan until the user responds.

**4. Update the source PRD** for every answer that reveals a gap or correction:

> "You said X. The source PRD currently says Y. I'll update `docs/prds/<N>-prd-<slug>.md` to reflect this — confirm and I'll apply it."

Apply the update before continuing. The source PRD must be the single source of truth.

Common corrections to watch for:
- Terminology fixes (product/concept names)
- Requirements moved between v1 and v2
- Missing fields added to data-model descriptions
- Language/locale requirements made explicit
- Auth or access requirements clarified

### Phase 0b — Ad-hoc mode (no PRD)

**1. Restate the task.** Before any exploration:
- Restate what the user is asking for in your own words
- Identify the core problem being solved
- List any assumptions you're making

**2. Gather all clarifications upfront** (Question Batch 1) using `AskUserQuestion`:

```
I want to confirm my understanding and clarify a few things:

Questions:
1. "Is my understanding correct?"
   - Yes, that's correct
   - Partially correct (please clarify)
   - No, let me explain

2. "What's the priority for this feature?"
   - Performance (fast, optimized)
   - Simplicity (easy to maintain)
   - Flexibility (extensible)

3. "Should error handling be comprehensive or minimal?"
   - Comprehensive (recovery, retries, detailed logging)
   - Basic (fail fast, simple error messages)
```

Don't proceed to exploration until clarifications are complete.

### Phase 1 — Exploration

Explore the codebase systematically. Run explorations **one area at a time** — do not spawn multiple parallel design investigations.

**Exploration areas (in order):**

1. **Architecture** — project structure, entry points, how components connect
2. **Similar features** — existing patterns that relate to the task; what can be reused
3. **Dependencies** — imports, modules, what will be impacted
4. **Tests** — test infrastructure, existing patterns, available fixtures

**Tool guidance:**

- Use `Read`, `Grep`, `Glob` directly for file inspection
- For broad codebase searches that span multiple areas or naming conventions, the **Explore subagent** is permitted: it does parallel read-only discovery without polluting your context. Cap usage and only for read-only research.
- **Do NOT delegate design decisions to any subagent.** Hypotheses, architecture choices, and task decomposition stay with the planning agent so context isn't lost.
- If MCP servers are configured for code search or documentation lookup, use them; otherwise rely on the built-in tools.

For each area:
- Document hypotheses (not conclusions)
- Note full file paths for relevant code
- Track questions that remain unanswered

After explorations complete:
1. Read each identified file to verify hypotheses
2. Build a complete mental model of current architecture
3. Identify integration points and potential risks
4. Note reusable patterns

### Phase 2 — Design Decisions

**Present findings and gather all design decisions** (Question Batch 2).

Summarize what you found, then use `AskUserQuestion` with all decisions at once:

```
Based on my exploration, I found [summary of key findings].

I have some design questions:

1. "Which architecture approach should we use?"
   - Option A: [description + trade-offs]
   - Option B: [description + trade-offs]
   - Option C: [description + trade-offs]

2. "How should we handle [specific concern found during exploration]?"
   - Option A: [approach]
   - Option B: [approach]

3. "The existing [component] uses [pattern]. Follow it or try something different?"
   - Follow existing pattern (consistency)
   - Use new approach (explain why)
```

**Stack selection (FIRST design question for greenfield projects):**

Before any other design questions, check if a stack has already been scaffolded. Run:

```bash
ls package.json pyproject.toml Cargo.toml go.mod 2>/dev/null
```

If **none** exist, this is a greenfield project and stack choice is the first design question. Use `AskUserQuestion` with these options:

- **Node.js / TypeScript** — best for: web frontend, REST/GraphQL APIs, full-stack JS (matches HINQ ZNO design system targeting React/MUI).
- **Python** — best for: data pipelines, ML, scripting, integrations with scientific libraries, Kibana / Elasticsearch scripting.
- **Rust** — best for: performance-critical services, CLIs, systems programming.
- **Go** — best for: small services, CLIs, devops tooling.

Suggest one based on the PRD content:
- PRD mentions React, MUI, UI components, dashboards → **Node.js / TypeScript** (recommended)
- PRD mentions data analysis, ETL, ML, scripts → **Python**
- PRD mentions high-throughput service, CLI, embedded → **Rust** or **Go**
- HINQ ZNO design system referenced → strongly suggest **Node.js / TypeScript**

Record the chosen stack in the plan's "Summary" and "Tech Stack" sections. The plan's **first task must be "Scaffold stack"** — `/implement` reads this task and runs the `project-init` skill with the chosen stack before any feature code.

If a stack file already exists, **skip this question** — the project is already scaffolded and `/implement` will go straight to feature tasks.

**Architecture impact assessment:**
- Read `docs/architecture.md` and `docs/diagrams/` to understand the documented state
- Classify: does this plan introduce new API routes, pages, lib modules, DB tables, or user flows? → **STRUCTURAL** or **NON-STRUCTURAL**
- If STRUCTURAL: identify which existing diagrams need updating and what new diagrams are needed
- If the plan adds user-facing flows: a UI navigation flow diagram is required (Mermaid flowchart showing page → page → interaction)

**After user answers:**
- Summarize the chosen design approach
- Confirm: "Does this design work for your needs?"
- Don't proceed until design is validated

### Phase 3 — Implementation Planning

**Task count limit:** Maximum 10–12 tasks per plan. If the breakdown exceeds 12, use `AskUserQuestion` to ask whether to split into multiple features.

**Greenfield rule:** If no stack file exists (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`), **Task 1 must be "Scaffold stack"**:

```markdown
### Task 1: Scaffold stack

**Objective:** Invoke the `project-init` skill with the stack chosen in Phase 2. Generate stack-specific config files, prune irrelevant hooks, fill remaining {{STACK}} placeholders in `CLAUDE.md` and `docs/`, generate `.claude/rules/custom/project.md` and (if `.mcp.json` exists) `.claude/rules/custom/mcp-tools.md`.

**Files:**
- Create: stack-specific config (e.g. `package.json` + `tsconfig.json` + `.eslintrc.json` for Node)
- Modify: `CLAUDE.md`, `AGENTS.md`, `README.md`, `docs/setup.md`, `docs/architecture.md` (fill stack placeholders)
- Create: `.claude/rules/custom/project.md`
- Delete: irrelevant hooks per stack

**Implementation Steps:**
1. Read project name and description from CLAUDE.md (already filled by /start)
2. Invoke `project-init` skill, passing the chosen stack
3. Validate: no unreplaced `{{PLACEHOLDER}}` in root files; stack config files parse cleanly

**Definition of Done:**
- [ ] Stack config file present at project root and valid
- [ ] All `{{STACK}}` / `{{INSTALL_COMMAND}}` / `{{DEV_COMMAND}}` etc. placeholders filled
- [ ] `.claude/rules/custom/project.md` exists with real stack facts
- [ ] Irrelevant hooks removed
```

Feature tasks then start at Task 2. If a stack file already exists, skip this and start at Task 1.

**Task structure:**

```markdown
### Task N: [Component Name]

**PRD requirement:** [PRD mode only — quote the requirement this implements]

**Objective:** [1–2 sentences describing what to build]

**Files:**
- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.ts`
- Test: `tests/exact/path/to/test.ts`

**Implementation Steps:**
1. Write failing test — define expected behavior
2. Implement minimal code — make test pass
3. Verify execution — run actual program
4. Integration test — test with other components

**Definition of Done:**
- [ ] All tests pass (unit, integration if applicable)
- [ ] No diagnostic errors (linting, type checking)
- [ ] Code functions correctly with real data
- [ ] Edge cases handled appropriately
- [ ] Error messages are clear and actionable
```

**Zero-context assumption:**
- Assume the implementer knows nothing about the codebase
- Provide exact file paths
- Explain domain concepts
- List integration points
- Reference similar patterns in the codebase

**Architecture documentation task (STRUCTURAL plans only):**

If classified STRUCTURAL, the **final task** must be:

```markdown
### Task N (final): Update Architecture Docs & Diagrams

**Objective:** Update architecture docs and diagrams to reflect structural changes. Use `diagram-gen` skill conventions (Mermaid, `docs/diagrams/`, component table).

**Files:**
- Modify: `docs/architecture.md` (per Architecture Impact checklist)
- Modify/Create: diagram files per Architecture Impact table

**Implementation Steps:**
1. Update `docs/architecture.md` Directory Map with new files
2. Update `docs/architecture.md` Key Flows if a new flow was added
3. Create/update Mermaid diagrams per Architecture Impact table
4. Finalize proposed user flow diagram against actual implementation
5. Update Diagrams table in `docs/architecture.md` if new diagrams added

**Definition of Done:**
- [ ] All Architecture Impact checklist items completed
- [ ] All diagrams reflect actual implementation (not plan-time proposals)
- [ ] Diagram component tables match real code paths
```

### Phase 4 — Documentation

**Save plan to:**
- PRD mode: `docs/plans/YYYY-MM-DD-prd-<N>-<feature-name>.md`
- Ad-hoc mode: `docs/plans/YYYY-MM-DD-<feature-name>.md`

**Plan template:**

```markdown
# [Feature Name] Implementation Plan

> **IMPORTANT:** Start with fresh context. Run `/clear` before `/implement`.

> Generated from: `docs/prds/<N>-prd-<slug>.md` (PRD mode only — omit otherwise)

Created: [Date]
Status: PENDING

> **Status Lifecycle:** PENDING → COMPLETE → VERIFIED
> - PENDING: Initial state, awaiting implementation
> - COMPLETE: All tasks implemented (set by /implement)
> - VERIFIED: Rules supervisor passed (set automatically)

## Summary
**Goal:** [One sentence describing what this builds]

**Architecture:** [2–3 sentences about chosen approach]

**Tech Stack:** [Key technologies/libraries]

## Scope

### In Scope
- [What WILL be changed/built]
- [Specific components affected]

### Out of Scope
- [What will NOT be changed]
- [Explicit boundaries]

## Prerequisites
- [Requirements before starting]
- [Dependencies that must exist]
- [Environment setup needed]

## Context for Implementer
- [Key codebase convention or pattern]
- [Domain knowledge needed]
- [Integration points or dependencies]

## Architecture Impact

**Classification:** [STRUCTURAL | NON-STRUCTURAL]

> STRUCTURAL = new API routes, pages, lib modules, DB tables, or end-to-end user flows.
> NON-STRUCTURAL = bug fix, refactor within existing files, config changes.
> When in doubt, classify as STRUCTURAL.

### New or structurally modified files

| Change | File | Description |
|--------|------|-------------|
| Create | `exact/path/to/file.ts` | What it does |
| Modify | `exact/path/to/existing.ts` | What structural change |

### Architecture doc updates needed

- [ ] `docs/architecture.md` Directory Map — [list additions]
- [ ] `docs/architecture.md` Key Flows — [new flow description, or "none"]
- [ ] `docs/architecture.md` Diagrams table — [new diagram links, or "none"]

### Diagrams to create or update

| Diagram | Action | File |
|---------|--------|------|
| Architecture Overview | Update — add [X] nodes | `docs/diagrams/architecture-overview.md` |
| [Feature] User Flow | Create | `docs/diagrams/[feature]-user-flow.md` |
| [Feature] Sequence | Create | `docs/diagrams/[feature]-sequence.md` |

> For NON-STRUCTURAL plans: write "No architecture updates needed" and skip the tables.

### Proposed user flow (STRUCTURAL plans with UI changes)

> Mermaid flowchart showing page-to-page navigation and key interactions.
> This is a proposal — finalized during implementation.

[Mermaid flowchart here]

## Feature Inventory (FOR MIGRATION/REFACTORING ONLY)

> Include this section when replacing existing code. Delete if not applicable.

### Files Being Replaced

| Old File | Functions/Classes | Mapped to Task |
|----------|-------------------|----------------|
| `old/file1.ts` | `funcA()`, `funcB()` | Task 3 |
| `old/file2.ts` | `ClassX`, `funcC()` | Task 4, Task 5 |

### Feature Mapping Verification

- [ ] All old files listed above
- [ ] All functions/classes identified
- [ ] Every feature has a task number
- [ ] No features accidentally omitted

**⚠️ If any feature shows "❌ MISSING", add a task before implementation!**

## Progress Tracking

**MANDATORY: Update this checklist as tasks complete. Change `[ ]` to `[x]`.**

- [ ] Task 1: [Brief summary]
- [ ] Task 2: [Brief summary]
- [ ] ...

**Total Tasks:** [Number] | **Completed:** 0 | **Remaining:** [Number]

## Implementation Tasks

### Task 1: [Component Name]
[Full task structure from Phase 3]

### Task 2: [Component Name]
[Full task structure from Phase 3]

## Testing Strategy
- Unit tests: [What to test in isolation]
- Integration tests: [What to test together]
- Manual verification: [Steps to verify manually]

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | Low/Med/High | Low/Med/High | [How to mitigate] |

## Open Questions
- [Any remaining questions for the user]
- [Decisions deferred to implementation]

## Coverage Check (PRD mode only — omit otherwise)

| PRD Requirement | Covered By | Notes |
|-----------------|------------|-------|
| [Requirement 1, quoted from PRD] | Task 3, Step 2 | |
| [Requirement 2] | [v2 — deferred] | |
| [Requirement 3] | [MISSING] | Needs task or explicit defer |

If anything is `[MISSING]`, add a task or ask the user whether to defer it. The plan does not ship with unmapped requirements.

---
**USER: Please review this plan. Edit any section directly, then confirm to proceed.**
```

### Phase 5 — Implementation Handoff

**After saving the plan:**

1. **Inform user:** "Plan saved to `docs/plans/YYYY-MM-DD-...`"
2. **Request review:** ask the user to review and edit the plan
3. **Wait for explicit confirmation** before proceeding

**After user confirms:**

1. **Re-read the plan file completely** — the user may have edited it
2. **Note any changes** the user made
3. **Acknowledge the changes** before proceeding
4. Provide next steps: "Ready for implementation. Run `/clear` then `/implement <plan-path>`."

**PRD mode — ongoing PRD update reminder:**

During implementation (even after the plan is written), if the user says something that contradicts or extends the source PRD, surface it:

> "You've described [X], which differs from / adds to the source PRD. Should I update `docs/prds/<N>-prd-<slug>.md` to capture this? This keeps the PRD as the source of truth for future sessions."

Apply the update when confirmed. Never let the plan drift silently away from the source PRD.

**DO NOT write or edit any implementation files until confirmed.**

---

## Common gaps to catch (PRD mode)

When working from a PRD, watch for these recurring gaps:

- Language/locale support stated for one language but the feature needs multiple
- Data-model fields mentioned in requirements but missing from the schema
- Features marked v2 in the PRD accidentally included in the plan
- Features the plan silently downgrades (e.g. "shared team queries" → "personal history only")
- Terminology mismatches between PRD and plan
- Dependencies on other PRDs not reflected in task ordering

## Scope changes mid-plan

When the user changes the scope of a plan (e.g. switches from Track A to Track B), do not just find-replace the name. Re-examine every task that is structurally affected:

1. **Data model** — do new fields or tables become required?
2. **Type definitions** — does the shape of the config/scenario type change?
3. **Executor logic** — does the execution sequence change (e.g. adding an intermediate step)?
4. **UI** — do new inputs appear or disappear on setup/results pages?

A scope change that looks like a rename often requires structural rewrites in Tasks 2, 3, and 5. Always check all tasks, not just the summary line.

---

## Critical Rules

These rules are non-negotiable:

1. **USE `AskUserQuestion` when uncertain** — don't guess; ask the user
2. **Batch questions together** — don't interrupt the user with scattered questions
3. **Run explorations sequentially per area** — never investigate multiple design areas in parallel
4. **Subagent boundary** — the **Explore** subagent may be used for read-only discovery only; never delegate design decisions, hypothesis formation, or task decomposition to any subagent
5. **NEVER write implementation code during planning** — planning and implementing are separate phases
6. **NEVER assume — verify by reading files** — hypotheses must be confirmed
7. **ALWAYS get user confirmation before implementing** — the user owns the decision
8. **ALWAYS re-read the plan after the user confirms** — they may have edited it
9. **The plan must be detailed enough that another developer could follow it** without further clarification
10. **NEVER use built-in `ExitPlanMode` or `EnterPlanMode` tools** — this project uses custom `/plan`, `/implement`, `/verify` slash commands; the built-in plan-mode tools are incompatible
11. **For migrations: create the Feature Inventory BEFORE tasks** — list every file, function, and class being replaced; map each to a task; no unmapped features allowed
12. **"Out of Scope" ≠ "Don't implement"** — "Out of Scope: Changes to X" means migrate X as-is (still needs a task); only "Out of Scope: Remove X" means no task is needed (requires user confirmation)
13. **PRD mode: source PRD is canonical** — when answers reveal gaps, update the PRD before generating the plan; never let the plan drift away from the PRD silently
