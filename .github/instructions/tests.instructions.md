---
applyTo: "tests/**/*.test.js"
---
# Test File Conventions

- Always import the module under test at the top of the file.
- Group related tests in `describe` blocks matching the function or method name.
- Use `test` (not `it`) for individual test cases.
- Name tests descriptively: `test('should return false when email has no @ symbol', ...)`.
- Use `beforeEach` to create fresh instances for class-based tests.
- For error testing, use `expect(() => fn()).toThrow('message')` or `expect(fn()).rejects.toThrow()` for async.
- Test edge cases: null, undefined, empty string, 0, negative numbers, very large values, NaN.
- Test type coercion: what happens when a number is passed where a string is expected?
- Each test should be independent — no shared mutable state between tests.
- Prefer `toEqual` for objects/arrays, `toBe` for primitives, `toThrow` for errors.
