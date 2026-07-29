---
name: git-commit
description: Create well-structured git commits with conventional commit messages. Use when user wants to commit changes or asks about commit best practices.
allowed-tools: "Bash(git:*),Read"
version: 1.0.0
---

# Git Commit Helper

Create clean, well-structured commits following conventional commit format.

## Instructions

### Step 1: Check Status

Run `git status` to see all changes.
Run `git diff --stat` to get a summary of modifications.

### Step 2: Analyze Changes

For each changed file, determine:
- What type of change is it?
- What is the scope (feature area)?
- Is this a breaking change?

### Step 3: Determine Commit Type

| Type | Use When |
|------|----------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change, no new feature or fix |
| `test` | Adding/updating tests |
| `chore` | Build, config, dependencies |

### Step 4: Write Commit Message

Format:
```
type(scope): subject

[optional body]

[optional footer]
```

Rules:
- Subject: imperative mood, lowercase, no period, max 50 chars
- Body: explain what and why, not how
- Footer: breaking changes, issue references

### Step 5: Stage and Commit

Stage relevant files (not everything blindly):
```bash
git add <specific-files>
```

Commit with the message:
```bash
git commit -m "type(scope): subject"
```

## Examples

```bash
# Feature
git commit -m "feat(auth): add password reset flow"

# Bug fix
git commit -m "fix(api): handle null response from payment gateway"

# Breaking change
git commit -m "feat(api)!: change response format for user endpoint

BREAKING CHANGE: user endpoint now returns object instead of array"
```

## Anti-patterns

- `git add .` without reviewing changes
- "fix stuff" or "updates" as commit messages
- Mixing unrelated changes in one commit
- Committing generated files or secrets
