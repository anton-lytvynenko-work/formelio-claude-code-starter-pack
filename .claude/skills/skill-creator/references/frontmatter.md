# SKILL.md Frontmatter Reference

The frontmatter is the YAML header that controls how Claude discovers and uses your skill.

---

## Required Fields

### name

The skill identifier. Used as the command to invoke the skill.

```yaml
name: my-skill
```

- Use kebab-case (lowercase with hyphens)
- Keep it short and memorable
- Must be unique across all loaded skills

### description

Brief summary of what the skill does. **This is the primary signal Claude uses to decide when to invoke a skill.**

```yaml
description: Extract and analyze data from PDF documents. Use when user wants to process PDF files.
```

Best practices:
- Start with action verb (Extract, Analyze, Generate, etc.)
- Include explicit "Use when..." clause
- Keep under 200 characters
- Be specific about the task domain

---

## Optional Fields

### allowed-tools

Comma-separated list of tools the skill can use without additional permission prompts.

```yaml
allowed-tools: "Read,Write,Bash,Grep"
```

**Scoping examples:**

```yaml
# Basic tools only
allowed-tools: "Read,Write"

# Git commands only
allowed-tools: "Bash(git:*),Read"

# Specific commands
allowed-tools: "Bash(git status:*),Bash(git diff:*),Bash(npm test:*)"

# Script execution
allowed-tools: "Bash(python {baseDir}/scripts/*:*),Read,Write"
```

**Security principle:** Only include tools the skill actually needs. Overly broad permissions defeat the security model.

### version

Semantic version for tracking skill updates.

```yaml
version: 1.0.0
```

### model

Override the model used when skill is active.

```yaml
model: "claude-opus-4-20250514"  # Use specific model
model: "inherit"                  # Use session model (default)
```

Use this for complex tasks that benefit from more capable models.

### license

License information, often referencing a bundled LICENSE.txt.

```yaml
license: MIT - See LICENSE.txt
```

### disable-model-invocation

Prevent Claude from automatically invoking this skill. User must invoke manually with `/skill-name`.

```yaml
disable-model-invocation: true
```

Use for:
- Dangerous operations requiring explicit user intent
- Interactive workflows
- Configuration commands

### mode

Mark skill as a "mode command" that modifies Claude's behavior context.

```yaml
mode: true
```

Mode skills appear in a special section and establish operational contexts (e.g., debug-mode, expert-mode).

---

## Complete Example

```yaml
---
name: code-reviewer
description: Perform comprehensive code review with security and performance analysis. Use when user wants feedback on code quality.
allowed-tools: "Read,Grep,Glob"
version: 2.1.0
model: inherit
license: MIT
---
```

---

## Common Mistakes

### Too broad tools

```yaml
# Bad - unnecessary surface area
allowed-tools: "Bash,Read,Write,Edit,Glob,Grep,WebSearch,Task"

# Good - minimal permissions
allowed-tools: "Read,Grep"
```

### Vague description

```yaml
# Bad - Claude can't match intent
description: Helps with code stuff

# Good - clear trigger conditions
description: Analyze Python code for security vulnerabilities. Use when reviewing code for security issues.
```

### Missing use-case hint

```yaml
# Bad - no trigger hint
description: PDF text extraction tool

# Good - explicit trigger
description: Extract text from PDF documents. Use when user wants to read or process PDF files.
```
