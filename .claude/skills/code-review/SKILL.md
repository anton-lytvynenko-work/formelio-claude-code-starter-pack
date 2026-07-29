---
name: code-review
description: Review code changes for AI-generated patterns, anti-patterns, and project convention violations. Use before committing or when reviewing PRs.
allowed-tools: "Read,Grep,Glob"
version: 1.0.0
---

# Code Review

Review code for AI-generated patterns that don't match human-written code.

## When to Use

- Before committing changes
- When reviewing PRs
- After AI-assisted coding session
- When code "feels" over-engineered

## Instructions

### Step 1: Read Anti-Patterns Reference

Read `{baseDir}/../agent_docs/anti-patterns.md` for the full list.

### Step 2: Check for AI-Generated Patterns

| Pattern | What to Look For |
|---------|------------------|
| Excessive comments | Comments stating the obvious |
| Over-defensive code | Null checks on typed parameters |
| Unnecessary abstractions | Helpers used once |
| Verbose naming | `getUserDataFromDatabase` vs `getUser` |

### Step 3: Check Project Conventions

1. Read nearby files to understand local patterns
2. Verify new code matches existing style
3. Check naming conventions match

### Step 4: Output Format

```markdown
## Code Review: [file or PR]

### AI Patterns Found
- [ ] Issue: [description]
  - Location: `file:line`
  - Fix: [suggestion]

### Convention Violations
- [ ] Issue: [description]
  - Location: `file:line`
  - Expected: [pattern]

### Summary
- Critical: X
- Warnings: Y
- Suggestions: Z
```

## Quick Checklist

- [ ] No comments stating the obvious
- [ ] No unnecessary null checks
- [ ] No single-use helper functions
- [ ] Names match existing conventions
- [ ] No excessive try/catch
- [ ] No Hungarian notation (IFoo, FooData)
- [ ] No barrel file re-exports
- [ ] Folder structure matches project style
