---
description: "Refactor the full application: detect code smells across all modules, modernize syntax, extract concerns, and verify with tests"
agent: "agent"
tools: ["search", "editFiles", "runInTerminal", "testFailure"]
---

Refactor this Node.js application by systematically improving all source modules under `src/`. Follow the [js-refactor skill](../skills/js-refactor/SKILL.md) workflow and [source conventions](../instructions/source.instructions.md).

## Pre-flight

1. Run `npx jest` — confirm the entire test suite passes before any changes.
2. List every `src/**/*.js` file and assess each for code smells.

## Code Smell Detection

Scan every source file for the following and rank by severity:

| Smell | Example |
|-------|---------|
| `var` declarations | Replace with `const` / `let` |
| Magic numbers | Extract into named constants |
| Functions > 30 lines | Break into smaller units |
| if/else chains mapping values | Use lookup objects |
| Mixed I/O + business logic | Separate into dedicated modules |
| Duplicated calculations | Centralize in shared helpers |
| Empty catch blocks | Add explicit error handling |
| Hardcoded config values | Extract to constants or config |

## Refactoring Rules

- **One concern per commit** — make a single focused change, then run tests.
- **Preserve public APIs** — `module.exports` must expose the same keys with identical behavior.
- **Use `const` by default**, `let` only when reassignment is required. Never `var`.
- **Use array methods** (`find`, `findIndex`, `filter`, `reduce`) instead of manual `for` loops.
- **Use lookup objects** instead of if/else chains for value mapping.
- **Add JSDoc** (`@param`, `@returns`) to any new exported function.
- **Extract validation** into its own function or module when mixed into handlers.
- **Separate I/O from logic** — business functions accept data and return data.

## Execution Order

Process modules in dependency order (leaves first):

1. `src/utils/` — lowest risk, no internal dependencies
2. `src/cart/` — depends only on utils
3. `src/services/` — may depend on utils
4. `src/orders/` — depends on cart, utils, and fs; highest complexity

For each module:
1. Identify smells and list planned changes.
2. Apply changes one at a time.
3. Run `npx jest` after each change — revert if tests fail.
4. When extracting new modules, generate tests following [test conventions](../instructions/tests.instructions.md).

## Post-refactor Checklist

- [ ] All original tests pass
- [ ] No `var` keywords remain in any source file
- [ ] No function exceeds 30 lines
- [ ] No if/else chain that could be a lookup object
- [ ] Every new exported function has JSDoc
- [ ] Run `npx jest --coverage` — coverage has not decreased
