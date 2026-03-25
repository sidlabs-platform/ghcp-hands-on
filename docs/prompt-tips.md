# Prompt Engineering Tips for GitHub Copilot

> **Quick reference for getting better results from AI-assisted development**

---

## 1. General Principles

1. **Be specific and provide context** — Include function names, file paths, frameworks, and expected behavior.
2. **Show examples of what you want** — A single input/output example is worth a paragraph of description.
3. **Break complex tasks into steps** — Number your steps so Copilot can tackle them sequentially.
4. **Specify constraints** — Mention the language, framework, coding patterns, and style you expect.
5. **Tell Copilot what NOT to do** — "Don't use any external libraries" or "Don't modify the public API" prevents unwanted changes.
6. **Iterate, don't restart** — If the first result is 80% right, refine with a follow-up rather than rewriting the whole prompt.
7. **Keep prompts focused** — One clear task per prompt beats a multi-paragraph wish list.

---

## 2. Copilot Chat Prompts

| Task | Good Prompt | Why It Works |
|------|-------------|--------------|
| **Test generation** | "Generate Jest tests for `src/utils/validators.js` covering `validateEmail`. Include: valid emails, missing `@`, null input, emails with spaces, subdomains. Use `describe`/`test` blocks." | Names the file, function, test framework, specific cases, and desired structure. |
| **Bug diagnosis** | "This test fails with 'Expected true, Received false'. The function validates passwords require a special character. The test passes `'MyPassword1'`. Is the test wrong or the function? Show the fix." | Gives the error message, explains intent, provides the failing input, and asks for a directed answer. |
| **Code review** | "Review this function for code smells. List each issue with line number, severity (high/medium/low), and specific refactoring suggestion." | Requests structured output so nothing is vague or hand-wavy. |
| **Security audit** | "Audit this file for OWASP Top 10 vulnerabilities. For each finding, provide CWE number, severity, and a code fix." | Scopes the review to a known standard and demands actionable output. |
| **Performance** | "Profile this function for time complexity. Suggest an optimization that keeps the same interface and add a benchmark test." | States the goal, a constraint (same interface), and a verification step. |
| **Documentation** | "Write JSDoc comments for every exported function in this file. Include `@param`, `@returns`, and a one-line usage example." | Specifies the doc format, scope, and what each comment must contain. |

---

## 3. Agent Mode Prompts

Agent mode can read files, edit code, and run terminal commands autonomously. Help it succeed with structured prompts:

- **Start with the goal**, then list concrete steps.
- **Name the files** to read or modify — don't make the agent guess.
- **Ask it to run tests** after each change so regressions are caught immediately.
- **Set boundaries** — state which files or APIs must not change.
- **Describe the "done" state** — what does success look like? ("All tests pass", "No TypeScript errors", etc.)
- **Mention related files** — if a change in one file requires updates elsewhere, say so up front.

### Example prompt

> Refactor `src/orders/orderProcessor.js`:
>
> 1. Extract the validation logic (lines 12–40) into a new file `src/orders/orderValidator.js` and export a `validateOrder` function.
> 2. Extract the tax calculation (lines 55–80) into `src/orders/taxCalculator.js` using a lookup object instead of the switch statement.
> 3. Replace all `var` declarations with `const` or `let` as appropriate.
> 4. Update imports in any file that references the moved code.
> 5. Run `npm test` after each change to verify nothing broke.

### Why this works

| Technique | Benefit |
|-----------|---------|
| Numbered steps | Agent executes in order, easier to debug if a step fails |
| Specific file paths | No ambiguity about where code lives |
| "Run tests after each change" | Catches regressions incrementally |
| Describes *how* (lookup object) | Guides the design, not just the goal |

---

## 4. Coding Agent (GitHub Issues)

When you open an issue for Copilot Coding Agent to auto-generate a PR, treat the issue body like a mini-spec:

### Tips

- **Use clear acceptance criteria** with checkboxes (`- [ ]`) so progress is measurable.
- **Specify what should NOT change** — public API, existing tests, database schema, etc.
- **Include examples** of expected input/output so the agent can write matching tests.
- **Reference specific files and line numbers** to reduce search time and hallucination risk.
- **Keep scope small** — one feature or fix per issue works better than a multi-feature epic.

### Example issue body

> **Tip:** The more your issue reads like a test specification, the better the resulting PR will be.

```markdown
## Add rate limiting to POST /api/orders

### Context
The orders endpoint (`src/routes/orders.ts`, line 24) currently has no
rate limiting. We need to add a per-user limit of 10 requests/minute.

### Acceptance criteria
- [ ] Add rate-limiting middleware using `express-rate-limit`
- [ ] Apply only to `POST /api/orders`, not GET routes
- [ ] Return `429 Too Many Requests` with a JSON body: `{ "error": "Rate limit exceeded" }`
- [ ] Add tests in `tests/routes/orders.test.ts` for the 429 scenario
- [ ] Do NOT change existing order-creation logic or tests

### Example response (429)
Status: 429
Body: { "error": "Rate limit exceeded" }
```

---

## 5. Anti-Patterns to Avoid

| Anti-Pattern | Problem | Better Approach |
|--------------|---------|-----------------|
| "Fix this code" | Too vague — Copilot doesn't know what's broken | "This function returns `NaN` when the input array is empty. Add a guard clause that returns `0`." |
| "Write all the tests" | Too broad — generates shallow, unfocused tests | "Write tests for `calculateTotal` covering: empty cart, single item, discount codes, and negative quantities." |
| "Make it secure" | No actionable direction | "Sanitize the `name` query parameter against SQL injection using parameterized queries." |
| "Refactor everything" | Scope is unbounded | "Extract the validation logic from `processOrder` into a pure function and add unit tests for it." |
| Blindly accepting generated code | May contain bugs, vulnerabilities, or logic errors | Always read the diff, run tests, and verify edge cases before committing. |
| Pasting huge files with no guidance | Copilot lacks focus, gives generic advice | Highlight the relevant section and state exactly what you need help with. |

---

## 6. Skill-Aware Prompting

Copilot agent skills inject project-specific context automatically, so you can write shorter prompts.

- **Skills provide conventions for you** — If a `jest-test-gen` skill is active, saying "generate tests for `src/utils/parser.js`" is enough. The skill already knows your test directory, naming conventions, and preferred matchers.
- **Keywords trigger skills** — Skills activate when your prompt matches their description. Phrases like "generate tests", "create unit tests", or "add test coverage" can trigger a testing skill.
- **Check active skills** — Use the `/skills` command to see which skills are available and what keywords activate them.
- **Don't fight the skill** — If a skill enforces a pattern (e.g., test file location), work with it rather than overriding it manually.

### With vs. without a skill

| Scenario | Without Skill | With Skill Active |
|----------|---------------|-------------------|
| Test generation | "Generate Jest tests in `tests/` using `describe`/`test` blocks, import from `../src/utils/parser.js`, use `toBe` and `toThrow` matchers…" | "Generate tests for `src/utils/parser.js`" |
| Code style | "Use 2-space indentation, single quotes, trailing commas, no semicolons…" | Style is applied automatically from project config |

> **Pro tip:** When a skill is active, you can still override its defaults by adding explicit instructions.
> For example: "Generate tests for `parser.js` but put them in `__tests__/` instead of `tests/`."

---

## 7. Iterating on Results

Even great prompts sometimes need a follow-up. Use these techniques to refine:

- **Narrow the scope** — "That's close, but only apply the change to the `handleSubmit` function."
- **Add a missed constraint** — "Good, but use `async/await` instead of `.then()` chains."
- **Request an alternative** — "Show me another approach that avoids recursion."
- **Ask for explanation** — "Why did you choose a Map over a plain object here?"
- **Escalate detail** — "Add error handling for network failures and invalid JSON."

Treat the conversation as a collaboration — each follow-up sharpens the output.

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│  THE 5-PART PROMPT FORMULA                          │
│                                                     │
│  1. CONTEXT   → What file/function/module?          │
│  2. GOAL      → What should the result look like?   │
│  3. EXAMPLES  → Sample input → expected output      │
│  4. CONSTRAINTS → What to use / what to avoid       │
│  5. VERIFY    → "Run tests" / "Show me the diff"    │
└─────────────────────────────────────────────────────┘
```

---

> **Remember:** AI-generated code is a starting point, not a final answer. Always review, test, and verify.

<!-- Last updated: 2025 · GitHub Copilot Workshop -->
