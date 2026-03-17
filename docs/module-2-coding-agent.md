# Module 2 — Coding Agent: Task to Refactor

## Overview

In this module you will use **GitHub Copilot Coding Agent** (powered by Copilot Workspace) to delegate refactoring tasks via GitHub Issues, have the agent generate a pull request automatically, analyze legacy code patterns, and use Copilot for automated PR review.

**Time estimate:** 60–90 minutes  
**Prerequisites:** GitHub repository with Copilot enabled, Copilot Coding Agent enabled in repository settings (Settings → Copilot → Coding Agent), completion of Module 1 (for test safety net)

---

## Background — The Legacy Code

The file `src/orders/orderProcessor.js` is a deliberately "legacy-style" module with these code smells:

| Smell | Location | Description |
|-------|----------|-------------|
| God function | `processOrder()` | 130+ line function doing validation, calculation, persistence, and presentation |
| Global mutable state | `orderCounter` | Shared counter that isn't thread-safe and makes testing difficult |
| Hardcoded values | Tax rates, discount codes | Business rules are buried in if/else chains |
| Mixed concerns | File I/O in business logic | Order persistence is interleaved with order calculation |
| `var` everywhere | Entire file | Uses pre-ES6 `var` instead of `const`/`let` |
| Swallowed errors | File write block | `catch (err) {}` silently ignores write failures |
| Duplicated logic | Subtotal calculation | Cart's subtotal logic is reimplemented instead of reused |

---

## Exercise 1 — Task Delegation → Auto-Generated PR

### Goal

Create a GitHub Issue describing a refactoring task, assign it to Copilot Coding Agent, and receive an auto-generated PR.

### Step-by-step

#### 1.1 Create a refactoring issue

1. In your GitHub repository, go to **Issues → New Issue**.
2. Create an issue with the following content:

   **Title:** `Refactor orderProcessor.js — extract validation and tax calculation`

   **Body:**
   ```markdown
   ## Task
   
   Refactor `src/orders/orderProcessor.js` to improve maintainability:
   
   ### Requirements
   1. **Extract validation** — Move customer info validation and payment validation 
      into separate functions: `validateCustomerInfo(info)` and `validatePaymentInfo(info)`.
      Each should return `{ valid: boolean, error?: string }`.
   
   2. **Extract tax calculation** — Move the state-based tax rate lookup into a 
      separate function `getTaxRate(state)` that uses a lookup object instead of 
      if/else chains.
   
   3. **Extract shipping calculation** — Move shipping logic into 
      `calculateShipping(subtotal)`.
   
   4. **Replace `var` with `const`/`let`** — Use modern JavaScript throughout.
   
   5. **Keep all existing tests passing** — Do not change the public API 
      (`processOrder`, `getOrderStatus`, `cancelOrder`).
   
   ### Acceptance Criteria
   - [ ] No function longer than 30 lines
   - [ ] Tax rates defined in a data structure, not if/else
   - [ ] All existing tests still pass
   - [ ] No `var` keywords remaining
   ```

3. **Assign Copilot** to the issue:
   - In the issue sidebar, click **Assignees** and select **Copilot** (the bot account).
   - Alternatively, add the label `copilot` if your org uses label-based triggers.

4. Wait for Copilot Coding Agent to process the issue (typically 2–10 minutes).

#### 1.2 Review the auto-generated PR

1. Once Copilot creates the PR, open it and examine:
   - **Files changed** — Does the refactoring follow the requirements?
   - **Commit messages** — Are they clear and descriptive?
   - **PR description** — Does it explain what was done?

2. Check each acceptance criterion:
   - [ ] Are validation functions extracted?
   - [ ] Is the tax rate table a lookup object?
   - [ ] Is shipping logic a separate function?
   - [ ] Are `var` keywords replaced?
   - [ ] Do the existing tests still pass? (check the CI status)

3. **Leave review comments** if the agent missed something. Copilot Coding Agent can respond to review feedback and push additional commits.

### Checkpoint

- [ ] Issue created with clear requirements and acceptance criteria
- [ ] Copilot Coding Agent picked up the issue
- [ ] PR was auto-generated with refactored code
- [ ] CI tests pass on the PR

---

## Exercise 2 — Legacy Code Analysis & Refactoring

### Goal

Use Copilot (editor + chat) to analyze legacy code, identify smells, and perform a deeper refactoring that the Coding Agent might not fully handle.

### Step-by-step

#### 2.1 Analyze with Copilot Chat

1. Open `src/orders/orderProcessor.js` in VS Code.
2. Select the entire file and ask Copilot Chat:
   ```
   Analyze this code for code smells, anti-patterns, and maintainability issues. 
   List each issue with its line number and severity (high/medium/low). 
   Suggest specific refactoring strategies for each.
   ```
3. Compare Copilot's analysis with the table in the Background section above. Did Copilot find issues you didn't expect?

#### 2.2 Deep refactoring — Separate concerns

This goes beyond Exercise 1's scope. Create a new branch:

```bash
git checkout -b refactor/order-processor-deep
```

Use Copilot Chat to generate the refactored code step by step:

1. **Extract an OrderValidator class/module:**
   ```
   Extract the customer and payment validation from processOrder into a new file 
   src/orders/orderValidator.js. Export validateCustomerInfo and validatePaymentInfo 
   functions. Each returns { valid: boolean, error?: string }.
   ```

2. **Extract a TaxCalculator module:**
   ```
   Create src/orders/taxCalculator.js with a TAX_RATES lookup object and a 
   getTaxRate(stateCode) function. Include all states from the original code 
   plus the default rate.
   ```

3. **Extract a ShippingCalculator module:**
   ```
   Create src/orders/shippingCalculator.js with a calculateShipping(subtotal) 
   function implementing the tiered shipping logic.
   ```

4. **Extract an OrderRepository module:**
   ```
   Create src/orders/orderRepository.js that handles reading/writing order JSON 
   files. Export saveOrder(order) and loadOrder(orderId) functions.
   ```

5. **Refactor processOrder to use the new modules:**
   ```
   Refactor processOrder in orderProcessor.js to import and use the extracted 
   modules. The function should now be under 30 lines and only orchestrate 
   the workflow.
   ```

#### 2.3 Generate tests for extracted modules

Use Copilot to generate tests for each new module:

```
Generate Jest tests for src/orders/orderValidator.js covering all validation 
rules: missing fields, valid inputs, edge cases for card number length.
```

Repeat for `taxCalculator.js`, `shippingCalculator.js`, and `orderRepository.js`.

#### 2.4 Verify everything works

```bash
npm test
npm run test:coverage
```

All original tests should still pass, and coverage should be higher due to the new focused tests.

### Checkpoint

- [ ] Copilot identified ≥5 code smells in the analysis
- [ ] Created 4 extracted modules (validator, tax, shipping, repository)
- [ ] `processOrder` is now ≤30 lines
- [ ] All original + new tests pass
- [ ] Coverage increased compared to before refactoring

---

## Exercise 3 — PR Auto-Review

### Goal

Experience both **Copilot Code Review** (automatic on PRs) and manual review practices when evaluating AI-generated refactoring PRs.

### Step-by-step

#### 3.1 Push and create a PR

```bash
git push origin refactor/order-processor-deep
```

Open a Pull Request against `main` on GitHub.

#### 3.2 Observe Copilot Code Review

1. If your repository has **Copilot Code Review** enabled:
   - Watch for Copilot review comments appearing on the PR.
   - Copilot analyzes the diff and may flag issues like:
     - Unused imports
     - Error handling gaps
     - Style inconsistencies
     - Potential bugs

2. If Copilot Code Review is not available, you can simulate by:
   - Opening the PR diff in VS Code
   - Selecting changed code and asking Copilot Chat:
     ```
     Review this refactored code for bugs, edge cases, and improvements. 
     Focus on: error handling, input validation, and whether the public API 
     contract is preserved.
     ```

#### 3.3 Request Copilot review explicitly

On the PR page in GitHub:
1. Click **Reviewers** in the sidebar.
2. Select **Copilot** as a reviewer.
3. Wait for the review to complete.
4. Read through each comment — do you agree with Copilot's suggestions?

#### 3.4 Address review feedback

1. For each Copilot review comment, decide:
   - **Accept:** Apply the suggested change
   - **Dismiss:** Explain why the suggestion doesn't apply
   - **Modify:** Use the suggestion as inspiration but implement differently

2. Push fixes and watch Copilot re-review.

#### 3.5 Evaluate the auto-review quality

Answer these questions in a brief written reflection:

1. Did Copilot's review catch real issues that a human might miss?
2. Were there false positives (suggestions that would worsen the code)?
3. How does Copilot review compare to a human senior developer review?
4. What types of issues is Copilot review best/worst at catching?

### Checkpoint

- [ ] PR created from the refactoring branch
- [ ] Copilot Code Review comments received (or simulated)
- [ ] At least 2 review comments addressed
- [ ] Reflection on AI review quality completed
- [ ] PR merged after review

---

## Key Takeaways

| Topic | What You Learned |
|-------|-----------------|
| Coding Agent | GitHub Issues with clear acceptance criteria produce better auto-generated PRs |
| Legacy Analysis | Copilot can rapidly identify code smells but may miss domain-specific issues |
| Extract & Refactor | Breaking large functions into focused modules improves testability and readability |
| PR Auto-Review | Copilot review catches mechanical issues well; architectural judgment still requires humans |
| Issue Quality | The quality of the Issue description directly impacts the quality of the Coding Agent's output |
