# Custom rules

This directory holds **project-specific** rules. The reusable starter ships only generic rules in the parent `.claude/rules/` directory.

## When starting a new project

Create a `project.md` here (or split by topic — `domain.md`, `infra.md`, etc.) describing facts that wouldn't change across sessions:

- Tech stack and versions actually in use
- Domain terminology specific to this product
- External services this project integrates with (and the role each plays)
- Data conventions (naming, schema invariants)
- Project-specific constraints (e.g., "we don't add new dependencies without ADR")

These files are loaded automatically alongside the generic rules.

## Convention

- One file per concern when a project grows beyond ~150 lines of rules
- Lead with **why** the rule exists, not just what it says
- Keep facts current — stale rules erode trust faster than missing ones
