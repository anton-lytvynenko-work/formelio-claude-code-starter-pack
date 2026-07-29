---
name: project-init
description: Initialize project with stack-specific configuration. Use when user wants to set up repository for a specific technology stack (Node.js, Python, Rust, Go).
allowed-tools: "Read,Write,Edit,Bash(git:*),Glob,Grep"
version: 1.0.0
---

# Project Initialization

Transform the AI-native template repository into a customized project starter.

## Overview

This skill initializes a new project from the template by:
1. Detecting the current project state (preventing re-initialization)
2. Interviewing you about your stack and project details
3. Scaffolding stack-specific configuration files
4. Replacing placeholders in documentation
5. Removing irrelevant hooks
6. Validating the initialization

## Use This Skill When

- You've cloned this template repo and want to customize it for a new project
- You need to scaffold configuration files for Node.js, Python, Rust, or Go
- You want to automatically update documentation with your project details

## Preconditions (When This Skill Will Exit)

This skill will **abort and exit early** if:

- **Already initialized**: README.md has no `{{PROJECT_NAME}}` placeholder (project already customized)
- **Uncommitted changes**: `git status` shows modified files (prevents data loss)
- **Not a git repo**: `.git` directory doesn't exist
- **Wrong directory**: Missing `.claude/`, `docs/`, or `README.md` (not the template repo)

**Rationale**: These checks prevent overwriting existing projects and ensure safe operation.

If the skill exits due to preconditions:
- Review the warning message for details
- Fix the precondition (commit changes, clone template again, etc.)
- Run `/start` again

---

## Instructions

### Invocation context

This skill is invoked by `/implement` as Task 1 ("Scaffold stack") on greenfield projects. By the time it runs:

- `/start` has already filled `{{PROJECT_NAME}}` and `{{PROJECT_DESCRIPTION}}` in README.md, CLAUDE.md, AGENTS.md.
- `/plan` has already chosen the stack as a design question and recorded it in the plan's Tech Stack section.

The skill therefore **does not re-ask** for name, description, or stack. It reads them from the plan and project files. The only thing it may ask for is the runtime version (with a sensible default for the chosen stack).

### Phase 1: Pre-flight Validation

1. Check that stack scaffold is genuinely needed
   - Run: `ls package.json pyproject.toml Cargo.toml go.mod 2>/dev/null`
   - If any exist → stack already scaffolded → Exit
2. Check git status
   - Run: `git status --porcelain`
   - If uncommitted changes → Warn user, ask to proceed
3. Verify template structure
   - Check for: `.claude/`, `docs/`, `README.md`
   - If missing → Error and exit

### Phase 2: Read stack from plan

1. Read the current plan file (path passed by `/implement`) and extract the chosen stack from the "Tech Stack" or "Summary" section. Stack options: Node.js/TypeScript, Node.js/JavaScript, Python, Rust, Go.
2. Read `PROJECT_NAME` and `PROJECT_DESCRIPTION` from the existing CLAUDE.md or README.md (already filled by `/start`).
3. Determine `AUTHOR_NAME` from `git config user.name` (skip if not set).
4. Ask the user **only** for the runtime version, via `AskUserQuestion`, with stack-specific defaults:
   - Node.js: 22 (default), 20, 18, or custom
   - Python: 3.12 (default), 3.11, 3.10, or custom
   - Rust/Go: auto-detect latest, no question needed

### Phase 3: Template Generation

1. Copy stack templates from `.claude/skills/project-init/templates/{{STACK}}/`
2. Replace placeholders (note: name/description are already substituted by /start; this phase fills only stack-related ones):
   - `{{PROJECT_NAME}}` → from CLAUDE.md (already filled, used here only for new stack files)
   - `{{PROJECT_DESCRIPTION}}` → from CLAUDE.md
   - `{{RUNTIME_VERSION}}` → chosen runtime
   - `{{AUTHOR_NAME}}` → git config user.name (skip if absent)

3. Handle stack-specific files:
   - **Node.js**: package.json, tsconfig.json, .eslintrc.json
   - **Python**: pyproject.toml, .python-version
   - **Rust**: Cargo.toml
   - **Go**: go.mod

### Phase 4: Update .gitignore

Append stack-specific entries:

```
# Node.js
node_modules/
dist/
.env

# Python
__pycache__/
*.pyc
.venv/
.pytest_cache/

# Rust
target/

# Go
vendor/
```

### Phase 5: Hook Pruning

1. Read hook mappings from `references/hook-mappings.md`
2. Keep universal hooks (all stacks):
   - block-hardcoded-secrets
   - warn-debug-code

3. Keep stack-specific hooks:
   - **Node.js/TypeScript**: + warn-foreach, block-as-any
   - **Python/Rust/Go**: Universal only

4. Delete irrelevant hooks from `.claude/hooks/`
5. Update `.claude/hooks/README.md` to remove deleted entries

### Phase 6: Documentation Updates

Update these files (replace placeholders):

**README.md**:
```markdown
# {{PROJECT_TITLE}}

{{PROJECT_DESCRIPTION}}
```

**CLAUDE.md** - Add Essential Commands section with:
- Install: `{{INSTALL_COMMAND}}`
- Dev: `{{DEV_COMMAND}}`
- Test: `{{TEST_COMMAND}}`
- Lint: `{{LINT_COMMAND}}`
- Build: `{{BUILD_COMMAND}}`

**AGENTS.md**:
```markdown
This repository contains {{PROJECT_NAME}}: {{PROJECT_DESCRIPTION}}
```

**docs/setup.md** - Fill in TODOs:
- Runtime: `{{RUNTIME_VERSION}}`
- Package manager: `{{PACKAGE_MANAGER}}`
- Commands: Install, Run, Test, Lint

**docs/architecture.md** - Fill in TODOs:
- Summary: `{{PROJECT_DESCRIPTION}}`
- Stack: `{{STACK}}`

### Phase 7: Cleanup

1. Delete `.gitkeep` files from `src/`, `content/`, `tasks/`
2. Remove "Using This As a Template" section from README.md

### Phase 7.5: Generate `.claude/rules/custom/project.md`

Create the project-facts file that lives alongside the generic rules. Convention: project-specific rules go in `.claude/rules/custom/`; generic rules stay in `.claude/rules/`.

1. **Skip if file exists.** If `.claude/rules/custom/project.md` already exists, do nothing — user may have hand-written content.
2. Otherwise, write a file using the substituted real values from Phase 2/3 (not `{{X}}` literals — Phase 6 has already done substitution by now):

   ```markdown
   # Project: <real PROJECT_NAME>

   **Last Updated:** <today YYYY-MM-DD>

   ## Overview

   <real PROJECT_DESCRIPTION>

   ## Technology Stack

   - **Language / Stack:** <real STACK>
   - **Runtime:** <real RUNTIME_VERSION>
   - **Package Manager:** <real PACKAGE_MANAGER>

   ## Development Commands

   - **Install:** `<real INSTALL_COMMAND>`
   - **Dev:** `<real DEV_COMMAND>`
   - **Test:** `<real TEST_COMMAND>`
   - **Lint:** `<real LINT_COMMAND>`
   - **Build:** `<real BUILD_COMMAND>`

   ## Directory Structure

   <output of `tree -L 2 -I 'node_modules|.git|dist|build|.venv|__pycache__'`, falling back to `ls -1` if `tree` is unavailable>

   ## Architecture Notes

   _TBD — fill in once architectural decisions stabilise._

   ## Additional Context

   _TBD — domain terminology, external services, project-specific constraints._
   ```

### Phase 7.6: Auto-document MCP servers

Generate `.claude/rules/custom/mcp-tools.md` describing the MCP servers configured for this project. This helps the AI assistant know what tools are available and when to reach for each.

1. **Check for `.mcp.json` at project root.** If absent, skip silently.
2. **Skip if `.claude/rules/custom/mcp-tools.md` already exists** — don't overwrite or append duplicates. To regenerate, the user can delete the file and rerun.
3. Read and parse `.mcp.json`. For each `mcpServers` entry, emit a section. Generated structure:

   ```markdown
   # Project MCP Servers

   This project's `.mcp.json` configures the following servers. Generated by `/start`; edit the "When to use" notes per server.

   ## <server-name>

   **Command:** `<command from JSON>`
   **Args:** `<args from JSON>`

   **When to use:** _TBD — describe what tools this server exposes and when the AI should reach for it._

   **Example usage:**
   ```
   mcp__<server-name>__<tool_name>(param="value")
   ```

   ---

   <repeat per server>
   ```

4. If `.mcp.json` parses but contains zero servers, skip generation entirely (no useful content to write).

### Phase 8: Validation

Run validation script:
```bash
python .claude/skills/project-init/scripts/validate_config.py
```

Checks:
- No unreplaced `{{VARIABLE}}` placeholders
- JSON files valid (package.json, .eslintrc.json)
- TOML files valid (pyproject.toml, Cargo.toml)
- .gitignore updated with stack entries

If validation fails → Show errors and exit
If validation passes → Continue to install prompt.

### Phase 8.5: Run install command (optional)

After validation succeeds, offer to run the install command so the project is ready to run.

1. Use `AskUserQuestion`:
   - **Question:** "Run `<INSTALL_COMMAND>` now to install dependencies?"
   - **Options:**
     - `Yes, run install` (recommended) — execute the install command via Bash, surface output
     - `Skip, I'll run it later` — proceed to summary without installing
2. If user picks "Yes, run install":
   - Execute the substituted install command via Bash.
   - Show the output. If it fails, surface the error but **do not abort initialization** — config is already valid, install can be retried manually.
3. If user picks "Skip", continue to summary. The summary's Next Steps will retain the install command as a manual reminder.

### Phase 9: Summary & Next Steps

Output:
```
✅ Project Initialized: {{PROJECT_NAME}}

📋 Stack: {{STACK}}
📋 Runtime: {{RUNTIME_VERSION}}
📋 Package Manager: {{PACKAGE_MANAGER}}

📝 Files Created:
  - Stack-specific configs (package.json, pyproject.toml, etc.)
  - .env.example
  - .claude/rules/custom/project.md (skipped if already existed)
  - .claude/rules/custom/mcp-tools.md (skipped if no .mcp.json or already existed)

📄 Files Updated:
  - README.md, CLAUDE.md, AGENTS.md
  - docs/setup.md, docs/architecture.md
  - .gitignore

🧹 Hooks Pruned:
  - warn-foreach (if not Node.js)
  - block-as-any (if not Node.js)
  [other stack-specific removals]

## Next Steps:

1. Review changes: git diff
2. Install dependencies: {{INSTALL_COMMAND}}   ← skip if already run in Phase 8.5
3. Run tests: {{TEST_COMMAND}}
4. Commit: git add -A && git commit -m "chore: initialize {{PROJECT_NAME}}"   ← skip if already done in Phase 9.5
5. Start coding with /task-planner and /git-commit

Happy coding! 🚀
```

### Phase 9.5: Create initial commit (optional)

After the summary, offer to create the initial commit so the user has a clean baseline.

1. Use `AskUserQuestion`:
   - **Question:** "Create initial commit with this scaffolding?"
   - **Options:**
     - `Yes, commit` — run `git add -A && git commit -m "chore: initialize <PROJECT_NAME>"`, then show `git log -1 --stat`
     - `No, I'll review and commit manually` — print the suggested commands as a reminder
2. The skill already requires a git repo (Phase 1 precondition), so no edge case for non-git directories.
3. Do not push — the user owns remote operations.

---

## References

- **Placeholder Guide**: `references/placeholder-guide.md`
- **Hook Mappings**: `references/hook-mappings.md`
- **Stack Templates**: `templates/{stack}/`
- **Validation**: `scripts/validate_config.py`

## Rollback

If initialization fails:
```bash
git restore .        # Undo all changes
git clean -fd        # Remove new files
git status           # Verify clean state
```
