---
name: js-refactor
description: >
  Guide safe JavaScript refactoring: detect code smells, extract concerns,
  modernize syntax, cleanup legacy patterns, and preserve public APIs.
---

# JavaScript Refactoring Skill

## Refactoring Workflow

Always follow these steps in order:

1. **Run tests first** — confirm the existing suite passes (`npx jest`). Never refactor code with failing tests.
2. **Analyze code smells** — identify the highest-value change (see patterns below).
3. **Extract one concern at a time** — make a single, focused change per commit.
4. **Run tests after each change** — if tests fail, revert immediately and try a smaller step.
5. **Verify public API preserved** — `module.exports` must expose the same keys with the same behavior.

## Target Metrics

- No function longer than **30 lines**.
- Each module handles **one responsibility**.
- Zero `var` declarations; use `const` by default, `let` only when reassignment is needed.

## Patterns to Apply

### Replace `var` with `const` / `let`

```js
// Before
var count = 0;
var name = getName();

// After
let count = 0;
const name = getName();
```

### Replace if/else chains with lookup objects

```js
// Before
function getStatusText(code) {
  if (code === 200) return 'OK';
  else if (code === 404) return 'Not Found';
  else if (code === 500) return 'Server Error';
  else return 'Unknown';
}

// After
const STATUS_TEXT = {
  200: 'OK',
  404: 'Not Found',
  500: 'Server Error',
};

function getStatusText(code) {
  return STATUS_TEXT[code] || 'Unknown';
}
```

### Extract magic numbers into named constants

```js
// Before
if (password.length < 8) { ... }

// After
const MIN_PASSWORD_LENGTH = 8;
if (password.length < MIN_PASSWORD_LENGTH) { ... }
```

### Extract validation logic into separate functions

```js
// Before — validation mixed into handler
function createUser(data) {
  if (!data.email || !data.email.includes('@')) throw new Error('Invalid email');
  if (!data.name || data.name.length < 1) throw new Error('Name required');
  return db.insert(data);
}

// After — validation separated
function validateUserData(data) {
  if (!data.email || !data.email.includes('@')) throw new Error('Invalid email');
  if (!data.name || data.name.length < 1) throw new Error('Name required');
}

function createUser(data) {
  validateUserData(data);
  return db.insert(data);
}
```

### Separate I/O from business logic

Move file reads, HTTP calls, and database queries to the caller or an injected
dependency. Business logic functions should accept data and return data — never
call `fs`, `http`, or a database client directly.

### Replace `for` loops with array methods (when clearer)

```js
// Before
const results = [];
for (let i = 0; i < items.length; i++) {
  if (items[i].active) {
    results.push(items[i].name);
  }
}

// After
const results = items.filter(item => item.active).map(item => item.name);
```

### Replace swallowed errors with proper handling

```js
// Before — silently swallows failure
try { riskyOperation(); } catch (e) {}

// After — log and optionally re-throw
try {
  riskyOperation();
} catch (error) {
  logger.error('riskyOperation failed', { message: error.message });
  throw error;
}
```

## Safety Rules

- **Preserve `module.exports`** — the exported interface is a public contract. Renaming
  or removing an export is a breaking change; add new exports instead.
- **Backward compatibility** — if a function accepted a callback, keep accepting it
  even if you add a Promise-based alternative.
- **No behavior changes** — refactoring changes structure, not behavior. If a bug is
  found during refactoring, fix it in a **separate** commit with its own test.

## Checklist

1. All tests pass before and after the change.
2. `module.exports` keys are unchanged.
3. No function exceeds 30 lines.
4. No `var` remains; `const` is preferred over `let`.
5. Magic numbers are replaced with named constants.
6. Each extracted function has a clear, single purpose.
