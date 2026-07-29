# Prompt Engineering Guide

Based on lessons from Spotify's large-scale AI-assisted coding work and the principles of Code Discipline.

When working with Claude Code and other AI agents, the quality of your prompt determines the quality of the output. This guide teaches you how to write prompts that produce reliable, mergeable code.

---

## Golden Rules

### 1. **Describe Outcomes, Not Steps**

The agent is better at figuring out HOW than you are at prescribing it.

```
❌ Bad (step-by-step):
1. Read the config file
2. Parse the JSON
3. Update the version field to 2.0.0
4. Write it back

✅ Good (outcome-focused):
Update config.json to version 2.0.0. Verify the change with cat config.json.
```

**Why:** Claude Code excels at multi-step problems. Let it decompose the work. Step-by-step instructions constrain its thinking.

### 2. **State Preconditions (When NOT to Act)**

Agents are eager to act on your prompt. Tell them when to stop.

```
❌ Bad:
"Add TypeScript to this project"

✅ Good:
"Add TypeScript to this Node.js project.
ONLY if: package.json exists and no tsconfig.json yet.
SKIP if: Project already has TypeScript configuration."
```

**Why:** Prevents agent from acting on impossible tasks or overwriting existing work.

### 3. **Provide Concrete Examples**

Concrete code examples heavily influence agent behavior. Abstract rules don't.

```
❌ Bad:
"Add error handling to database functions"

✅ Good:
"Add error handling to database functions. For example:

function getUserById(id) {
  const user = db.find(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

Follow this pattern for all database functions."
```

**Why:** The agent learns from examples better than from rules.

### 4. **Define Success with Tests or Validation**

Agents need a verifiable goal to iterate toward.

```
❌ Bad:
"Make the code better"

✅ Good:
"Reduce API response time from 500ms to under 100ms.
Run: npm run benchmark
Should show improvement in latency."
```

**Why:** Agent knows when it's done. Iteration is possible. Success is verifiable.

### 5. **One Change Per Prompt**

Multiple unrelated changes cause agents to:
- Run out of context
- Forget the original task
- Deliver partial results

```
❌ Bad (one mega-prompt):
"Refactor auth system, migrate to JWT, update all tests,
add documentation, and update deployment configs"

✅ Good (4 focused prompts):
1. /start: Refactor auth system (ensure tests pass)
2. /start: Migrate to JWT tokens (ensure tests pass)
3. /start: Update tests for JWT behavior
4. /start: Add documentation for new auth flow
```

**Why:** Each change is atomic, testable, reviewable.

### 6. **Ask for Agent Feedback**

After a task completes, ask the agent what was missing from the prompt.

```
"What was unclear or missing from that prompt?
How could the instructions be better?"
```

**Why:** The agent is in a good position to identify gaps. This improves future prompts.

---

## Anti-Patterns to Avoid

| Anti-pattern | Problem | Fix |
|---|---|---|
| **Overly generic** | Agent guesses wrong intent | Add examples and concrete success criteria |
| **Overly specific** | Breaks when edge cases appear | Describe outcome, let agent handle variations |
| **Multiple unrelated changes** | Agent gets lost | Use separate prompts for separate concerns |
| **No success criteria** | Agent doesn't know when done | Define tests, validation, or acceptance criteria |
| **No preconditions** | Agent acts on impossible tasks | State when to skip or abort |
| **Missing context** | Agent makes wrong assumptions | Provide examples, not just abstract rules |
| **Vague terminology** | Agent misunderstands intent | Use concrete domain language |

---

## Prompt Structure Template

Use this template when prompting agents:

```
## Goal
[What you want to achieve, outcome-focused]

## Preconditions
Only proceed if:
- [condition 1]
- [condition 2]

Skip if:
- [condition that prevents action]

## Examples
[Concrete code examples showing desired behavior]

[Before/after code snippets]

## Success Criteria
The task is complete when:
- [Test passes]
- [Validation script succeeds]
- [Specific behavior verified]

## Context
[Any additional context: project structure, constraints, decisions]
```

---

## Examples: Good vs Bad Prompts

### Example 1: Using /start Command

❌ **Bad:**
```
Initialize this template for my project
```

✅ **Good:**
```
Initialize this template for a Node.js/TypeScript project.

Project name: task-api
Description: A REST API for managing tasks with real-time updates

This is a fresh project, no existing config files.
Verify that npm install would work afterward.
```

### Example 2: Adding a Feature

❌ **Bad:**
```
Add authentication to the API
```

✅ **Good:**
```
Add JWT-based authentication to the API.

Requirements:
- Users can POST /auth/login with email+password
- API returns JWT token
- Protected routes require Authorization: Bearer <token> header
- Invalid tokens return 401 Unauthorized

Test success:
- npm test should pass (unit tests provided in tests/auth.test.ts)
- Manual: curl -H "Authorization: Bearer invalid" should return 401

Example expected behavior:
POST /auth/login
{ "email": "user@example.com", "password": "pass123" }
→ { "token": "eyJhb..." }

Only proceed if tests/auth.test.ts exists.
Skip if authentication already implemented.
```

### Example 3: Refactoring

❌ **Bad:**
```
Refactor the authentication code
```

✅ **Good:**
```
Refactor the authentication middleware for testability.

Current problem:
- auth.js mixes request validation, token parsing, and database queries
- Hard to test individual concerns

Desired outcome:
- Separate into: validateRequest() → parseToken() → lookupUser()
- Each function is pure (no side effects) and testable
- Tests in tests/auth.test.ts should still pass

Success criteria:
- npm test passes (all 12 tests)
- npm run lint passes
- No new dependencies added
- Code review checklist passes
```

---

## Spotify's Lessons: Applied

Spotify's engineering team learned these principles through large-scale AI-assisted migrations affecting thousands of repositories. Key lessons:

1. **Prompts are hard** - Good prompting is a skill, not intuition
2. **Tailor to the agent** - Claude Code prefers outcome-focused, high-level prompts
3. **Preconditions prevent disaster** - Tell agent when NOT to act
4. **Examples work** - Concrete code examples > abstract rules
5. **Validation is clarity** - Tests/checks show agent when it's done
6. **One change at a time** - Parallel changes cause context loss
7. **Feedback loops** - Ask agent what was missing, improve next time
8. **Limit tools** - Fewer moving parts = more predictable results
9. **Encode context upfront** - Don't have agent fetch context dynamically
10. **Guide through code** - Use tests, linters, validation as guardrails

---

## Workflow: Prompt → Iterate → Refine

```
1. Write initial prompt
   ↓
2. Agent completes task
   ↓
3. Review output (tests pass? validation succeeds? code quality?)
   ↓
4. If successful: Ask agent what was missing/unclear
   ↓
5. Update prompt template based on feedback
   ↓
6. Next time: Use improved prompt for similar tasks
```

---

## For Skill Creators

When creating a new skill (`.claude/skills/your-skill/SKILL.md`):

1. **Start with outcome** - What should the user achieve?
2. **List preconditions** - When should this skill abort?
3. **Provide examples** - Show before/after code
4. **Define success** - How does user know it worked?
5. **Test template** - Should be in references/ or scripts/
6. **Keep it focused** - One job, do it well

Example structure:
```yaml
---
name: your-skill
description: [outcome-focused description]
allowed-tools: "Read,Write,Edit,Bash(git:*)"
---

# Your Skill Title

## When to Use
[Outcome you'll achieve]

## Preconditions
Skill will exit if:
- [condition 1]
- [condition 2]

## Instructions
[Outcome-focused steps, not step-by-step]

## Examples
[Before/after examples]

## Success Criteria
- [Test passes]
- [Validation succeeds]
```

---

## Resources

- **Code Discipline**: `docs/best_practices.md` — The manifesto for professional code
- **Skill Examples**: `.claude/skills/` — See real-world skill implementations
- **Command Examples**: `.claude/commands/` — See working prompt templates
- **Spotify's Full Article**: Blog post on background coding agents (Part 2 of 3)

---

## Quick Checklist: Before You Prompt

- [ ] Is this outcome-focused, not step-by-step?
- [ ] Did I state preconditions (when NOT to act)?
- [ ] Did I provide concrete examples?
- [ ] Is there a way to verify success (tests, validation)?
- [ ] Is this ONE change, not multiple?
- [ ] Could I ask the agent for feedback to improve next time?

If all checked: Your prompt is probably good. Go.
