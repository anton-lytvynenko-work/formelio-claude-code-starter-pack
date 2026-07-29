# Hook Stack Mappings

Determines which hooks to keep for each stack. Universal hooks are always kept.

## Universal Hooks (Keep for all stacks)

- `block-hardcoded-secrets` - Prevent secrets in code
- `warn-debug-code` - Alert on debugging statements

## TypeScript/JavaScript Specific

Keep these hooks for Node.js projects:

- `warn-foreach` - Prefer `for...of` over `.forEach()`
- `block-as-any` - Prevent `as any` type casts

**Remove for**: Python, Rust, Go

## Python Specific

No Python-specific hooks configured yet. Universal hooks only.

## Rust Specific

No Rust-specific hooks configured yet. Universal hooks only.

## Go Specific

No Go-specific hooks configured yet. Universal hooks only.

## Mapping Logic

```python
# Universal hooks - never remove
UNIVERSAL_HOOKS = {"block-hardcoded-secrets", "warn-debug-code"}

# Stack-specific hooks
STACK_HOOKS = {
    "nodejs": {"warn-foreach", "block-as-any"},
    "javascript": {"warn-foreach", "block-as-any"},
    "typescript": {"warn-foreach", "block-as-any"},
    "python": set(),
    "rust": set(),
    "go": set(),
}

# To determine which hooks to keep
def get_hooks_to_keep(stack: str) -> set:
    return UNIVERSAL_HOOKS | STACK_HOOKS.get(stack, set())

# To determine which hooks to remove
def get_hooks_to_remove(stack: str, all_hooks: set) -> set:
    keep = get_hooks_to_keep(stack)
    return all_hooks - keep
```

## Future Extensions

Add stack-specific hooks as needed:

- **Python**: `warn-mutable-default`, `block-wildcard-import`
- **Rust**: `warn-unwrap`, `warn-panic` (for library code)
- **Go**: `warn-panic`, `warn-fmt` (for library code)
