# Placeholder Variable Guide

All placeholders use `{{VARIABLE}}` syntax (double braces). The skill replaces these with user-provided values during initialization.

## Project Identity

| Variable | Example | Usage | Required |
|----------|---------|-------|----------|
| `{{PROJECT_NAME}}` | `my-awesome-app` | kebab-case identifier | Yes |
| `{{PROJECT_TITLE}}` | `My Awesome App` | Title Case display name | No (derived from PROJECT_NAME) |
| `{{PROJECT_DESCRIPTION}}` | `A todo app with real-time sync` | One-line summary | Yes |

## Stack & Runtime

| Variable | Example | Usage | Required |
|----------|---------|-------|----------|
| `{{STACK}}` | `Node.js/TypeScript` | Display name | Yes |
| `{{RUNTIME_VERSION}}` | `Node.js 20` | Full version string | Yes |
| `{{PACKAGE_MANAGER}}` | `npm` | Package manager name | Yes |

## Commands

| Variable | Example | Usage | Where Used |
|----------|---------|-------|-----------|
| `{{INSTALL_COMMAND}}` | `npm install` | Install dependencies | docs/setup.md, CLAUDE.md |
| `{{DEV_COMMAND}}` | `npm run dev` | Start dev server | docs/setup.md, CLAUDE.md |
| `{{TEST_COMMAND}}` | `npm test` | Run tests | docs/setup.md, CLAUDE.md |
| `{{LINT_COMMAND}}` | `npm run lint` | Lint code | docs/setup.md, CLAUDE.md |
| `{{FORMAT_COMMAND}}` | `prettier --write .` | Format code | docs/setup.md (optional) |
| `{{BUILD_COMMAND}}` | `npm run build` | Build for production | CLAUDE.md |

## Optional/Metadata

| Variable | Example | Usage | Optional |
|----------|---------|-------|----------|
| `{{AUTHOR_NAME}}` | `Jane Doe` | For package.json, Cargo.toml | Yes (defaults to git config) |
| `{{LICENSE}}` | `MIT` | License type | Yes (defaults to MIT) |
| `{{MIN_COVERAGE}}` | `80` | Test coverage threshold | Yes (defaults to 80) |
| `{{GITHUB_USERNAME}}` | `janedoe` | For go.mod, GitHub URLs | No (for Go projects) |

## Placeholder Locations in Template

### README.md

```markdown
# {{PROJECT_TITLE}}

{{PROJECT_DESCRIPTION}}
```

### CLAUDE.md

```markdown
# Project Context

{{PROJECT_DESCRIPTION}}

This project uses {{STACK}} and follows AI-native development patterns.

## Essential Commands

Development:
```bash
# Install dependencies
{{INSTALL_COMMAND}}

# Run development server
{{DEV_COMMAND}}

# Run tests
{{TEST_COMMAND}}

# Lint and format
{{LINT_COMMAND}}

# Build for production
{{BUILD_COMMAND}}
```

### AGENTS.md

```markdown
This repository contains {{PROJECT_NAME}}: {{PROJECT_DESCRIPTION}}
```

### docs/setup.md

```
## Requirements

- Runtime: {{RUNTIME_VERSION}}
- Package manager: {{PACKAGE_MANAGER}}

## Install

{{INSTALL_COMMAND}}

## Run

{{DEV_COMMAND}}

## Test

{{TEST_COMMAND}}

## Lint / Format

{{LINT_COMMAND}}
```

### docs/architecture.md

```markdown
One-line summary: {{PROJECT_DESCRIPTION}}
```

## Derived Variables

Some variables are automatically computed:

- `{{PROJECT_TITLE}}` - Derived from `{{PROJECT_NAME}}` (my-awesome-app → My Awesome App)
- `{{GITHUB_USERNAME}}` - Extracted from git config if not provided
- `{{AUTHOR_NAME}}` - Extracted from git config (user.name) if not provided

## Template Processing Rules

1. **Case-sensitive**: `{{PROJECT_NAME}}` ≠ `{{project_name}}`
2. **Exact match**: The skill searches for `{{WORD}}` pattern
3. **Validation**: Skill validates that no unreplaced placeholders remain after initialization
4. **Escaping**: Placeholders in code comments are still replaced (intended behavior)

## Example Substitution

Input (template):
```json
{
  "name": "{{PROJECT_NAME}}",
  "description": "{{PROJECT_DESCRIPTION}}",
  "version": "0.1.0"
}
```

User provides:
- PROJECT_NAME: `task-manager`
- PROJECT_DESCRIPTION: `A simple task management app`

Output:
```json
{
  "name": "task-manager",
  "description": "A simple task management app",
  "version": "0.1.0"
}
```
