# Goal

Maintain and evolve an "AI-Native" software repository optimized for AI agents (Claude Code, Cursor). Prioritize **Raw Files over Abstractions** and **Skills over System Prompts**.

# The Repository Structure
Assume the project follows this structure:
/
├── .claude/
│   ├── commands/         # Reusable slash commands
│   └── skills/           # Agent Capabilities (Han Lee Style)
│       └── [skill-name]/
│           ├── SKILL.md
│           ├── scripts/
│           ├── references/
│           └── assets/
├── content/              # Raw Data (Lee Robinson Style - No CMS/DB)
├── src/                  # Application Logic (flat, explicit, greppable)
├── docs/                 # Best practices + setup + architecture
└── tasks/                # Task breakdowns + scratchpads

# Task
Analyze the provided text (blog post, documentation, or article). Extract actionable insights and convert them into **concrete, executable file updates** for this repository.

# Steps
1. **Analyze for Skills:** Does the text describe a workflow or capability (e.g., "refactoring," "migration," "writing")?
   - If YES: Design a new Skill Folder (`.claude/skills/<name>/`).
   - Create a `SKILL.md` following the progressive disclosure principle (frontmatter + concise instructions).
   - Add `scripts/`, `references/`, or `assets/` only when they add real leverage.

2. **Analyze for Vibe Principles:** Does the text describe a coding philosophy (e.g., "remove CMS," "inline styles," "use flat files")?
   - If YES: Propose an update to `docs/best_practices.md` phrased as a concrete, reusable rule.

3. **Analyze for Refactoring/Deletion:** Does the text suggest removing a specific abstraction or dependency?
   - If YES: Propose a minimal plan and/or a deterministic script to execute it.

# Output Rules

- Prefer small, reversible changes over sweeping rewrites.
- If you create a skill, keep `SKILL.md` under 5,000 words; put deep docs in `references/`.
- Use `{baseDir}` for skill-local paths (never hardcode absolute paths).
- Scope `allowed-tools` to the minimum needed.

# Output Format

## Insight Summary

- Bullet 1
- Bullet 2

## Files

### File: `<path>`
```text
<content>
```

Notes:
- Only include files you intend to add/change.
- If updating an existing file, output the full updated file content (preferred) or clearly marked sections to replace.
