---
mode: agent
description: "Refactor legacy JavaScript code to improve maintainability"
---

Refactor the specified legacy JavaScript file to improve maintainability, readability, and testability.

## Refactoring Checklist

1. **Analyze first**: Identify code smells before making changes.
   - Functions longer than 30 lines
   - `var` usage (replace with `const`/`let`)
   - Hardcoded values (extract to constants or lookup objects)
   - Mixed concerns (I/O mixed with business logic)
   - Duplicated logic
   - Swallowed errors (empty catch blocks)
   - God functions doing too many things

2. **Run existing tests** before any changes: `npm test`

3. **Refactor one concern at a time**:
   - Extract validation logic into a separate module
   - Extract calculation logic into pure functions
   - Extract I/O operations into a repository/persistence module
   - Replace if/else chains with lookup objects
   - Replace `var` with `const`/`let`
   - Add proper error handling for empty catch blocks

4. **After each extraction**:
   - Run `npm test` to verify nothing broke
   - Ensure the original module's public API (module.exports) is unchanged

5. **Generate tests** for each new extracted module.

6. **Final verification**:
   - All original tests pass
   - No function exceeds 30 lines
   - No `var` keywords remain
   - Coverage has improved: `npm run test:coverage`

## Target Structure

```
src/orders/
├── orderProcessor.js     ← Orchestrator only (~20-30 lines per function)
├── orderValidator.js     ← Validation logic
├── taxCalculator.js      ← Tax rate lookup + calculation
├── shippingCalculator.js ← Shipping tier logic
└── orderRepository.js    ← File I/O for orders
```
