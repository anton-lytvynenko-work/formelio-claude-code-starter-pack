# Hooks

Hooks enforce conventions in real-time. Unlike skills (which teach), hooks catch violations before code is written.

## How Hooks Work

Hooks are markdown files with YAML frontmatter. When Claude writes code matching a pattern, the hook triggers.

| Field | Purpose |
|-------|---------|
| `name` | Hook identifier |
| `enabled` | true/false |
| `event` | `file` (triggered on file changes) |
| `pattern` | Regex to match |
| `action` | `warn` (show message) or `block` (prevent operation) |

## Active Hooks

| Hook | Action | Catches |
|------|--------|---------|
| warn-foreach | warn | `.forEach()` usage |
| block-as-any | block | `as any` casts |
| warn-debug-code | warn | console.log, debugger |
| block-hardcoded-secrets | block | Hardcoded API keys |
| block-mcp-injection | block | MCP prompt injection attempts |

## MCP Security Hook

The `block-mcp-injection` hook targets adversarial tooling attacks where MCP servers return prompt-injected data. This is a **specification hook** - the `mcp_response` event type documents the intended behavior for future enforcement.

Current enforcement is via the rule at `.claude/rules/mcp-security.md`.

## Creating Hooks

Use the `hookify` plugin:
```
/hookify Warn me when I use .forEach() instead of for...of
```

Or create manually:
```markdown
---
name: my-hook
enabled: true
event: file
pattern: <regex>
action: warn
---

Message shown when hook triggers.
```

## Skills vs Hooks

| | Skills | Hooks |
|-|--------|-------|
| **Purpose** | Teach conventions | Enforce conventions |
| **When** | When skill is invoked | Real-time on file changes |
| **Action** | Inform | Warn or block |

**"Skills inform, hooks enforce."**
