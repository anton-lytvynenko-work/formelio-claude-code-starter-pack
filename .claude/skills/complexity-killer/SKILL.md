---
name: complexity-killer
description: Audit and remove unnecessary abstractions from the codebase. Use when user wants to simplify, reduce dependencies, or eliminate complexity that slows down AI agents.
allowed-tools: "Read,Grep,Glob,Bash(npm:*),Bash(cat:*)"
version: 1.0.0
---

# Complexity Killer

Identify and eliminate abstractions that increase the cost of AI-assisted development.

## Core Principle

> "The cost of abstraction with AI is very high. Over-abstraction was always annoying and a code smell but now there's an easy solution: spend tokens."
> — Lee Robinson

Every abstraction between the AI and the raw code/content increases friction. CMSes, ORMs, complex state managers, and UI builders all add layers that agents must navigate.

## Instructions

### Step 1: Audit Dependencies

Check package.json or equivalent for bloat:

```bash
# Count dependencies
cat package.json | grep -c '":'

# Check bundle size
npx vite-bundle-visualizer  # or similar
```

Flag these high-cost abstractions:
- Headless CMS SDKs (contentful, sanity, strapi)
- Heavy UI frameworks (storybook, when barely used)
- Complex state managers (when context would suffice)
- ORMs (when raw SQL would be clearer)

### Step 2: Calculate Abstraction Cost

For each abstraction, assess:

| Question | High Cost If... |
|----------|-----------------|
| Can AI edit it directly? | No - requires GUI/dashboard |
| Is it greppable? | No - content in external DB |
| Does it add build time? | Yes - network I/O, compilation |
| Is it used to full potential? | No - using 10% of features |

### Step 3: Propose Removal Plan

For each flagged abstraction:

1. **What replaces it?** (usually: raw files, simple code)
2. **Migration script needed?** (export via API, convert format)
3. **What's preserved?** (content, functionality)
4. **What's deleted?** (SDK, config, types)

### Step 4: Create Export Scripts

If migrating from external service:

```python
# Pattern: Use existing API keys to export programmatically
import requests

def export_content():
    # Fetch all content via API
    # Convert to markdown/JSON
    # Save to content/ directory
    # Upload assets to object storage
    pass
```

### Step 5: Execute Migration

1. Run export script
2. Delete abstraction dependencies
3. Update imports/references
4. Verify with browser screenshots
5. Measure improvement (build time, bundle size)

## Common Targets

### CMS → Markdown Files

```
Before: Contentful SDK → API call → Transform → Render
After:  Read markdown file → Render

Savings: Network I/O, SDK deps, API rate limits, $$$
```

### Storybook → Simple Component Viewer

```
Before: Full Storybook setup, stories files, addons
After:  Single /components page with all components

Savings: Dependencies, build time, CI time
```

### Complex State → Simple Context

```
Before: Redux + middleware + devtools + actions + reducers
After:  React Context + useReducer

Savings: Bundle size, mental overhead, files
```

## Output Format

```markdown
## Complexity Audit

### High-Cost Abstractions Found

1. **[Name]** - [Why it's costly]
   - Replacement: [Simple alternative]
   - Migration effort: [Low/Medium/High]
   - Expected savings: [Build time, deps, $$$]

### Recommended Removal Order

1. [Easiest win first]
2. [Next priority]

### Migration Scripts Needed

- [ ] export_[thing].py
- [ ] convert_[format].py
```

## Remember

- Deletion is a feature
- Simple > Flexible
- If AI can't easily edit it, it's too complex
- Every dependency is a liability
