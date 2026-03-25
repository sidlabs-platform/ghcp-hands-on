# Module 2 Express — Coding Agent: Task to Refactor (25 min)

**Time estimate:** 25 minutes
**Prerequisites:** Module 1 completion recommended, GitHub repo with Copilot Coding Agent enabled

## Overview

Delegate a refactoring task to the Copilot Coding Agent via a GitHub Issue, then perform the same refactoring interactively with agent mode — comparing async delegation vs. real-time collaboration.

---

## Agent Skills for Refactoring ⏱ 2 min

See how skills and prompt files guide AI-driven refactoring.

1. Open `.github/skills/js-refactor/SKILL.md` — this skill teaches Copilot a structured refactoring approach: analyze smells → plan extraction → refactor → validate → verify tests.
2. Open `.github/prompts/refactor-legacy.prompt.md` — a reusable prompt that targets `orderProcessor.js` specifically.
3. Note: these files guide **both** the Coding Agent (async, creates PRs) and agent mode (interactive, real-time).

**Key insight:** Agent skills improve AI output quality by providing domain-specific context and a repeatable methodology.

---

## Exercise 1 — Task Delegation ⏱ 5 min

### Goal

Create a GitHub Issue and assign it to the Copilot Coding Agent.

### Steps

1. Go to your repository on GitHub and create a new Issue.

2. Use this title:

   ```
   Refactor orderProcessor.js — extract validation and tax calculation
   ```

3. Use this body:

   ```markdown
   ## Requirements
   - Extract order validation into `src/orders/orderValidator.js`
   - Extract tax calculation into `src/orders/taxCalculator.js`
   - Extract shipping calculation into `src/orders/shippingCalculator.js`
   - Replace all `var` declarations with `const`/`let`
   - Remove hardcoded tax rates — use a configuration object
   - Add proper error handling (no swallowed catches)
   - Keep all existing exports working

   ## Acceptance Criteria
   - [ ] All existing tests pass (`npm test`)
   - [ ] No `var` declarations remain
   - [ ] Each extracted module has a single responsibility
   - [ ] No hardcoded magic numbers
   ```

4. Assign the Issue to **Copilot**.

The Coding Agent will begin working in the background — creating a branch, making changes, and opening a PR.

### Checkpoint

- [ ] Issue created with clear requirements and acceptance criteria
- [ ] Issue assigned to Copilot

---

## Exercise 2 — Agent Mode Refactoring ⏱ 13 min

### Goal

While the Coding Agent works asynchronously, perform the same refactoring interactively using VS Code agent mode.

### Steps

1. Open Copilot Chat in VS Code and switch to **Agent mode**.

2. Enter this prompt:

   ```
   Analyze src/orders/orderProcessor.js for code smells, then refactor it:
   extract validation into orderValidator.js, tax calculation into
   taxCalculator.js, shipping into shippingCalculator.js. Replace var with
   const/let. Keep all exports working. Run tests after each change.
   ```

3. Watch agent mode work through the refactoring:
   - **Reads** `orderProcessor.js` to identify the 7+ code smells (god function, `var` usage, hardcoded values, swallowed errors, mixed concerns)
   - **Creates** new module files with extracted logic
   - **Updates** `orderProcessor.js` to import from the new modules
   - **Runs** `npm test` after each change to verify nothing breaks
   - **Iterates** on any test failures

4. Review the extracted modules. Each should have a single responsibility:
   - `orderValidator.js` — input validation only
   - `taxCalculator.js` — tax rate lookup and calculation
   - `shippingCalculator.js` — shipping cost determination

5. **Compare the two approaches:**

   | Aspect | Agent Mode (VS Code) | Coding Agent (GitHub) |
   |--------|---------------------|-----------------------|
   | Speed | Instant, interactive | Async, minutes to hours |
   | Control | You guide each step | Fully autonomous |
   | Output | Direct file changes | Branch + PR |
   | Best for | Exploration, learning | Routine tasks, delegation |

### Checkpoint

- [ ] `orderProcessor.js` refactored with extracted modules
- [ ] All `var` declarations replaced with `const`/`let`
- [ ] `npm test` passes after refactoring

---

## Demo — PR Auto-Review ⏱ 5 min

Check on the Coding Agent's progress and review its work.

1. Go to GitHub and check if the Coding Agent has opened a PR from the Issue you created.

2. **If the PR is ready:**
   - Review the auto-generated PR description and commit messages
   - Request **Copilot Code Review** on the PR (click "Review" → select Copilot as reviewer)
   - Walk through the review comments — Copilot checks for correctness, style, and potential issues
   - Note: the Coding Agent can respond to review feedback and push additional commits

3. **If the PR is not ready yet:**
   - Check the Issue for status updates from the Coding Agent
   - The agent typically creates a branch, makes iterative commits, then opens the PR
   - You can revisit later — the PR will appear when the agent finishes

**Takeaway:** The Coding Agent turns Issues into working PRs. Copilot Code Review adds an automated quality check before human review.

---

## Go Further

- 📖 Complete the full module: [Module 2 — Coding Agent: Task to Refactor](module-2-coding-agent.md)
- Try the deep refactoring exercise from the full module (larger scope, more code smells)
- Generate tests for your extracted modules using the `jest-test-gen` skill
- Experiment with `.github/prompts/refactor-legacy.prompt.md` for different refactoring scenarios

---

## Key Takeaways

| Topic | What You Learned |
|-------|-----------------|
| Coding Agent | Assign a GitHub Issue to Copilot and it delivers a working PR autonomously |
| Agent Mode | Interactive refactoring in VS Code gives real-time control over AI-driven changes |
| Agent Skills | Skills improve AI output quality by providing domain-specific context and methodology |
| Code Review | Copilot Code Review provides automated feedback on PRs before human review |
