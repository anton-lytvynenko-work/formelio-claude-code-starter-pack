# Vibe Coding Best Practices

The manifesto for AI-native software development. This repository is optimized for AI agents (Claude Code, Cursor, Codex CLI) following principles of simplicity, discoverability, and progressive disclosure.

---

## Core Principles

### 1. Raw Files Over Abstractions

Prefer flat files over databases or CMS systems for content that doesn't need dynamic queries.

```
# Good: Content as markdown files
content/
├── posts/
│   ├── 2024-01-15-intro.md
│   └── 2024-02-20-update.md
└── pages/
    ├── about.md
    └── contact.md

# Bad: Content locked in database/CMS
- Requires running services
- Content not greppable
- Harder for AI to navigate
```

**Why:** AI agents can read, search, and modify flat files directly. No API calls, no schema knowledge, no connection strings.

### 2. Skills Over System Prompts

Package expertise as composable skill folders, not monolithic system prompts.

```
# Good: Modular skills
.claude/skills/
├── code-reviewer/
│   └── SKILL.md
├── migration-helper/
│   └── SKILL.md
└── security-scanner/
    └── SKILL.md

# Bad: Giant system prompt
"You are an expert at code review, migrations, security,
testing, documentation, deployment, monitoring..."
```

**Why:** Skills load on-demand. Context stays focused. Each skill can be independently tested and improved.

### 3. Flat, Explicit, Greppable

Write code that's easy to search and understand without deep context.

```python
# Good: Explicit, searchable
def calculate_order_total(order_items, discount_code):
    ...

def validate_discount_code(code):
    ...

# Bad: Abstracted, hard to find
def process(items, opts):
    return self._handler.execute(items, **opts)
```

**Why:** AI agents use grep/search to navigate code. Explicit naming enables fast discovery.

---

## Code Discipline

Write with discipline: **simple, efficient, minimal, and powerful through composition.**

Professional code is built through consistent practice, not heroics. These habits separate sustainable codebases from fragile ones.

### Philosophy

Code quality = readability × correctness × simplicity

The goal is code that:
- A tired developer can understand in 5 minutes
- Is obviously correct (not clever)
- Scales without rewriting
- Has minimal dependencies and moving parts
- Can be deleted guilt-free (or refactored ruthlessly)

### The 10 Disciplines

#### 1. **Understand Before Building**

Ask clarifying questions before coding. It's cheap now, expensive later.

```
Instead of: "I'll build X"
Ask: "What problem are we solving? Who uses it? When? Why this approach?"
```

**Why:** Prevents building the wrong thing. A 5-minute clarification saves hours of rework.

#### 2. **Delete Code Aggressively**

Code is a liability, not an asset. Every line must justify its existence.

```python
# ❌ Bad: Keep "just in case"
def maybe_used_later():
    pass

# ✅ Good: Delete it
# If needed in future, git log will show it was here
```

**Why:** Dead code confuses readers, hides bugs, creates maintenance burden. Use version control.

#### 3. **Use Proven Patterns, Don't Invent**

Use standard library → common framework → custom code (in that order).

```python
# ❌ Bad: Custom framework
def process_data(x):
    return MyCustomFramework.execute(x)

# ✅ Good: Proven pattern
def process_data(items):
    return [transform(item) for item in items if is_valid(item)]
```

**Why:** Proven patterns are battle-tested. Your custom abstraction isn't.

#### 4. **Minimize Dependencies**

Each dependency is future maintenance, security risk, and version conflict.

```
# ❌ Bad: 47 dependencies
# (some do similar things, some aren't essential)

# ✅ Good: 4 dependencies
# (each handles a clear problem, actively maintained)
```

**Why:** Fewer moving parts = fewer ways to break. Can you do it in stdlib? Do that.

#### 5. **Explicit Over Implicit**

Make tradeoffs visible. Code that explains itself is code that works.

```python
# ❌ Bad: Magic that needs explanation
items = [f(x) for x in data if g(x) and h(x)]

# ✅ Good: Explicit intent
valid_items = [item for item in data if is_valid(item) and is_active(item)]
```

**Why:** Next person reading this code is tired and doesn't know your shortcuts.

#### 6. **Be Boring**

Simple, standard patterns beat clever one-liners every time.

```python
# ❌ Clever (cool but unmaintainable)
result = reduce(lambda a, x: a + x.value, items, 0)

# ✅ Boring (obvious what it does)
total = 0
for item in items:
    total += item.value
return total
```

**Why:** Code is read 10× more than written. Optimize for reading.

#### 7. **Performance-Aware, Not Premature**

Understand O(n) complexity and obvious inefficiencies. Don't optimize code until it's slow.

```python
# ❌ Bad: O(n²) when O(n) is easy
for item in items:
    if item in other_list:  # O(n) search in list
        process(item)

# ✅ Good: O(n) by using set
other_set = set(other_list)
for item in items:
    if item in other_set:  # O(1) lookup
        process(item)

# ✅ Also fine: Loop is obviously fast, don't optimize
for item in items[:100]:  # Only 100 items, readable code is enough
    expensive_operation(item)
```

**Why:** Readable code > clever code > fast code. But know algorithmic complexity.

#### 8. **Unix Philosophy**

Do one thing well. Compose small, focused pieces.

```python
# ❌ Bad: God object
class DataProcessor:
    def parse(self): ...
    def transform(self): ...
    def validate(self): ...
    def persist(self): ...
    def send_email(self): ...
    def log_analytics(self): ...

# ✅ Good: Focused functions
def parse_data(raw):
    return Parser().parse(raw)

def transform_data(data):
    return Transformer().transform(data)

def validate_data(data):
    return Validator().validate(data)
```

**Why:** Small functions are testable, reusable, understandable.

#### 9. **Fail Fast, Explicitly**

Validate inputs at boundaries. Don't silently fail.

```python
# ❌ Bad: Silent failure
def process_user(user_data):
    name = user_data.get('name', '')  # Empty string hides missing data
    return name.upper()

# ✅ Good: Fail fast
def process_user(user_data):
    if 'name' not in user_data or not user_data['name']:
        raise ValueError("User data must include non-empty name")
    return user_data['name'].upper()
```

**Why:** Errors found early are cheap. Errors found in production are expensive.

#### 10. **Make Things Optional**

Features should add value, not complexity. Don't force options unless needed.

```python
# ❌ Bad: Forced configuration
def fetch_data(url, timeout=30, retries=3, backoff=1.5, max_backoff=60, circuit_breaker=False):
    pass

# ✅ Good: Sensible defaults, optional overrides
def fetch_data(url, timeout=30):
    # Retries with exponential backoff are built-in
    # Sensible defaults (3 retries, 1.5x backoff, 60s max)
    # Override if you know better
    pass
```

**Why:** Most users want the happy path. Make that easy, make exceptions possible.

### Anti-patterns to Avoid

| Anti-pattern | Why it's bad |
|---|---|
| **Custom abstractions for code used once** | Over-engineering. Delete instead. |
| **Clever one-liners needing explanation** | Code is read, not written. Be obvious. |
| **Deep nesting (3+ levels)** | Hard to understand flow. Flatten or refactor. |
| **Functions that do 5 things** | Should each do 1 thing. Split them. |
| **Comments explaining *what* code does** | Code shows that. Comments explain *why*. |
| **Silent failures (None, empty string, defaults)** | Errors should be loud. Fail fast. |
| **God objects with 50 methods** | Do one thing well. Compose instead. |
| **Dependencies for simple problems** | Write 20 lines of code instead of adding a library. |
| **Premature optimization** | Readable code first. Profile if slow. Then optimize. |
| **Magic values scattered in code** | Named constants. Make intent explicit. |

### Applying These Principles

**Before you code:**
1. Understand the problem (ask clarifying questions)
2. Find the simplest solution
3. Write it in the most boring way possible

**While you code:**
1. Make tradeoffs explicit (comments for "why")
2. Delete unnecessary code immediately
3. Validate at boundaries (fail fast)

**After you code:**
1. Read it as someone else - is it obvious?
2. Can you delete anything? Delete it.
3. Did you discover a simpler pattern? Refactor.

### The Neovim Parallel

These disciplines mirror Neovim's design:
- **Minimal core, powerful through composition** - Like Neovim plugins
- **No cruft** - Explicit over implicit, like reading .nvimrc
- **Keyboard-first discipline** - Direct, efficient, no GUI shortcuts
- **Text-based everything** - Composable, greppable, version-controllable

Write code with the same discipline you'd apply to Neovim: minimal, explicit, powerful.

---

## Skill Architecture Rules

### Progressive Disclosure Pattern

Show just enough information to help agents decide what to do next, then reveal more details as needed.

```
Layer 1: Frontmatter     → Minimal (name, description)
                           Shown in skill list for selection

Layer 2: SKILL.md        → Comprehensive but focused
                           Loaded when skill is invoked

Layer 3: scripts/        → Executed on-demand
                           Complex automation in Python/Bash

Layer 4: references/     → Read when needed
                           Detailed docs loaded via Read tool

Layer 5: assets/         → Path reference only
                           Templates, binaries never loaded into context
```

### SKILL.md Constraints

| Rule | Guideline |
|------|-----------|
| **Length** | Under 5,000 words (~800 lines) |
| **Language** | Imperative ("Analyze...") not second person ("You should...") |
| **Paths** | Always `{baseDir}/path`, never absolute paths |
| **Tools** | Minimal `allowed-tools` scope |

### Directory Purpose

| Directory | Contains | Loaded Into Context? |
|-----------|----------|---------------------|
| `scripts/` | Python/Bash automation | No - executed via Bash |
| `references/` | Documentation for Claude | Yes - via Read tool |
| `assets/` | Templates, binaries | No - path reference only |

### allowed-tools Scoping

Request only the tools the skill actually needs:

```yaml
# Good: Minimal, scoped
allowed-tools: "Read,Write,Edit"
allowed-tools: "Bash(git status:*),Bash(git diff:*),Read"
allowed-tools: "Grep,Read"

# Bad: Overly broad
allowed-tools: "Bash,Read,Write,Edit,Glob,Grep,WebSearch,Task,Agent"
```

---

## File Organization

### Skill Naming

```
.claude/skills/
├── code-reviewer/      # kebab-case
├── migration-helper/   # descriptive names
├── _example-*/         # prefix examples with underscore
└── skill-creator/      # meta-skill for creating skills
```

### Source Code

```
src/
├── auth/               # Feature folders, not type folders
│   ├── login.ts
│   ├── logout.ts
│   └── permissions.ts
├── orders/
│   ├── create.ts
│   └── process.ts
└── shared/             # Only truly shared utilities
    └── http.ts
```

Avoid:
- `src/controllers/`, `src/services/`, `src/utils/` (type-based organization)
- Deep nesting beyond 3 levels
- Barrel files (`index.ts`) that re-export everything

### Documentation

```
docs/
├── best_practices.md   # This file - the manifesto
├── architecture.md     # System design decisions
└── setup.md            # Getting started guide
```

---

## Anti-Patterns to Avoid

### 1. Hardcoded Paths in Skills

```yaml
# Bad
Run: python /Users/dennis/projects/repo/scripts/analyze.py

# Good
Run: python {baseDir}/scripts/analyze.py
```

### 2. Monolithic SKILL.md

```markdown
# Bad: 10,000 word skill file
[Entire documentation embedded inline]

# Good: Reference external files
See `{baseDir}/references/detailed-guide.md` for complete documentation.
```

### 3. Over-Scoped Tools

```yaml
# Bad: Request everything
allowed-tools: "Bash,Read,Write,Edit,Glob,Grep,WebSearch,Task"

# Good: Request minimum needed
allowed-tools: "Read,Grep"
```

### 4. Vague Skill Descriptions

```yaml
# Bad: Claude can't match user intent
description: Helps with code stuff

# Good: Clear trigger conditions
description: Analyze Python code for security vulnerabilities. Use when reviewing code for security issues.
```

### 5. Second-Person Instructions

```markdown
# Bad
You should analyze the code and you will find...

# Good
Analyze the code. Find all instances of...
```

### 6. Implicit Dependencies

```markdown
# Bad: Assumes context
Run the tests.

# Good: Explicit
Run: npm test
Or if using pytest: python -m pytest tests/
```

---

## Complexity Budgets

> "The cost of abstraction with AI is very high. Over-abstraction was always annoying and a code smell but now there's an easy solution: spend tokens."
> — Lee Robinson

### The New Economics

| Before AI | With AI Agents |
|-----------|----------------|
| Abstractions save developer time | Abstractions cost agent tokens |
| CMS = non-devs can edit | CMS = agents can't directly modify |
| Storybook = component docs | Browser screenshots = visual verification |
| Build once, configure later | Delete and rebuild is cheap |

### High-Cost Abstractions to Audit

1. **Headless CMS** → Replace with markdown files in `content/`
2. **Heavy component libraries** → Build simple versions as needed
3. **Complex state management** → Use native solutions (Context, signals)
4. **ORMs with magic** → Raw queries or simple query builders
5. **Config-heavy tools** → Delete and rebuild simpler versions

### Migration Math

Lee Robinson's cursor.com migration:
- **Estimated:** 1-2 weeks + agency help
- **Actual:** 3 days, $260 in tokens
- **Result:** -322K lines, 2x faster builds, lower CDN costs

### The Deletion Mindset

Ask for each abstraction:
1. Can an AI agent edit this directly? (No GUI required?)
2. Does it live in git? (Reviewable, revertable?)
3. Is it greppable? (Searchable in codebase?)
4. Are we using >50% of its features?

If any answer is "no" → candidate for deletion.

### Export Before Delete

When removing an external service:

```python
# Don't click through GUIs - use the API
response = requests.get(
    "https://api.cms.com/content",
    headers={"Authorization": f"Bearer {API_KEY}"}
)

# Convert to local files
for item in response.json():
    save_as_markdown(item)
```

### Parallel Agent Refactoring

For broad changes across many files:

```markdown
## Subagent Task

Pattern to find: <OldComponent prop={x} />
Replace with: <NewComponent newProp={x} />

Files to update:
- src/pages/home.tsx
- src/pages/about.tsx
- [... all matching files ...]
```

Run agents in parallel on independent files.

---

## Pair Programming Paradigm

> In pair programming, work is split into two roles - 'driver' and 'navigator'. The driver types, the navigator observes and guides.
> — Kent Beck, Extreme Programming Explained

With AI coding agents, the roles are clear:

| Role | Who | Responsibility |
|------|-----|----------------|
| **Driver** | AI Agent | Generate code, execute commands |
| **Navigator** | Human | Guide direction, verify quality, decompose problems |

### The Navigator's Job

1. **Decompose problems** - Break work into tasks (see `task-planner` skill)
2. **Set direction** - Tell the agent what to build, not how
3. **Verify at checkpoints** - Run tests, review diffs at milestones
4. **Course correct** - If stuck, start fresh (see `debug-fresh` skill)

### Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Micromanaging | Reviewing every line breaks flow | Verify at checkpoints only |
| Abdicating | Blindly accepting everything | Run tests, read critical diffs |
| Over-explaining | Long prompts confuse agents | Short, clear instructions |

### The Rhythm

```
1. Plan tasks (navigator decomposes)
2. Git checkpoint (safety net)
3. Execute tasks (driver codes, navigator accepts)
4. Verify (navigator runs tests)
5. Debug if needed (fresh context)
6. Commit and repeat
```

---

## Monorepo for AI

A monorepo plays to AI coding agent's strengths.

### Why Monorepo Works

| Benefit | Explanation |
|---------|-------------|
| Single context | Agent sees all code in one tree |
| Cross-module refactoring | Change API + clients atomically |
| Unified patterns | One set of conventions to learn |
| Simpler tooling | One build, one CI, one search |

### Multi-Repo Problems for AI

```
# Agent must:
1. Identify which repo has the code
2. Clone/navigate to that repo
3. Understand different conventions
4. Coordinate PRs across repos
5. Handle version mismatches

# With monorepo:
1. Everything is here
```

### Monorepo Structure

```
/
├── apps/           # Deployable applications
│   ├── web/
│   └── api/
├── packages/       # Shared libraries
│   ├── ui/
│   └── utils/
├── content/        # Raw content (markdown)
├── docs/           # Documentation
└── .claude/        # AI agent configuration
    └── skills/
```

---

## Stack Selection for AI

AI agents perform better with popular, well-documented stacks.

### Why Popular Stacks Win

LLMs are trained on public code. More examples = better output.

```
High AI Performance:
- Python (FastAPI, Django, Flask)
- JavaScript/TypeScript (React, Node, Next.js)
- Java (Spring Boot)
- Go (standard library)

Lower AI Performance:
- Proprietary internal frameworks
- Esoteric languages (Mojo, Julia, Zig)
- Custom DSLs
- Heavy metaprogramming
```

### Stack Selection Checklist

- [ ] Does the language have extensive public codebases?
- [ ] Is the framework well-documented?
- [ ] Are there many examples on GitHub/Stack Overflow?
- [ ] Can AI agents understand the conventions easily?

### When You Must Use Esoteric Tech

1. Provide extensive documentation in rules files
2. Include example code patterns
3. Consider fine-tuning models (advanced)
4. Accept lower AI productivity for that component

---

## Think Triggers

Use specific phrases to control Claude's thinking depth:

| Phrase | Thinking Budget | Use For |
|--------|-----------------|---------|
| "think" | Light | Simple decisions |
| "think hard" | Medium | Multi-step problems |
| "think harder" | High | Complex architecture |
| "ultrathink" | Maximum | Critical decisions |

Example:
```
"Think hard about how to refactor this authentication system,
then create a plan before making any changes."
```

> **Note:** These triggers are empirical, tested on Claude Sonnet/Opus (2024-2025). They may change with future model updates. See "Prompt Engineering is Empirical" below.

---

## Prompt Engineering is Empirical

Prompt techniques are shaped by training data distribution, not universal principles.

### Research Findings

Recent research on persona prompting ("you are a physics expert") found:
- **Domain-matched expert personas**: No improvement
- **Mismatched personas**: Sometimes degraded performance
- **Low-knowledge personas**: Actively harmful

### Implications

1. **Prompts are not permanent** - Techniques that work today may silently regress on model updates
2. **SFT templates matter** - What works is shaped by supervised fine-tuning, not inherent model capability
3. **Test, don't assume** - Run evaluations on every model update

### What to Avoid

```markdown
# Bad: Persona prompting
"You are an expert Python developer with 20 years of experience..."

# Bad: Excessive flattery
"You are the world's best code reviewer..."

# Bad: Role-playing
"Pretend you are a senior architect at Google..."
```

### What Actually Works

```markdown
# Good: Direct, imperative instructions
"Analyze this code for security vulnerabilities. Check for:
- SQL injection
- XSS
- Authentication bypass"

# Good: Specific context + constraints
"Look at src/auth/ to understand the existing patterns.
Implement password reset following the same structure.
Do not add new dependencies."

# Good: Clear output format
"Return a JSON object with fields: issue, severity, file, line, fix"
```

### Best Practices

| Do | Don't |
|----|-------|
| Use imperative instructions | Use persona prompts |
| Be specific about constraints | Assume AI knows your context |
| Provide examples | Use vague instructions |
| Test on model updates | Assume prompts work forever |
| Document what model was tested | Ignore model version |

### Tracking Model Versions

When a prompt is known to work, document it:

```markdown
## Prompt: Code Review
Tested on: Claude Sonnet 4 (2025-01)
Last verified: 2025-03-15
```

---

## Writing Better Prompts

Specific instructions produce better results.

### Poor vs Good Prompts

| Poor | Good |
|------|------|
| "add tests for foo.py" | "write a new test case for foo.py, covering the edge case where the user is logged out. avoid mocks" |
| "why does ExecutionFactory have such a weird api?" | "look through ExecutionFactory's git history and summarize how its api came to be" |
| "add a calendar widget" | "look at how existing widgets are implemented on the home page to understand the patterns and specifically how code and interfaces are separated out. HotDogWidget.php is a good example to start with. then, follow the pattern to implement a new calendar widget that lets the user select a month and paginate forwards/backwards to pick a year. Build from scratch without libraries other than the ones already used in the rest of the codebase." |
| "fix the bug" | "the login form returns a 500 error when email contains a plus sign. trace the request from LoginController to the database query and fix the validation" |

### The Three-Input Framework

Adapted from Vercel's v0 prompting research. Every good prompt has three inputs:

| Input | Question | Example |
|-------|----------|---------|
| **Product Surface** | What are you building/fixing? | "Password reset endpoint" |
| **Context of Use** | Who uses it, when, for what outcome? | "Users who forgot password, from login page, to regain access" |
| **Constraints** | Technical limits, scope, output format? | "Use existing email service, no new deps, return 200/400/500" |

### Prompt Template

```markdown
Build/Fix/Add [specific surface]

Used by [who]
in [what moment]
to [what outcome]

Constraints:
- technical: [language, framework, existing patterns]
- scope: [files to touch, dependencies allowed]
- output: [format, tests needed, docs]
```

### Example: Good Prompt

```markdown
Add password reset endpoint to src/api/auth/

Used by users who forgot their password
from the login page's "Forgot Password" link
to receive a reset email and regain account access

Constraints:
- technical: Use existing EmailService, follow patterns in src/api/auth/login.ts
- scope: Only modify auth/ folder, no new dependencies
- output: POST /auth/reset returns 200 (sent), 400 (invalid email), 500 (error)
```

### Why This Works

The old formula was linear:
```
[Context] + [Task] + [Constraints] + [Output]
```

The three-input framework is **dimensional**—it forces you to think about the surface (what), the use (why/who/when), and the limits (how). This produces prompts that give agents enough context to make good decisions without over-specifying implementation details.

---

## Multi-Claude Workflows

Running multiple Claude instances produces better results for complex work.

### Pattern: Writer + Reviewer

```
Claude 1 (Terminal A):     Claude 2 (Terminal B):
├── Write code             ├── Review code from Claude 1
├── Commit                 ├── Provide feedback
└── Push                   └── Suggest improvements

Then: Claude 3 applies review feedback
```

### Pattern: Parallel Specialists

```
Claude 1: Frontend changes
Claude 2: Backend changes
Claude 3: Test coverage

All working on same feature, different aspects
```

### Git Worktrees for Parallel Work

Run multiple Claude instances on different branches simultaneously:

```bash
# Create worktrees
git worktree add ../project-auth feature/auth
git worktree add ../project-api feature/api

# Launch Claude in each (separate terminals)
cd ../project-auth && claude
cd ../project-api && claude

# Clean up when done
git worktree remove ../project-auth
```

### Communication via Scratchpads

Have Claudes communicate through shared files:

```
Claude 1 writes to: tasks/scratchpad-1.md
Claude 2 reads from: tasks/scratchpad-1.md
Claude 2 writes to: tasks/scratchpad-2.md
```

---

## Slash Commands

Reusable prompt templates stored in `.claude/commands/`.

### Available Commands

| Command | Usage | Purpose |
|---------|-------|---------|
| `/project:fix-github-issue` | `/project:fix-github-issue 1234` | Fix a GitHub issue |
| `/project:review-pr` | `/project:review-pr 567` | Review a pull request |
| `/project:tdd` | `/project:tdd user-registration` | Test-driven development |

### Creating Custom Commands

1. Create markdown file in `.claude/commands/`
2. Use `$ARGUMENTS` for parameters
3. Available as `/project:filename`

Example `.claude/commands/deploy.md`:
```markdown
Deploy to environment: $ARGUMENTS

1. Run tests: npm test
2. Build: npm run build
3. Deploy: ./scripts/deploy.sh $ARGUMENTS
4. Verify: curl https://$ARGUMENTS.example.com/health
```

---

## Headless Mode for Automation

Use `-p` flag for non-interactive automation.

### CI/CD Integration

```bash
# Fix lint errors automatically
claude -p "fix all eslint errors in src/" --allowedTools Edit

# Generate changelog
claude -p "generate CHANGELOG entry for commits since last tag" --output-format json

# Triage issues
claude -p "label issue #$ISSUE_NUMBER based on content" --allowedTools "Bash(gh:*)"
```

### Fan-Out Pattern

Process many items in parallel:

```bash
# Generate list of tasks
claude -p "list all files needing migration" > tasks.txt

# Process each
while read file; do
  claude -p "migrate $file from React to Vue" --allowedTools Edit
done < tasks.txt
```

---

## Settings Configuration

Configure Claude Code behavior via `~/.claude/settings.json`.

### Recommended Settings

```json
{
  "alwaysThinkingEnabled": true,
  "includeCoAuthoredBy": false,
  "env": {
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "64000",
    "MAX_THINKING_TOKENS": "31999"
  }
}
```

| Setting | Purpose | Tradeoff |
|---------|---------|----------|
| `alwaysThinkingEnabled` | Extended thinking on every response | Latency for quality |
| `includeCoAuthoredBy` | AI attribution in commits | Personal preference |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | Prevents truncation on large refactors | Token usage |
| `MAX_THINKING_TOKENS` | Thinking space before responding | Latency |

### Plugin Configuration

```json
{
  "enabledPlugins": {
    "hookify@claude-code-plugins": true,
    "ast-grep@ast-grep-marketplace": true,
    "commit-commands@claude-code-plugins": true
  }
}
```

---

## Hooks System

Hooks enforce conventions in real-time. Unlike skills (which teach), hooks catch violations before code is written.

**"Skills inform, hooks enforce."**

### How Hooks Work

Hooks are markdown files in `.claude/hooks/` with YAML frontmatter:

```markdown
---
name: block-as-any
enabled: true
event: file
pattern: as\s+any(?!\w)
action: block
---

**Unsafe `as any` cast detected!**
Use a proper type assertion instead.
```

### Hook Actions

| Action | Behavior |
|--------|----------|
| `warn` | Shows message, allows operation |
| `block` | Prevents operation entirely |

### Example Hooks

| Hook | Action | Catches |
|------|--------|---------|
| warn-foreach | warn | `.forEach()` usage |
| block-as-any | block | `as any` casts |
| warn-debug-code | warn | console.log, debugger |
| block-hardcoded-secrets | block | Hardcoded API keys |

### Creating Hooks

Use the `hookify` plugin:
```
/hookify Warn me when I use .forEach() instead of for...of
```

### The Compounding Effect

| Layer | Function |
|-------|----------|
| Skills | Teach conventions |
| Hooks | Enforce conventions |
| Commands | Trigger workflows |
| Plugins | Add capabilities |

Each layer reinforces the others. Skills teach, hooks enforce, commands trigger, plugins extend.

---

## Agent Docs

Reference documentation that Claude reads on demand. Unlike skills (*how* to do things), agent docs provide reference material (*what* things are).

### Location

```
.claude/agent_docs/
├── README.md
├── anti-patterns.md      # Code smells to avoid
└── workflow-triggers.md  # When to use which command/skill
```

### Skills vs Agent Docs

| | Skills | Agent Docs |
|-|--------|------------|
| **Purpose** | How to do something | What something is |
| **Loading** | Auto-loaded when relevant | Read on demand |
| **Example** | "How to debug systematically" | "List of anti-patterns" |

### Referencing in CLAUDE.md

```markdown
## Before You Start

Read relevant docs in `.claude/agent_docs/`:

| Doc | When to Read |
|-----|--------------|
| anti-patterns.md | Before code review |
| workflow-triggers.md | When deciding approach |
```

---

## Plugin Recommendations

Extend Claude Code with plugins for additional capabilities.

### Core Plugins

| Plugin | Purpose | Install |
|--------|---------|---------|
| `hookify` | Create enforcement rules from markdown | `/plugin install hookify@claude-code-plugins` |
| `ast-grep` | Structural code search via AST | `/plugin install ast-grep` |
| `commit-commands` | /commit, /commit-push-pr, /clean_gone | `/plugin install commit-commands@claude-code-plugins` |

### Workflow Plugins

| Plugin | Purpose |
|--------|---------|
| `feature-dev` | 7-phase structured workflow for complex features |
| `pr-review-toolkit` | 6 specialized review agents in parallel |

### Installation

```bash
# Add official marketplace
/plugin marketplace add anthropics/claude-code

# Install plugins
/plugin install hookify@claude-code-plugins
/plugin install commit-commands@claude-code-plugins

# Third-party (add marketplace first)
/plugin marketplace add ast-grep/claude-skill
/plugin install ast-grep
```

---

## Quick Reference

### Creating a New Skill

```bash
# Use the skill-creator
python .claude/skills/skill-creator/scripts/init_skill.py my-skill --path .claude/skills/

# Or manually
mkdir -p .claude/skills/my-skill/{scripts,references,assets}
touch .claude/skills/my-skill/SKILL.md
```

### Skill Description Formula

```
[Action verb] + [what it does] + [trigger condition]

Examples:
- "Extract text from PDF documents. Use when user wants to process PDF files."
- "Generate unit tests for Python code. Use when user needs test coverage."
- "Analyze git history for patterns. Use when investigating code changes."
```

### Common Patterns

| Pattern | Use Case | Tools |
|---------|----------|-------|
| Script Automation | Complex multi-step operations | Bash, Read |
| Read-Process-Write | File transformation | Read, Write |
| Search-Analyze-Report | Codebase analysis | Grep, Read |
| Template Generation | Structured outputs | Read, Write |
| Wizard-Style | Multi-step with confirmation | Read, Write, Bash |

---

## References

- [Anthropic: Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Steven Mays: Optimizing Claude Code](https://stevenmays.co/blog/optimizing-claude-code) - Skills, hooks, plugins
- [Vercel: v0 Prompt Engineering](https://v0.dev/docs/v0-and-prompting) - Three-input framework
- [Repo: Scripts Folder Conventions](../scripts/description.md)
- [Han Lee: Vibe Coding 101 for Software Engineers](https://leehanchung.github.io/blogs/2025/05/04/vibe-coding/)
- [Lee Robinson: Coding Agents & Complexity Budgets](https://leerob.com/n/agents)
- [Skill Pattern Reference](../.claude/skills/skill-creator/references/patterns.md)
- [Frontmatter Reference](../.claude/skills/skill-creator/references/frontmatter.md)
