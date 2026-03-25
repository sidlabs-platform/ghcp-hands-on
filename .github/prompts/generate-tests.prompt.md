---
mode: agent
description: "Generate comprehensive Jest tests for a JavaScript module"
---

Generate comprehensive Jest unit tests for the specified source file.

## Instructions

1. Read the source file to understand all exported functions/methods.
2. Create a test file at the corresponding path under `tests/` (mirroring the `src/` structure).
3. For each exported function or public method, create a `describe` block with:
   - Happy path tests with typical inputs
   - Edge case tests: null, undefined, empty string, 0, negative values, boundary values
   - Error path tests: invalid types, missing required parameters
   - Type coercion tests where applicable
4. Use the `test` keyword (not `it`).
5. Follow AAA pattern (Arrange → Act → Assert) with blank line separation.
6. For classes, use `beforeEach` to create fresh instances.
7. Use descriptive test names: `should <behavior> when <condition>`.
8. Run `npm test` to verify all tests pass.
9. Run `npm run test:coverage` to verify coverage meets 80% threshold.

## Example Test Structure

```javascript
const { functionName } = require('../../src/module/file');

describe('functionName', () => {
  test('should return expected result for valid input', () => {
    const result = functionName('valid input');

    expect(result).toBe('expected');
  });

  test('should return empty string when input is null', () => {
    const result = functionName(null);

    expect(result).toBe('');
  });

  test('should throw error when required param is missing', () => {
    expect(() => functionName()).toThrow();
  });
});
```
