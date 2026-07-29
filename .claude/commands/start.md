---
description: Lightweight project bootstrap — name, design-system. No stack choice yet.
model: opus
---

# START: Lightweight Project Bootstrap

`/start` is the first step in the `/start → /define → /plan → /implement → /verify` workflow. It sets up project identity and the design system. **It does NOT pick a tech stack or generate `package.json`** — that happens in `/implement` once the PRD and plan are written.

## When to use

- You just `cp -r ~/Downloads/formelio-claude-code-pack ~/dev/<new-project>` and want to customize it.
- The repo still contains `{{PROJECT_NAME}}` placeholders (not yet initialized).

## Will exit early if

- README.md no longer contains `{{PROJECT_NAME}}` placeholder (already initialized) → exit
- Uncommitted changes present → warn user, ask to proceed
- `.claude/`, `docs/`, or `README.md` missing → not the starter, exit

If exited: review the warning, fix the precondition (commit changes, re-clone starter), run `/start` again.

---

## Phase 1: Pre-flight

1. **Already initialized?** `Grep("{{PROJECT_NAME}}", "README.md")` → if no match, project already initialized, exit.
2. **Git status clean?** `git status --porcelain` → if uncommitted, warn and ask to proceed via `AskUserQuestion`.
3. **Template structure intact?** Verify `.claude/`, `docs/`, `hinq-zno-design-system/` all exist. If not, exit.

## Phase 2: Project metadata

Use `AskUserQuestion`. Group questions — don't ask one at a time.

1. **Project name** (text input) — kebab-case, validated against `^[a-z][a-z0-9-]*$`, 3–50 chars, no consecutive hyphens. Reject invalid input with a clear error and re-ask.
2. **One-line description** (text input) — what is this project, in one sentence.

## Phase 3: Install the per-project README and fill placeholders

The starter's root `README.md` is a comprehensive doc *about the starter pack*. Once a project starts, that README is no longer relevant — replace it with the per-project template:

```bash
cp .claude/skills/project-init/templates/README.template.md README.md
```

Then substitute `{{PROJECT_NAME}}` and `{{PROJECT_DESCRIPTION}}` in:

- `README.md` (the new per-project one)
- `CLAUDE.md`
- `AGENTS.md`

Leave stack-related placeholders (`{{STACK}}`, `{{RUNTIME_VERSION}}`, `{{INSTALL_COMMAND}}`, `{{DEV_COMMAND}}`, `{{TEST_COMMAND}}`, `{{LINT_COMMAND}}`, `{{BUILD_COMMAND}}`, `{{PACKAGE_MANAGER}}`, `{{AUTHOR_NAME}}`) intact — they will be filled by `/implement`'s scaffold step.

For `docs/setup.md` and `docs/architecture.md`: fill name/description, leave stack TODOs.

## Phase 4: Summary

Output:

```
✅ Starter initialized: <PROJECT_NAME>

Design system: hinq-zno-design-system/ (always present, 2.9 MB; remove if not a HINQ project)

Next step:
  /define   ← write your PRD — clarifies what you're building before tech choices
```

## Critical rules

1. **Do not pick a stack.** Stack is a `/plan` design question; scaffolding happens in `/implement`.
2. **Do not run any package manager** (`npm install`, `pip install`, etc.). No code dependencies are appropriate yet.
3. **Do not commit.** The user controls all git operations.
4. **If the user has already run `/start` and asks to "re-init"**, treat as exit; re-init is not supported (they should re-`cp -r` the starter into a fresh location).
