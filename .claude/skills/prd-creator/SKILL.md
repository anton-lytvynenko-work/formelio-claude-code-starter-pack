---
name: prd-creator
description: >
  Creates structured, high-quality Product Requirements Documents (PRDs) as linked markdown files
  in docs/prds/. For a single feature with no sub-areas: one standalone PRD. For a complex feature
  with sub-areas: a master plan plus one child PRD per sub-area, cross-referenced. These PRDs feed
  directly into the /plan command (which auto-detects source PRDs and runs in PRD-driven mode) for
  implementation planning.
  Trigger on: "write a PRD for...", "create product requirements for...", "I want to spec out...",
  "help me document what we're building", "create a product spec", "write requirements for my project",
  "I need a PRD", or when the user has described a product and wants to turn it into buildable documentation.
allowed-tools: Read,Write,Edit,Bash,Glob,Grep,AskUserQuestion,WebFetch
version: 2.0.0
---

# PRD Creator

Creates PRD files in `docs/prds/` that feed directly into the `/plan` command (which auto-detects them and runs in PRD-driven mode).

## Document types and naming

The `docs/prds/` folder holds two kinds of documents — a single naming convention encodes which is which:

| Type | Filename pattern | Header pattern | Example |
|---|---|---|---|
| Master plan | `<N>-master-plan-<slug>.md` | `# Master plan <N>: <Title>` | `2-master-plan-multitrack-qualification.md` |
| PRD under a master plan | `<M.N>-prd-<slug>.md` | `# PRD <M.N>: <Title>` | `2.1-prd-new-qualification-flow-ui.md` |
| Standalone PRD (no master plan) | `<N>-prd-<slug>.md` | `# PRD <N>: <Title>` | `3-prd-some-feature.md` |

**Numbering rules:**
- Numbers are global. Master plans and standalone PRDs share one sequence (1, 2, 3, …).
- Child PRDs of master plan `M` are numbered `M.1`, `M.2`, `M.3`, …
- The next number for a new master plan or standalone PRD is `max(existing top-level numbers) + 1`.
- Existing master plans (e.g. master plan 1, master plan 2) are stable. New PRDs created by this skill never become children of an existing master plan unless the user explicitly asks.

**Scaling rule:**
- **Single feature, no sub-areas** → one standalone PRD (e.g. `3-prd-foo.md`)
- **Complex feature with sub-areas** → new master plan + child PRDs (e.g. `4-master-plan-foo.md` + `4.1-prd-...md`, `4.2-prd-...md`)

The output should be precise enough to build from, but not so technical that it crosses into architecture or implementation territory.

---

## Phase 1: Understand before writing

Before writing a single word of PRD content, gather enough context to define the right structure.

**Step 1a: Read existing context**

```
Glob("docs/prds/*.md")                  # Existing master plans and PRDs
Read("docs/architecture.md")            # Architecture context
Read(".claude/rules/custom/project.md") # Project overview (if exists)
```

If the user has provided a URL or reference document — **read it before asking questions**. Use available tools (WebFetch, Read, Glob) to pull in that context first.

**Step 1b: Extract from conversation context if available:**
- What the product does and who it's for
- What it replaces or improves on (legacy system, manual process, competitor)
- Any constraints already stated (tech stack, integrations, regulatory requirements)
- Any existing documents linked or pasted

**Step 1c: Ask the user for anything still missing**

Use `AskUserQuestion` to gather missing context. Group questions — don't ask one at a time. Ask at most 2 rounds before proposing structure.

Round 1 — Core questions (ask all at once):
1. What is the product/feature and what problem does it solve? Who are the main user types?
2. What are the hard constraints? (e.g. must use specific auth, data standard, integrations)
3. What is in scope for this PRD? What is explicitly out of scope?
4. What references exist? (legacy code, architecture doc, design files, URLs)

Round 2 — Follow-up (only if needed after reading references):
- Clarify ambiguities from the reference material
- Confirm assumptions about scope boundaries

**Do NOT ask about:**
- Tech stack choices (belongs in architecture doc)
- Data model specifics (belongs in architecture/SRS)
- Non-functional requirements in detail (belongs in SRS)
- Anything answerable from context already in the conversation or project files

**Step 1d: Existing code context (only when provided by `/define`)**

If the invoking command (typically `/define`) ran a codebase-grounding step and passed an `## Existing code context` markdown block, treat it as authoritative input:

- **Use it to phrase Round-1 questions.** Reference real symbols and paths instead of asking generically. Example: instead of "is there an existing auth flow?", ask "your `AuthService` at `src/auth/auth.service.ts:42` handles JWT — is this PRD extending it or replacing it?"
- **Embed it verbatim in the written PRD.** Place the heading-and-body block after `## Constraints` and before the first feature section. Do not edit the content — `/plan` reads it as the canonical "what already exists" snapshot for this PRD.
- **If no block was passed,** proceed as greenfield — do not invent one.

---

## Phase 2: Propose the structure before writing

Once you have enough context, **decide the complexity level and propose the structure**.

### Deciding: standalone PRD vs master plan + child PRDs

| Signal | Standalone PRD | Master plan + child PRDs |
|--------|----------------|--------------------------|
| Sub-areas | 1 cohesive scope | 3+ distinct sub-areas |
| Distinct user journeys inside the feature | 1 | 3+ |
| Total requirements (estimate) | < 30 | 30+ |
| Phasing dependencies between sub-areas | None | Clear A → B → C ordering |
| Independent shippability of sub-areas | Single ship | Sub-areas can ship independently |

When in doubt, start with a standalone PRD. It can always be split later.

### Determine the next number

Before proposing a name, look at existing top-level numbers in `docs/prds/`:

```
Glob("docs/prds/*.md")
```

Identify the highest top-level integer (master plans and standalone PRDs both occupy this sequence). The new top-level number is `that + 1`.

### Present the proposed structure

Use `AskUserQuestion` to present your recommendation:

**For a standalone PRD:**
> "This is a single feature with no sub-areas. I'll create `<N>-prd-<slug>.md` covering [list of sections]. Sound right?"

**For a master plan + child PRDs:**
> "This feature has enough complexity for a master plan + [N] child PRDs:
> - Master plan <N>: [name] — [one-line description]
>   - PRD <N>.1: [name] — [one-line description]
>   - PRD <N>.2: [name] — [one-line description]
>   - ...
> Does this structure look right, or do you want to split/merge/add anything?"

Wait for confirmation. Do not start writing until the user approves.

**How to decide what gets its own PRD:**
- One PRD per major sub-area or user journey — not per screen, not per API endpoint
- If a sub-area is simple (2–3 requirements), fold it into the closest sibling PRD
- If a sub-area is highly complex or has its own distinct user group, it deserves its own PRD

---

## Phase 3: Write the PRDs

Ensure the output directory exists, then write all files.

```bash
mkdir -p docs/prds
```

### Standalone PRD (`docs/prds/<N>-prd-<slug>.md`)

```markdown
# PRD <N>: [Feature Name]

**Product:** [Product name]
**Status:** Draft

## Goal
One paragraph. What this feature enables and for whom.

## Target group
Which user type(s) use this. Name and one-sentence description for each.

## Constraints
Hard constraints: integrations, standards, regulatory requirements, explicit non-goals.

## Existing code context
*(Only present when `/define` ran codebase grounding. Embed verbatim from the `/define` pre-flight output — do not paraphrase. Omit this entire section in greenfield projects.)*

## [Feature sections]
Use headings that match the natural breakdown of the feature.
For flows: describe each step.
For management UIs: describe each capability area.

Under each section, list requirements as plain English bullets.
Each requirement starts with "The system must..." or "The user must be able to..."
No implementation detail. No data model fields. No API specs.

## What changes vs [legacy system] (if applicable)
A comparison table: old behaviour | new behaviour.
Only include if there is a meaningful legacy system to compare against.

## Open Questions
Explicit unknowns that block or affect implementation.
Mark blockers clearly: **[BLOCKS IMPLEMENTATION]**
```

### Master plan (`docs/prds/<N>-master-plan-<slug>.md`)

Only create this when there are 3+ child PRDs (per Phase 2). The master plan covers:

- What the feature is, in plain language (2–3 sentences)
- Why it's being built now / what problem it solves
- Who it's for (target groups / user types) — names and one-sentence descriptions only
- Key constraints (integrations, standards, regulatory requirements, explicit non-goals)
- A table linking to all child PRDs with status
- Phasing — recommended ship order with reasoning
- Cross-cutting decisions that apply to all child PRDs (so they don't get re-litigated in each)
- Legacy reference note (if replacing something — what to carry over, what to redesign)

Keep it short. **No functional requirements here** — those belong in the child PRDs.

```markdown
# Master plan <N>: [Feature Name]

**Product:** [Product name]
**Status:** Draft
**Related master plans:** [Master plan <X>: <Title>](<X>-master-plan-<slug>.md) (if any)
**Related PRDs:** [PRD <Y.Z>: <Title>](<Y.Z>-prd-<slug>.md) (if any cross-master-plan dependencies)

[Sections per the bullets above]

## Child PRDs

| # | PRD | Scope |
|---|---|---|
| PRD <N>.1 | [Title](<N>.1-prd-<slug>.md) | One-line scope |
| PRD <N>.2 | [Title](<N>.2-prd-<slug>.md) | One-line scope |
```

### Child PRDs (`docs/prds/<N>.<M>-prd-<slug>.md`)

Each child PRD must link back to its master plan at the top.

```markdown
# PRD <N>.<M>: [Feature Name]

**Product:** [Product name]
**Feature area:** [Short label]
**Status:** Draft
**Master plan:** [Master plan <N>: <Title>](<N>-master-plan-<slug>.md)
**Related PRDs:** [PRD <N>.<X>: <Title>](<N>.<X>-prd-<slug>.md) (siblings or cross-master-plan dependencies)

## Goal
One paragraph. What this child PRD enables and for whom.

## Target group
Which user type(s) use this. Often "same as master plan <N>".

## [Feature sections]
Use headings that match the natural breakdown of the sub-area.
Under each section, list requirements as plain English bullets.
Each requirement starts with "The system must..." or "The user must be able to..."

## What changes vs [legacy system] (if applicable)
old behaviour | new behaviour comparison table.

## Open Questions
Mark blockers clearly: **[BLOCKS IMPLEMENTATION]**
```

---

## Quality rules — apply to every PRD and master plan

**DO:**
- Write requirements as plain English functional statements
- Include a "What changes vs X" table if replacing a legacy system
- Mark open questions clearly, especially implementation blockers
- Keep language product-level — what it does, not how it does it
- Use real names, IDs, and terminology from the domain
- Make the goal and target group explicit at the top of every PRD
- Cross-reference related master plans and PRDs with relative markdown links
- In prose, refer to other PRDs as `PRD <M.N>` (with a space, not a hyphen) — e.g. `PRD 1.3`, `PRD 2.1`
- In prose, refer to master plans as `Master plan <N>` — e.g. `Master plan 2`

**DO NOT:**
- Include data model field lists or entity relationship details (-> architecture/SRS)
- Include API endpoint specs or payload formats (-> SRS)
- Include non-functional requirements in detail: performance, security, test coverage (-> SRS)
- Include tech stack decisions (-> architecture)
- Write requirements as user stories with acceptance criteria (unless user explicitly asks)
- Include code patterns or implementation hints
- Pad with generic statements that apply to any software product
- Add a child PRD to an existing master plan unless the user explicitly asks

---

## Phase 4: After writing

Once all files are written:

1. List all created files with their paths
2. Give a brief summary of what each file covers
3. Flag any open questions that need resolution before development starts
4. Tell the user their next step:

```
PRDs written to docs/prds/. Next steps:
  1. Review the PRDs and resolve any open questions
  2. Run /plan to generate implementation plans (auto-detects the PRD)
  3. Run /implement to execute the plans
```

5. Offer to refine any specific PRD if the user wants to adjust scope or depth

---

## Integration with other skills

| Skill / command | Relationship |
|-----------------|-------------|
| `/plan` command | Auto-detects PRDs in `docs/prds/` and runs in PRD-driven mode (pre-flight questions, requirement traceability, coverage check). Master plans are not directly plannable — they orchestrate child PRDs. |
| `/implement` | Executes plans generated from PRDs |
| `task-planner` | Can break down individual PRD features into checkbox tasks |
