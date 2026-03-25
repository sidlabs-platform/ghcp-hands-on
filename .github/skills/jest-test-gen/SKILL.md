---
name: jest-test-gen
description: >
  Generate Jest unit tests following project conventions. Covers test structure,
  naming, coverage targets, edge cases, and file placement for JavaScript testing.
---

# Jest Test Generation Skill

## Test File Placement

Test files mirror the source tree:
- Source: `src/<module>/<filename>.js`
- Test: `tests/<module>/<filename>.test.js`

The project's `jest.config.js` uses `testMatch: ['**/tests/**/*.test.js']`. Always place
tests under `tests/` — never colocate them with source files.

## Test Structure

Use `describe` / `test` nesting (not `describe` / `it`). Follow the **AAA pattern**:
Arrange → Act → Assert.

```js
describe('Calculator', () => {
  describe('add', () => {
    test('returns the sum of two positive numbers', () => {
      // Arrange
      const calc = new Calculator();

      // Act
      const result = calc.add(2, 3);

      // Assert
      expect(result).toBe(5);
    });
  });
});
```

When testing classes, use `beforeEach` for shared setup:

```js
describe('UserService', () => {
  let service;

  beforeEach(() => {
    service = new UserService({ db: mockDb });
  });

  test('creates a user with valid input', () => {
    const user = service.create({ name: 'Ada' });
    expect(user).toHaveProperty('id');
  });
});
```

## Test Naming

**Good** — describes input and expected outcome:
- `test('returns null when user ID is not found', ...)`
- `test('throws ValidationError for negative amounts', ...)`
- `test('trims whitespace from email before saving', ...)`

**Bad** — vague or implementation-focused:
- `test('works correctly', ...)`
- `test('test add method', ...)`
- `test('should call the function', ...)`

## Coverage Targets

Aim for **80%** across all four metrics: statements, branches, functions, and lines.
Prioritize branch coverage — untested branches hide bugs.

## Edge Case Patterns

Every function should be tested against these categories where applicable:

| Category | Examples |
|---|---|
| Null / undefined | `null`, `undefined` as each argument |
| Empty values | `""`, `[]`, `{}` |
| Boundary values | `0`, `-1`, `Number.MAX_SAFE_INTEGER`, empty string vs whitespace |
| Type coercion | `"5"` vs `5`, `true` vs `1`, `NaN` |
| Error paths | Invalid input, missing required fields, network failure mocks |

```js
describe('parseAge', () => {
  test('returns null for undefined input', () => {
    expect(parseAge(undefined)).toBeNull();
  });

  test('returns null for empty string', () => {
    expect(parseAge('')).toBeNull();
  });

  test('coerces numeric strings to numbers', () => {
    expect(parseAge('25')).toBe(25);
  });

  test('returns null for NaN-producing input', () => {
    expect(parseAge('abc')).toBeNull();
  });

  test('rejects negative values', () => {
    expect(parseAge(-1)).toBeNull();
  });
});
```

## Mocking

- Use `jest.fn()` for simple callbacks.
- Use `jest.spyOn()` when you need to observe calls to an existing method.
- Use manual mocks in `tests/__mocks__/` for heavy dependencies (e.g., file system, HTTP).
- Always call `jest.restoreAllMocks()` in `afterEach` or use `jest.config.js` `restoreMocks: true`.

## Checklist Before Submitting Tests

1. Each `test` block has exactly one logical assertion group.
2. Test names read as plain-English sentences.
3. No test depends on execution order — each is fully isolated.
4. Edge cases for null, empty, boundary, and error paths are covered.
5. `npx jest --coverage` shows ≥ 80% on all four metrics.
