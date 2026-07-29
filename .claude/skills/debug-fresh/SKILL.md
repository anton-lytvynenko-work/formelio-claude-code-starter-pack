---
name: debug-fresh
description: Start a fresh debugging session with minimal context. Use when stuck on a bug, hitting context limits, or agent is going in circles.
allowed-tools: "Read,Grep,Bash(git:*)"
version: 1.0.0
---

# Debug Fresh

Start a clean debugging session with minimal, high-signal context.

## When to Use

- Agent keeps trying the same failed approach
- Context window is getting long
- Error persists after 3+ attempts (see `systematic-debugging.md` rule for the methodology)

## Instructions

### Step 1: Git Checkpoint

```bash
git add -A && git stash  # or commit "WIP: debugging [issue]"
```

### Step 2: Capture Minimal Bug Report

```markdown
## Bug: [Short description]

### Expected
[1 sentence]

### Actual
[1 sentence]

### Error
[Exact error message]

### Location
`src/file.ts:47`

### Repro
1. Step 1
2. Step 2
3. Error occurs
```

### Step 3: Start Fresh Session

New conversation with ONLY:
- The bug report above
- The specific file(s) involved

Do NOT include previous attempts or tangential files.

### Step 4: Debug Systematically

1. Read the error
2. Read the code at that line
3. Trace the data flow
4. Form one hypothesis
5. Test with minimal change
6. Fix or try next hypothesis

### Step 5: Restore and Apply

```bash
git stash pop  # Restore previous work
# Apply the fix
```

## Why This Works

| Full Context | Fresh Context |
|--------------|---------------|
| 50+ messages | 1 message |
| Multiple files | 1-2 files |
| Pattern-matches old attempts | Reasons fresh |

## Anti-Patterns

- "Let me explain everything I've tried..." (defeats purpose)
- Including 10 files "for context" (noise)
- Vague errors: "it doesn't work" (not actionable)
- Multiple bugs at once (focus on one)
