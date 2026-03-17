# Module 1 — AI-Assisted Test Automation

## Overview

In this module you will use **GitHub Copilot** to generate unit tests, practice an iterative fix loop when tests fail, and configure a CI quality gate that enforces coverage thresholds before merging.

**Time estimate:** 60–90 minutes  
**Prerequisites:** Node.js 20+, npm, Git, VS Code with GitHub Copilot extension, a GitHub repository

---

## Setup

```bash
# Clone/init the repo and install dependencies
cd ghcp-hands-on
npm install

# Run the existing (incomplete) tests to see current state
npm test
```

You should see some passing tests, one **failing test** (intentional), and many untested functions.

---

## Exercise 1 — Copilot Unit Test Generation

### Goal

Use GitHub Copilot to generate comprehensive unit tests for the `validators.js` and `ShoppingCart.js` modules.

### Step-by-step

#### 1.1 Generate validator tests

1. Open `tests/utils/validators.test.js` in VS Code.
2. Notice the `// TODO` comments marking where tests are missing.
3. Place your cursor inside the empty `describe('sanitizeInput', ...)` block.
4. **Technique A — Inline completion:** Start typing a `test(` call and let Copilot autocomplete the test name and body. Accept with `Tab`, then repeat for additional cases.
5. **Technique B — Chat:** Open Copilot Chat (`Ctrl+L`) and prompt:
   ```
   Generate comprehensive Jest unit tests for the sanitizeInput function in src/utils/validators.js. 
   Cover: HTML entities, script tags, nested tags, non-string inputs, empty strings.
   ```
6. Review the generated tests. Do they cover edge cases? Adjust if needed.
7. Repeat for `validateAge`, `validateURL`, and `validatePhoneNumber`.

#### 1.2 Generate ShoppingCart tests

1. Open `tests/cart/ShoppingCart.test.js`.
2. Use Copilot Chat with the file open:
   ```
   Generate Jest tests for all untested methods in ShoppingCart.js: removeItem, updateQuantity, 
   applyDiscount (all 5 codes + invalid code), getDiscountAmount, getTax, getTotal, getItemCount, 
   clear, getSummary. Follow the same beforeEach pattern already in the file.
   ```
3. Paste the generated tests into the file.
4. Run `npm test` to verify they pass.

#### 1.3 Verify coverage improvement

```bash
npm run test:coverage
```

Check the coverage report in the terminal. Target: **80%+ across all metrics**.

### Checkpoint

- [ ] `sanitizeInput` has ≥5 test cases
- [ ] `validateAge` has edge cases for 0, 150, -1, 151, NaN, strings
- [ ] `validatePhoneNumber` covers international formats, spaces, dashes
- [ ] `ShoppingCart` has tests for all public methods
- [ ] `npm run test:coverage` shows ≥80% line coverage

---

## Exercise 2 — Iterative Fix Loop: Test Failure → Copilot Correction

### Goal

Practice the workflow: run tests → see failure → use Copilot to diagnose and fix → re-run tests.

### Step-by-step

#### 2.1 Identify the failing test

1. Run `npm test`. Observe the failure in `validators.test.js`:
   ```
   validatePassword > should reject password without special character
   Expected: true
   Received: false
   ```
2. The test assertion is wrong — the test says `MyPassword1` (no special char) should pass, but the validator correctly rejects it.

#### 2.2 Use Copilot to diagnose

1. Select the failing test code and the `validatePassword` function.
2. Ask Copilot Chat:
   ```
   This test is failing. The function validates that passwords must contain a special character. 
   The test expects 'MyPassword1' to return true, but the function returns false. 
   Which is wrong — the test or the function? Fix the incorrect one.
   ```
3. Copilot should identify that the **test assertion is wrong** and suggest changing `toBe(true)` to `toBe(false)`.

#### 2.3 Apply the fix and verify

1. Apply Copilot's suggested fix.
2. Run `npm test` again — all tests should pass.

#### 2.4 Practice with a real bug (instructor-guided)

Introduce a subtle bug into `sanitizeInput`:

```javascript
// In src/utils/validators.js, change the sanitizeInput function:
// Remove the line that escapes single quotes
// .replace(/'/g, '&#x27;')   ← comment out or delete this line
```

1. Run `npm test` — a test should fail (if you wrote a test for single quotes in Exercise 1).
2. Use Copilot to diagnose: select the failing test output and ask Copilot what's wrong.
3. Fix the bug and verify.

If your tests don't catch it, that's a learning moment: **Copilot-generated tests might miss edge cases. Always review generated tests critically.**

### Checkpoint

- [ ] Fixed the `validatePassword` test assertion
- [ ] All tests pass after the fix
- [ ] Successfully practiced the introduce-bug → diagnose → fix loop
- [ ] Understood that AI-generated tests need human review

---

## Exercise 3 — CI Pre-Check Quality Gate

### Goal

Set up a GitHub Actions CI pipeline that runs tests, checks coverage, and blocks merging if coverage drops below 80%.

### Step-by-step

#### 3.1 Review the CI workflow

1. Open `.github/workflows/ci.yml` and read through the three jobs:
   - **test:** Runs tests and uploads coverage
   - **quality-gate:** Checks coverage against thresholds using `scripts/check-coverage.js`
   - **pr-comment:** Posts a coverage summary as a comment on PRs

2. Open `scripts/check-coverage.js` and understand how it reads the coverage report and enforces the 80% threshold.

#### 3.2 Push and trigger CI

1. Create a new GitHub repository (or use an existing one).
2. Push the code:
   ```bash
   git init
   git add .
   git commit -m "feat: initial project with tests and CI"
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. Go to the **Actions** tab in GitHub — the CI workflow should start automatically.
4. Verify that it passes (or fails if coverage is still below 80%).

#### 3.3 Create a PR that fails the quality gate

1. Create a new branch:
   ```bash
   git checkout -b low-coverage-demo
   ```
2. Add a new source file without tests — for example, create `src/utils/dateHelpers.js`:
   ```javascript
   function formatDate(date) {
     if (!(date instanceof Date)) return '';
     return date.toISOString().split('T')[0];
   }
   
   function daysBetween(date1, date2) {
     const diff = Math.abs(date2 - date1);
     return Math.ceil(diff / (1000 * 60 * 60 * 24));
   }
   
   function isWeekend(date) {
     const day = date.getDay();
     return day === 0 || day === 6;
   }
   
   module.exports = { formatDate, daysBetween, isWeekend };
   ```
3. Commit and push, then open a PR:
   ```bash
   git add .
   git commit -m "feat: add date helpers (no tests)"
   git push origin low-coverage-demo
   ```
4. Open a Pull Request on GitHub. Observe:
   - The quality gate job **fails** because coverage dropped.
   - The PR comment shows the per-metric coverage breakdown.

#### 3.4 Fix the PR using Copilot

1. Use Copilot to generate tests for `dateHelpers.js`:
   ```
   Generate Jest tests for src/utils/dateHelpers.js covering formatDate, daysBetween, and isWeekend.
   ```
2. Add the tests, commit, push.
3. The CI should re-run and pass.

#### 3.5 Configure branch protection

1. In GitHub → Settings → Branches → Add rule for `main`:
   - Enable "Require status checks to pass"
   - Select the **quality-gate** job
   - Enable "Require branches to be up to date"
2. Now PRs cannot merge unless coverage meets the threshold.

### Checkpoint

- [ ] CI workflow runs on push and PRs
- [ ] Quality gate correctly blocks low-coverage PRs
- [ ] Coverage comment appears on PRs
- [ ] Branch protection rule is configured
- [ ] Understood end-to-end: write tests with Copilot → CI validates → gate enforces quality

---

## Key Takeaways

| Topic | What You Learned |
|-------|-----------------|
| Copilot Test Generation | Copilot can generate comprehensive tests quickly, but you must review for edge cases and correctness |
| Iterative Fix Loop | The test → fail → diagnose → fix → pass cycle is accelerated with Copilot's contextual understanding |
| CI Quality Gate | Automated coverage enforcement prevents regressions and ensures AI-generated code meets quality bars |
| Human-in-the-Loop | AI-generated tests are a starting point — experienced judgment is still needed for meaningful assertions |
