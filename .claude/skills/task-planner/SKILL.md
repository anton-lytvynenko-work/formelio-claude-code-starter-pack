---
name: task-planner
description: Break down tickets or requirements into actionable task checklists. Use when user wants to plan a feature, start a new task, or decompose work before coding.
allowed-tools: "Read,Write,Bash(git:*),Grep,Glob"
version: 1.0.0
---

# Task Planner

Decompose requirements into actionable checkbox tasks before coding.

## Core Principle

> "The most fundamental problem in computer science is problem decomposition: how to take a complex problem and divide it up into pieces that can be solved independently."
> — John Ousterhout

This skill implements the "navigator" role in pair programming with AI. Plan first, then let the AI drive.

## Instructions

### Step 1: Understand the Requirement

Gather context:
1. Read the ticket, issue, or user request
2. Identify the scope (single file? multiple systems?)
3. Note any constraints or dependencies

Ask clarifying questions if the requirement is ambiguous.

### Step 2: Decompose into Tasks

Break down into atomic, checkable tasks:

```markdown
## Task: [Feature/Ticket Name]

**Goal:** [1-sentence summary]

**Branch:** `feature/[name]`

### Tasks

- [ ] Research: Understand existing patterns in codebase
- [ ] Setup: Create branch, scaffold files
- [ ] Core: Implement main functionality
  - [ ] Subtask 1
  - [ ] Subtask 2
- [ ] Tests: Write unit/integration tests
- [ ] Verify: Run full test suite
- [ ] Cleanup: Remove debug code, add comments if needed

### Dependencies

- [List any blocking items]

### Notes

- [Any context for future reference]
```

### Step 3: Save Task File

Save to `/tasks/[feature-name].md`:

```bash
# Example
tasks/user-authentication.md
tasks/api-rate-limiting.md
tasks/fix-checkout-bug.md
```

### Step 4: Create Git Checkpoint

Create a branch before starting work:

```bash
git checkout -b feature/[name]
```

This provides a rollback point if the implementation goes wrong.

### Step 5: Execute Tasks

Work through each checkbox:
1. Mark task as in-progress (change `[ ]` to `[~]`)
2. Complete the task
3. Mark as done (change to `[x]`)
4. Commit if appropriate

## Task Decomposition Guidelines

### Good Tasks

- Atomic: One clear action
- Verifiable: Can confirm done/not done
- Independent: Can be done without waiting
- Sized right: 5-30 minutes of work

### Bad Tasks

- "Implement the feature" (too vague)
- "Fix everything" (not atomic)
- "Maybe add caching later" (not actionable)

### Task Categories

| Category | Examples |
|----------|----------|
| Research | Read existing code, find patterns |
| Setup | Create files, install deps, scaffold |
| Core | Main implementation work |
| Tests | Unit tests, integration tests |
| Verify | Run tests, manual testing |
| Cleanup | Remove debug, polish |

## Output Format

```markdown
## Task: Add User Profile Page

**Goal:** Create a profile page showing user info and settings

**Branch:** `feature/user-profile`

### Tasks

- [ ] Research existing page patterns in `src/pages/`
- [ ] Create `src/pages/profile.tsx` scaffold
- [ ] Implement profile header component
- [ ] Implement settings section
- [ ] Add API call to fetch user data
- [ ] Write tests for profile page
- [ ] Run full test suite
- [ ] Manual verification in browser

### Dependencies

- User API endpoint must exist (check with backend)

### Notes

- Follow existing page layout from `src/pages/dashboard.tsx`
```

## Workflow Integration

After planning:
1. Tasks file serves as progress tracker
2. Each checkbox completion = potential commit point
3. If stuck, start fresh debug session (see `debug-fresh` skill)
4. Tasks become PR description content
