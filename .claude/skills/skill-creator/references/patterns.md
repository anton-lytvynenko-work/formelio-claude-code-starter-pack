# Skill Pattern Reference

Common patterns for structuring skill instructions and workflows.

---

## Pattern 1: Script Automation

**Use when:** Complex multi-step operations requiring deterministic logic.

**Structure:**
```markdown
## Instructions

Run the analysis script:

\`\`\`bash
python {baseDir}/scripts/analyzer.py --input "$TARGET" --output report.json
\`\`\`

Parse `report.json` and present findings to the user.
```

**allowed-tools:** `Bash(python {baseDir}/scripts/*:*),Read`

**Example use cases:**
- Code analysis with custom rules
- Data transformation pipelines
- Build/deploy automation

---

## Pattern 2: Read-Process-Write

**Use when:** Simple file transformation tasks.

**Structure:**
```markdown
## Instructions

1. Read input file using Read tool
2. Transform content according to specifications
3. Write output using Write tool
4. Report completion with summary
```

**allowed-tools:** `Read,Write`

**Example use cases:**
- Format conversion (JSON to YAML, etc.)
- Content cleanup/normalization
- Template filling

---

## Pattern 3: Search-Analyze-Report

**Use when:** Codebase analysis and pattern detection.

**Structure:**
```markdown
## Instructions

1. Use Grep to find patterns matching criteria
2. Read each matched file for full context
3. Analyze findings against rules
4. Generate structured report with:
   - Summary of findings
   - Severity classification
   - Recommended actions
```

**allowed-tools:** `Grep,Read`

**Example use cases:**
- Security vulnerability scanning
- Code style violations
- Dependency analysis
- TODO/FIXME collection

---

## Pattern 4: Template-Based Generation

**Use when:** Creating structured outputs from templates.

**Structure:**
```markdown
## Instructions

1. Read template from {baseDir}/assets/template.html
2. Parse user requirements
3. Fill template placeholders:
   - {{TITLE}} -> user-provided title
   - {{CONTENT}} -> generated content
   - {{DATE}} -> current date
4. Write filled template to output location
```

**allowed-tools:** `Read,Write`

**Example use cases:**
- Report generation
- Boilerplate code creation
- Documentation scaffolding

---

## Pattern 5: Wizard-Style Workflow

**Use when:** Complex processes requiring user input at each step.

**Structure:**
```markdown
## Step 1: Initial Setup

1. Ask user for project type
2. Validate prerequisites exist
3. Create base configuration

**Wait for user confirmation before proceeding.**

## Step 2: Configuration

1. Present configuration options
2. Ask user to choose settings
3. Generate config file

**Wait for user confirmation before proceeding.**

## Step 3: Finalization

1. Run initialization scripts
2. Verify setup successful
3. Report results
```

**allowed-tools:** `Read,Write,Bash`

**Example use cases:**
- Project initialization wizards
- Migration assistants
- Configuration generators

---

## Pattern 6: Iterative Refinement

**Use when:** Tasks requiring multiple analysis passes.

**Structure:**
```markdown
## Pass 1: Broad Scan

1. Search entire codebase for patterns
2. Identify high-level issues
3. Categorize findings by type

## Pass 2: Deep Analysis

For each category:
1. Read full file context
2. Analyze root cause
3. Determine severity

## Pass 3: Recommendations

For each finding:
1. Research best practices
2. Generate specific fix
3. Estimate complexity

Present final report with all findings and recommendations.
```

**allowed-tools:** `Grep,Read,WebSearch`

**Example use cases:**
- Code review
- Performance optimization
- Refactoring planning

---

## Pattern 7: Context Aggregation

**Use when:** Building comprehensive understanding from multiple sources.

**Structure:**
```markdown
## Context Gathering

1. Read project README.md for overview
2. Analyze package.json for dependencies
3. Grep codebase for specific patterns
4. Check git history for recent changes
5. Synthesize findings into coherent summary
```

**allowed-tools:** `Read,Grep,Bash(git:*)`

**Example use cases:**
- Project onboarding summaries
- Dependency impact analysis
- Change impact assessment

---

## Choosing the Right Pattern

| If you need to... | Use Pattern |
|-------------------|-------------|
| Run complex scripts | Script Automation |
| Transform files | Read-Process-Write |
| Find and analyze code | Search-Analyze-Report |
| Generate from templates | Template-Based Generation |
| Guide user through steps | Wizard-Style Workflow |
| Deep multi-pass analysis | Iterative Refinement |
| Gather project context | Context Aggregation |
