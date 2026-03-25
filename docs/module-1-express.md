# Module 1 Express — AI-Assisted Test Automation (25 min)

**Time estimate:** 25 minutes
**Prerequisites:** VS Code with GitHub Copilot extension, Node.js installed, `npm install` completed

## Overview

Generate comprehensive tests using Copilot agent mode, diagnose a failing test with AI assistance, and understand the CI quality gate — all in a condensed, hands-on session.

---

## Explore AI Customization ⏱ 2 min

Before writing any code, see how this project guides Copilot automatically.

1. Open `.github/copilot-instructions.md` — these repo-wide instructions tell Copilot about project conventions (Jest, ES6 modules, 80% coverage targets).
2. Browse `.github/skills/jest-test-gen/SKILL.md` — this agent skill gives Copilot a structured approach for generating tests: analyze → generate → validate → iterate.
3. Open `.github/prompts/generate-tests.prompt.md` — a reusable prompt file you can invoke directly from Copilot Chat.

**Key insight:** Copilot already knows your project's testing conventions before you type a single prompt.

---

## Exercise 1 — Generate Tests with Agent Mode ⏱ 10 min

### Goal

Use Copilot agent mode to generate a complete test suite for the ShoppingCart class.

### Steps

1. Open Copilot Chat in VS Code and switch to **Agent mode** (select the agent icon or use `@workspace`).
2. Enter this prompt:

   ```
   Generate comprehensive Jest tests for src/cart/ShoppingCart.js covering all
   public methods. Follow the project's testing conventions.
   ```

3. Watch agent mode work — it will:
   - Read `ShoppingCart.js` to understand all 12 methods
   - Check existing test patterns in `tests/cart/ShoppingCart.test.js`
   - Generate tests for `addItem`, `removeItem`, `updateQuantity`, `applyDiscount`, `getTotal`, and more
   - Run `npm test` to verify
   - Iterate on any failures automatically

4. Review the generated tests. Look for:
   - Edge cases (empty cart, invalid quantities, duplicate items)
   - Boundary conditions (discount limits, negative values)
   - Test isolation (each test starts with a fresh cart)

### Checkpoint

- [ ] ShoppingCart test file has tests for all 12 public methods
- [ ] `npm test` passes with no failures in the generated tests
- [ ] Tests follow the project's `describe`/`it` nesting pattern

---

## Exercise 2 — Fix Loop ⏱ 8 min

### Goal

Diagnose and fix the intentional failing test using Copilot's contextual understanding.

### Steps

1. Run the test suite:

   ```bash
   npm test
   ```

2. Observe the failing `validatePassword` test in `tests/utils/validators.test.js`.

3. Select both the failing test and the `validatePassword` function in `src/utils/validators.js`, then ask Copilot:

   ```
   This test is failing — which is wrong, the test or the function?
   ```

4. Copilot will analyze the assertion vs. the implementation and identify the mismatch.

5. Apply the fix Copilot suggests.

6. Run tests again to confirm:

   ```bash
   npm test
   ```

### Checkpoint

- [ ] Identified whether the bug was in the test or the function
- [ ] Applied the fix and all tests pass
- [ ] Understood the test → fail → diagnose → fix → pass cycle with Copilot

---

## Demo — CI Quality Gate ⏱ 5 min

Walk through the CI pipeline that enforces test quality on every PR.

1. **Test workflow** (`.github/workflows/ci.yml`) — runs 3 jobs:
   - `test` — runs `npm test` with coverage
   - `quality-gate` — runs `scripts/check-coverage.js` to enforce 80% threshold
   - `pr-comment` — posts coverage summary on the PR

2. **Coverage checker** (`scripts/check-coverage.js`) — parses Jest coverage output and fails the build if any metric drops below 80%.

3. **Branch protection** — the quality gate is a required status check. A PR without sufficient test coverage cannot be merged.

**Takeaway:** Copilot accelerates test writing, and the CI gate ensures quality stays high.

---

## Go Further

- 📖 Complete the full module: [Module 1 — AI-Assisted Test Automation](module-1-test-automation.md)
- Generate tests for `src/utils/stringHelpers.js` (9 functions, great for practicing prompt refinement)
- Explore the `jest-test-gen` skill — open `.github/skills/jest-test-gen/SKILL.md` and try invoking it
- Experiment with `.github/prompts/generate-tests.prompt.md` from Copilot Chat

---

## Key Takeaways

| Topic | What You Learned |
|-------|-----------------|
| Agent Mode | Copilot agent mode reads files, generates code, runs tests, and iterates — all autonomously |
| AI Customization | Repo-level instructions and skills guide Copilot to follow your project conventions |
| Fix Loop | The diagnose → fix → verify cycle is dramatically faster with Copilot's contextual analysis |
| CI Quality Gate | Automated coverage checks ensure AI-generated tests meet your quality bar |
