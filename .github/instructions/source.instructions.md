---
applyTo: "src/**/*.js"
---
# Source Code Conventions

- Use CommonJS modules: `const x = require('...')` and `module.exports = { ... }`.
- Every exported function must have a JSDoc comment with @param and @returns.
- Prefer pure functions where possible — minimize side effects.
- Separate concerns: business logic should not contain I/O (file system, network).
- Use lookup objects instead of if/else chains for value mapping.
- Validate all inputs at function entry. Return early for invalid inputs.
- Use `const` by default. Only use `let` when reassignment is necessary.
- Replace magic numbers with named constants at module scope.
- Handle errors explicitly — never use empty catch blocks.
