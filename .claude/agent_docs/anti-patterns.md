# Anti-Patterns to Avoid

Patterns that make code harder to maintain, especially in AI-assisted development.

## AI-Generated Code Smells

### Excessive Comments
AI tends to over-comment. Remove comments that:
- State the obvious (`// increment counter` above `counter++`)
- Repeat the function/variable name
- Explain what code does instead of why

```javascript
// Bad: AI-generated
// This function calculates the total price of all items
function calculateTotal(items) {
  // Initialize sum to zero
  let sum = 0;
  // Loop through each item
  for (const item of items) {
    // Add item price to sum
    sum += item.price;
  }
  // Return the total sum
  return sum;
}

// Good: Human-style
function calculateTotal(items) {
  let sum = 0;
  for (const item of items) {
    sum += item.price;
  }
  return sum;
}
```

### Gratuitous Defensive Checks
Remove defensive code that doesn't match codebase style:
- Null checks on values already validated upstream
- Type checks on typed parameters
- Try/catch blocks in trusted codepaths

```javascript
// Bad: Over-defensive
function processUser(user) {
  if (!user) throw new Error('User required');
  if (typeof user !== 'object') throw new Error('User must be object');
  if (!user.id) throw new Error('User must have id');
  // ... actual logic
}

// Good: Trust the type system
function processUser(user: User) {
  // Type guarantees user has id
  return doSomething(user.id);
}
```

### Unnecessary Abstractions
AI often creates abstractions for one-time operations:
- Helper functions used once
- Wrapper classes that add no value
- Generic utilities for specific use cases

## Code Organization Smells

### Type-Based Folders
```
// Bad
src/
├── controllers/
├── services/
├── utils/
├── helpers/

// Good
src/
├── auth/
├── orders/
├── users/
```

### Barrel Files That Re-export Everything
```javascript
// Bad: index.ts that just re-exports
export * from './user';
export * from './auth';
export * from './utils';

// Good: Import directly from source
import { User } from './user';
```

### Deep Nesting
More than 3 levels deep is a smell. Flatten.

## Naming Smells

### Vague Names
- `data`, `info`, `item`, `result`, `temp`
- `process()`, `handle()`, `do()`
- `Manager`, `Handler`, `Helper`, `Utils`

### Hungarian Notation / Prefixes
- `IUser` (interface prefix)
- `UserData` (data suffix)
- `strName`, `intCount`

## Testing Smells

For comprehensive testing anti-patterns (mock behavior testing, test-only methods, incomplete mocks), use the `testing-anti-patterns` skill.
