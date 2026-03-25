# Project Coding Standards

## Project Overview
This is a Node.js hands-on workshop project for GitHub Copilot. It contains intentionally imperfect code for learning exercises. When generating or modifying code, follow these conventions.

## Tech Stack
- Node.js 20+ with CommonJS modules (require/module.exports)
- Jest 29.x for testing
- ESLint for linting
- No TypeScript — plain JavaScript only

## Code Style
- Use `const` for values that don't change, `let` for values that do. Never use `var`.
- Use JSDoc comments for all exported functions and classes.
- Prefer arrow functions for callbacks and short functions.
- Use template literals instead of string concatenation.
- Use strict equality (`===` / `!==`), never loose equality.
- Prefer array methods (map, filter, reduce, find) over for loops for transformations.
- Extract magic numbers into named constants.
- Maximum function length: 30 lines. Extract longer functions into smaller units.

## Testing Conventions
- Test framework: Jest with `describe` / `test` blocks (not `it`).
- Test file location: `tests/<module>/<filename>.test.js` mirroring `src/<module>/<filename>.js`.
- Use `beforeEach` for setup in class-based test suites.
- Follow AAA pattern: Arrange, Act, Assert — with blank lines separating each section.
- Always test: happy path, edge cases (null, undefined, empty, boundary values), error paths.
- Coverage target: 80% across statements, branches, functions, and lines.
- Use descriptive test names: `should <expected behavior> when <condition>`.

## Error Handling
- Never swallow errors with empty catch blocks.
- Throw descriptive Error objects with meaningful messages.
- Validate function inputs early and return/throw immediately for invalid input.

## Security
- Never use `eval()`, `Function()`, or `new RegExp()` with unsanitized user input.
- Use `crypto.scryptSync` or `crypto.pbkdf2Sync` for password hashing — never MD5 or SHA1.
- Always validate and sanitize file paths to prevent path traversal.
- Never log sensitive data (passwords, tokens, API keys, email addresses).
- Use `crypto.randomBytes()` for generating tokens — never `Math.random()` or base64 encoding of predictable data.
