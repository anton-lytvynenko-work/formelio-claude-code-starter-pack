# Agent Docs

Reference documentation that Claude reads on demand. Unlike skills (which encode *how* to do things), agent docs provide reference material (*what* things are).

## When to Read

| Doc | When to Read |
|-----|--------------|
| anti-patterns.md | Before code review or PR |
| workflow-triggers.md | When deciding which command/skill to use |

## Skills vs Agent Docs

| | Skills | Agent Docs |
|-|--------|------------|
| **Purpose** | How to do something | What something is |
| **Loading** | Auto-loaded when relevant | Read on demand |
| **Location** | `.claude/skills/` | `.claude/agent_docs/` |
| **Example** | "How to debug systematically" | "List of anti-patterns to avoid" |

## Adding New Docs

1. Create markdown file in this directory
2. Add entry to "When to Read" table in CLAUDE.md
3. Reference in relevant skills if needed
