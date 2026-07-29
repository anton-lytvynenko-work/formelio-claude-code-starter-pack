---
description: Define what you're building — invokes prd-creator to produce structured PRDs
model: opus
---

# DEFINE: PRD Creation

`/define` is the second step in the `/start → /define → /plan → /implement → /verify` workflow. It produces one or more PRDs in `docs/prds/` that become the source of truth for `/plan`.

## When to use

- After `/start`, before `/plan` — to clarify what you're building before any tech choices.
- When adding a new feature area to an existing project that already has PRDs.
- When a stakeholder asks "what should this thing actually do?"

## When NOT to use

- For a single-file bug fix or a refactor with no new behavior — skip straight to `/plan`.
- When a PRD already covers the work — just run `/plan`, it auto-detects.

## Pre-flight: codebase grounding

Before invoking `prd-creator`, decide whether to attach an existing-code context.

1. **Detect existing code.** `Glob("src/**/*")` and count non-template files. Treat the project as **existing** if there are 5+ files OR any file does not contain a `{{...}}` placeholder. Otherwise treat as **greenfield** and skip the rest of this section.

2. **Confirm the topic.** If the user's `/define` prompt already names the area (e.g. "/define a PRD for the qualification runner"), use it. Otherwise ask one short `AskUserQuestion`: "What area is this PRD about?" — single text input.

3. **Run a focused exploration.** Spawn an `Explore` subagent with:

   > Produce a `## Existing code context` markdown section (≤400 words) for an upcoming PRD on **<topic>**. Cover only what's relevant to the topic: existing modules/services, naming conventions used, key data structures, integration points, anything a PRD author should know not to reinvent. Cite file paths (and line numbers where useful) as `src/foo/bar.ts:42`. Do **not** propose changes — describe what exists. Output the markdown only, starting with the `## Existing code context` heading.

4. **Hand off to prd-creator.** Pass the returned markdown verbatim. `prd-creator` knows to (a) use it when phrasing clarifying questions and (b) embed it as the `## Existing code context` section in the written PRD. See `.claude/skills/prd-creator/SKILL.md` § "Existing code context".

If exploration finds nothing meaningful (very small repo, unrelated topic), don't force-include the section — pass an empty context and let `prd-creator` proceed as greenfield.

## What this does

Invokes the `prd-creator` skill, which:

1. **Reads context**: existing PRDs in `docs/prds/`, `docs/architecture.md`, `.claude/rules/custom/project.md`, plus any URLs or files you pass.
2. **Asks 2 rounds of clarifying questions** via `AskUserQuestion`:
   - **Round 1 (core)**: what is the product/feature and what problem does it solve? Who are the user types? What are the hard constraints? What's in scope, what's out? What references exist?
   - **Round 2 (follow-up, only if needed)**: clarifies ambiguities from references, confirms scope boundaries.
3. **Proposes the structure** — standalone PRD vs master plan + child PRDs — and **waits for approval** before writing.
4. **Writes the PRD(s)** to `docs/prds/<N>-prd-<slug>.md` or `docs/prds/<N>-master-plan-<slug>.md` + `<N>.<M>-prd-<slug>.md` for sub-areas.
5. **Tells you the next step**: review the PRDs, resolve open questions, then `/plan`.

See `.claude/skills/prd-creator/SKILL.md` for the full skill spec (v2.0).

## After /define

Run `/plan` — it auto-detects PRDs in `docs/prds/` and runs in PRD-driven mode. The first design question `/plan` asks is the stack choice, informed by what the PRD describes.

## Critical rules

1. **Don't skip the questions.** The prd-creator skill is designed to extract clarity; answering questions thoughtfully is the value.
2. **Don't write implementation detail in PRDs.** Data model fields, API specs, tech-stack decisions belong in architecture or the implementation plan, not the PRD.
3. **Existing master plans are stable.** New PRDs become standalone or new master plans, not children of existing ones, unless the user explicitly asks.
