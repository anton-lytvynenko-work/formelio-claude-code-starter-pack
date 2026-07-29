---
name: diagram-gen
description: Generate architecture, sequence, state, and ERD diagrams for code understanding. Use when user wants to visualize code structure or document systems.
allowed-tools: "Read,Grep,Glob,Write"
version: 1.0.0
---

# Diagram Generator

Generate Mermaid diagrams to understand and document code.

## Diagram Types

| Type | Best For |
|------|----------|
| Architecture | System overview, onboarding |
| Sequence | Request flows, workflows |
| State Machine | Object lifecycle |
| ERD | Database structure |
| Flowchart | Algorithm logic |
| Class | OOP structure |

## Instructions

1. **Scope** - What specific part needs visualization?
2. **Gather** - Read entry points, key functions, data models
3. **Generate** - Use Mermaid syntax (see `{baseDir}/references/mermaid-templates.md`)
4. **Save** - Write to `docs/diagrams/[name].md`

## Output Format

```markdown
# [Name] Diagram

[1-2 sentence description]

\`\`\`mermaid
[diagram]
\`\`\`

| Component | Purpose |
|-----------|---------|
| [Name] | [Role] |
```

## Guidelines

- Focus on one aspect per diagram
- Match names to actual code
- Show happy path; add errors only if relevant
- Link to source files when helpful

## Resources

Templates: `{baseDir}/references/mermaid-templates.md`
