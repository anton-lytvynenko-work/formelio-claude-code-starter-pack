---
name: skill-creator
description: Create new Claude Agent Skills following best practices. Use when user wants to create, scaffold, or update a skill package with proper progressive disclosure structure.
allowed-tools: "Read,Write,Bash,Glob,Grep,Edit"
version: 1.0.0
---

# Create Claude Agent Skills

Guide for scaffolding well-structured skills that follow progressive disclosure principles.

## Key Concept

A skill is: **Prompt Template + Context Injection + Execution Context Modification**

Skills are NOT executable code. They inject domain-specific instructions into conversation context to guide Claude's behavior for specific tasks.

## Directory Structure

```
.claude/skills/[skill-name]/
├── SKILL.md          # Core prompt (required)
├── scripts/          # Executable Python/Bash scripts
├── references/       # Documentation loaded into context via Read
└── assets/           # Templates, binaries (referenced by path only)
```

## Instructions

### Step 1: Gather Requirements

Ask the user:
1. What task should this skill perform?
2. What tools does it need? (Read, Write, Bash, Grep, etc.)
3. Are there existing scripts or templates to bundle?

### Step 2: Initialize Skill Directory

Run the initialization script:

```bash
python {baseDir}/scripts/init_skill.py <skill-name> --path .claude/skills/
```

Or create manually:
```bash
mkdir -p .claude/skills/<skill-name>/{scripts,references,assets}
```

### Step 3: Write SKILL.md

#### Frontmatter (Required)

```yaml
---
name: skill-name
description: Brief, action-oriented description for Claude's skill selection
allowed-tools: "Read,Write"  # Minimal necessary tools only
version: 1.0.0
---
```

#### Content Structure

Use this template:

```markdown
# [Brief Purpose - 1-2 sentences]

## Overview
[What this skill does]

## Instructions
### Step 1: [Action]
[Imperative instructions]

### Step 2: [Action]
[Imperative instructions]

## Output Format
[How to structure results]

## Resources
[Reference {baseDir}/scripts/, {baseDir}/references/, {baseDir}/assets/]
```

### Step 4: Bundle Resources (Optional)

| Directory | Purpose | Context Loading |
|-----------|---------|-----------------|
| `scripts/` | Python/Bash automation | Executed via Bash |
| `references/` | Documentation for Claude | Read into context |
| `assets/` | Templates, binaries | Path reference only |

### Step 5: Test the Skill

Invoke with: `/skill-name` or let Claude auto-select based on description match.

## Best Practices

1. **Keep SKILL.md under 5,000 words** - Use references/ for detailed docs
2. **Use imperative language** - "Analyze code for..." not "You should..."
3. **Always use `{baseDir}`** - Never hardcode absolute paths
4. **Scope tools minimally** - Only request what the skill actually needs
5. **Write clear descriptions** - This is how Claude decides to invoke the skill

## Common Patterns

See `{baseDir}/references/patterns.md` for detailed examples:

| Pattern | Use Case |
|---------|----------|
| Script Automation | Complex multi-step operations |
| Read-Process-Write | File transformation |
| Search-Analyze-Report | Codebase analysis |
| Template Generation | Structured outputs |
| Wizard-Style | Multi-step with user confirmation |

## Resources

- Init script: `{baseDir}/scripts/init_skill.py`
- Pattern reference: `{baseDir}/references/patterns.md`
- Frontmatter reference: `{baseDir}/references/frontmatter.md`
