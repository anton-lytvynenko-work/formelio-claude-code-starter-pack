---
name: skill-updater
description: Analyse the current session for learnings, gotchas, and patterns that should improve existing skills or justify new ones. Also tracks skill usage frequency and quality. Run before clearing context at the end of a PRD or major feature session.
version: 2.0.0
---

# Skill Updater + Tracker

Analyse a completed session, extract actionable improvements to skills and agent docs, track skill usage, and self-improve — so every future session benefits from what was learned today.

---

## When to Use

Run this before `/clear` at the end of any PRD, feature, or debugging session.

---

## Instructions

### Step 0: Read the Usage Log

Before doing anything else, read the existing usage log to understand which skills have been firing and how well:

```
Read(".claude/skills/skill-updater/usage.log")   # may not exist yet — that's fine
```

If the file doesn't exist, create it:

```
Write(".claude/skills/skill-updater/usage.log", "# Skill Usage Log\n# date | skill | outcome | notes\n")
```

---

### Step 1: Inventory Existing Skills and Docs

Discover all skills and agent docs currently in the project:

```
Glob(".claude/skills/*/SKILL.md")
Glob(".claude/skills/*/skill.md")
Glob(".claude/agent_docs/*.md")
```

Read each file. Build a mental map of:
- What each skill covers
- What anti-patterns are documented
- What workflow triggers exist
- Which skills overlap or could conflict

> **Note:** Include `skill-updater` itself in this inventory — it is a candidate for self-improvement.

---

### Step 2: Identify Skills Used This Session

Review the current conversation and identify every skill that was invoked (explicitly or implicitly). For each one, classify the outcome:

| Outcome | Meaning |
|---------|---------|
| ✅ Worked well | Skill fired correctly, output was useful, no corrections needed |
| ⚠️ Partial | Skill fired but output needed significant user correction |
| ❌ Missed | Skill should have fired but didn't, or fired and produced wrong output |
| 🔁 Not triggered | Skill exists but wasn't relevant this session |

If a skill was not explicitly invoked but you infer it was used (e.g. `git-commit` was used during the session), include it.

---

### Step 3: Append to Usage Log

For each skill used this session, append one line to `.claude/skills/skill-updater/usage.log`:

```
YYYY-MM-DD | <skill-name> | <outcome: worked/partial/missed> | <one-line note>
```

Example entries:
```
2026-04-08 | code-review          | worked  | Caught console.log left in feature branch
2026-04-08 | task-planner         | partial | Missed edge case — caught manually after review
2026-04-08 | git-commit           | worked  | —
2026-04-08 | debug-fresh          | missed  | Agent looped 4 times before user suggested fresh session
```

---

### Step 4: Extract Session Learnings

Review the full conversation for improvable patterns:

| Category | What to Look For |
|----------|-----------------|
| **Gotchas** | Errors that took multiple attempts to fix, unexpected framework behaviour, API quirks |
| **Missing guidance** | Things the agent got wrong that a skill rule would have prevented |
| **Repeated patterns** | Code or workflows that appeared 2+ times and could be templated |
| **UX/copy gaps** | User confusion that better instructions would have prevented |
| **New skill candidates** | Distinct workflows that don't fit any existing skill |
| **Tool/MCP gaps** | Tools or MCPs that were configured this session but not actually used — indicates a workflow gap |
| **Tool/workflow coexistence** | Two systems trying to govern the same action (e.g. a skill and built-in plan mode, multiple planning commands, overlapping MCPs). Look for turns where the user had to reconcile conflicting instructions or correct placement of files the agent wrote to the wrong location |
| **skill-updater gaps** | Did skill-updater itself miss something this session? Was any output rejected? |

**Exit condition:** If fewer than 2 distinct learnings are found across all categories, state: *"No significant learnings to capture this session."* Output the usage log update only and stop.

---

### Step 5: Classify Each Learning

For each learning, decide:

**→ Update existing skill** if it fits the scope of an existing skill. Examples:
- A reusable code-review pattern → `code-review`
- A new debugging heuristic → `debug-fresh`
- A missed trigger condition → the relevant skill's "When to Use" section

**→ Update skill-updater itself** if:
- You missed a category of learning
- The output format was confusing to the user
- A confidence rubric would have helped
- The usage log format needs adjustment

*(max 1 self-improvement proposal per session — choose the most impactful one)*

**→ Create new skill** only if ALL of these are true:
- The workflow is distinct and self-contained
- It will trigger at least once per PRD or feature session
- It has clear, writable steps
- It does not substantially overlap with an existing skill

**→ Skip** if: project-specific one-off, already documented, or too narrow to generalise.

---

### Step 6: Confidence Rubric for New Skills

When proposing a new skill, assign confidence using this rubric:

| Confidence | Criteria |
|------------|----------|
| **High** | Pattern appeared 3+ times this session OR across multiple past sessions visible in usage.log; steps are clear; trigger is unambiguous |
| **Medium** | Pattern appeared 1–2 times; steps are mostly clear; trigger has some ambiguity |
| **Low** | Intuition only; single occurrence; steps unclear; could be absorbed into existing skill |

Only propose **High** or **Medium** confidence skills. Log **Low** confidence candidates in a `## Deferred Candidates` section at the bottom of the analysis — revisit after 2+ more sessions.

---

### Step 6b: Summarise Usage Health

Read the last 30 entries from `usage.log` and identify:
- Most-used skill over that period
- Any skill with 2+ consecutive `missed` or `partial` outcomes (needs attention)
- Any skill with 0 uses in the last 10 sessions (candidate for deprecation)

This feeds the `### Usage Health Summary` section in Step 7's output.

---

### Step 6c: Reconcile and Auto-Update CLAUDE.md

CLAUDE.md is loaded into every conversation. Stale content means the agent starts with a wrong inventory. Check for drift and **propose concrete edits**:

1. Read `CLAUDE.md`
2. Compare its **Skills table** against the skills discovered in Step 1 (`Glob(".claude/skills/*/SKILL.md")`). Each skill should have a row.
   - For each missing skill: read its SKILL.md `description` field and draft a new table row: `| \`skill-name\` | description |`
   - For each stale skill (in table but no SKILL.md on disk): mark for removal
3. Compare its **Architecture tree** against actual top-level dirs (check for `docs/audits/`, `docs/plans/`, or any new top-level dir that's missing).
4. Compare its **Hooks table** against `.claude/hooks/*.md` (excluding README.md).
5. Compare its **Agent Docs table** against `.claude/agent_docs/*.md` (excluding README.md).
6. If any drift found, add a `### CLAUDE.md Updates` section to the Step 7 output listing the **exact edits** to apply (add/remove rows).
7. If no drift, omit the section.

These CLAUDE.md edits go through the same approval flow as any other proposed update (Step 8). Once approved, apply them directly using the Edit tool — add missing rows to the appropriate table, remove stale rows. This ensures CLAUDE.md stays in sync with the actual skill/hook/doc inventory after every session.

---

### Step 7: Output the Analysis

Report findings in this format:

```markdown
## Session Learnings Analysis
**Date:** YYYY-MM-DD
**Skills used this session:** [list]

---

### Usage Log Update
Appended N entries to `.claude/skills/skill-updater/usage.log`.

---

### Updates to Existing Skills/Docs

| # | File | Change | Reason |
|---|------|--------|--------|
| 1 | `.claude/agent_docs/anti-patterns.md` | Add X pattern | Agent hit this error N times |
| 2 | `.claude/skills/foo/SKILL.md` | Add Step Y to Step 3 | User was confused about Z |

---

### New Skills Proposed

| # | Skill Name | Purpose | Trigger | Confidence |
|---|------------|---------|---------|------------|
| 3 | `foo-bar` | One-line description | When user does X | High |

---

### Skill-Updater Self-Improvements

| # | Change | Reason |
|---|--------|--------|
| 4 | Add confidence rubric to Step 5 | Proposed 3 skills last session, user approved 0 |

---

### Skipped Learnings

| Learning | Why Skipped |
|----------|-------------|
| X | Too project-specific |

---

### Deferred Candidates (Low Confidence)

| Skill | Why Deferred | Revisit After |
|-------|-------------|---------------|
| Y | Single occurrence, unclear steps | 2 more sessions |

---

### Usage Health Summary

[Filled from Step 6b findings]

---

### CLAUDE.md Updates (if any)

| Section | Expected | Actual | Fix |
|---------|----------|--------|-----|
| Skills table | N skills | M listed | Add X missing |

*(Omit this section entirely if no drift detected.)*

---

### Recommended Next Action

[One sentence — e.g. "Apply 2 updates and self-improve skill-updater's confidence rubric before clearing context."]
```

---

### Step 8: Get Approval

After outputting the analysis, **stop and ask the user**:

> "Should I apply these changes? Approve all, pick by number, or say no to skip."

Do not modify any files until the user explicitly confirms. Apply only what is approved.

---

### Step 9: Apply Changes and Confirm

For each approved update to an existing skill:
1. Read the target file
2. Edit or append — keep changes minimal and scannable
3. No padding or filler text

For each approved new skill, create `.claude/skills/<name>/SKILL.md` with this frontmatter:

```
---
name: <name>
description: <one line>
allowed-tools: Read,Write,Edit,Bash,Glob,Grep
version: 1.0.0
---
```

For each approved self-improvement to skill-updater:
- Read `.claude/skills/skill-updater/SKILL.md`
- Apply the edit — same approval/apply flow as any other skill

After all changes are applied, output:

```
## Changes Applied

Files modified: [list]
Files created: [list]
Usage log updated: .claude/skills/skill-updater/usage.log (+N entries)

Suggested commit:
git add .claude/skills/ .claude/agent_docs/ && git commit -m "chore(skills): session learnings YYYY-MM-DD"
```

---

## Usage Log Format Reference

The log lives at `.claude/skills/skill-updater/usage.log`. It is append-only. Format:

```
# Skill Usage Log
# date | skill | outcome | notes
2026-04-08 | code-review          | worked  | Flagged anti-pattern before commit
2026-04-08 | task-planner         | partial | Missed edge case, caught manually
2026-04-08 | skill-updater        | worked  | Self-improvement: added confidence rubric
```

**Outcomes:** `worked` / `partial` / `missed`

Do not edit past entries. Append only.

---

## Self-Improvement Principles

skill-updater improves itself by:

1. **Tracking its own proposal approval rate.** If proposals are repeatedly rejected, the bar is too low — tighten classification criteria.
2. **Noticing missed categories.** If the user points out a learning that skill-updater didn't surface, that's a gap in Step 4's category table.
3. **One self-improvement proposal per session maximum.** Avoid recursion paralysis.
4. **Never rewriting itself wholesale.** Apply minimal targeted edits, same as any other skill.

---

## Skill Deprecation Policy

If the usage log shows a skill has 0 uses across the last 10 sessions, propose it for deprecation in the analysis. Options:

- **Archive** — move to `.claude/skills/_archived/`
- **Merge** — fold its rules into a related skill
- **Keep** — if it's a safety net that rarely triggers but matters when it does (e.g. `debug-fresh`)

Do not delete skills without explicit user approval.
