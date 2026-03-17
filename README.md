# GitHub Copilot Hands-On Workshop

Practical exercises for AI-assisted development using **GitHub Copilot**, **Copilot Coding Agent**, **Copilot Code Review**, and **GitHub Advanced Security (GHAS)**.

---

## Workshop Structure

| Module | Title | Focus Area | Time |
|--------|-------|-----------|------|
| [Module 1](docs/module-1-test-automation.md) | AI-Assisted Test Automation | Copilot test generation, iterative fix loop, CI quality gates | 60–90 min |
| [Module 2](docs/module-2-coding-agent.md) | Coding Agent: Task to Refactor | Issue→PR automation, legacy code refactoring, PR auto-review | 60–90 min |
| [Module 3](docs/module-3-security-review.md) | Code Review Agent + GHAS Security Scan | Code review agent, CodeQL vulnerability detection, AI fix verification | 60–90 min |

---

## Prerequisites

- **GitHub Account** with Copilot access (Individual, Business, or Enterprise)
- **VS Code** with the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension
- **Node.js 20+** and npm
- **Git** CLI
- A **GitHub repository** (public repos get free GHAS features for Module 3)

### Required GitHub Features

| Feature | Needed For | How to Enable |
|---------|-----------|---------------|
| GitHub Copilot | All modules | Subscription at github.com/features/copilot |
| Copilot Chat | All modules | Included with Copilot subscription |
| Copilot Coding Agent | Module 2 | Settings → Copilot → Enable Coding Agent |
| Copilot Code Review | Modules 2 & 3 | Settings → Copilot → Enable Code Review |
| CodeQL / GHAS | Module 3 | Settings → Code security and analysis |

---

## Quick Start

```bash
# 1. Clone or initialize the project
git clone <your-repo-url>
cd ghcp-hands-on

# 2. Install dependencies
npm install

# 3. Run existing tests (expect 1 intentional failure)
npm test

# 4. Check coverage baseline
npm run test:coverage
```

---

## Project Structure

```
ghcp-hands-on/
├── src/
│   ├── utils/
│   │   ├── validators.js          ← Module 1: test generation target
│   │   └── stringHelpers.js       ← Module 1: additional practice
│   ├── cart/
│   │   └── ShoppingCart.js        ← Modules 1 & 2: test + refactor target
│   ├── orders/
│   │   └── orderProcessor.js      ← Module 2: legacy code to refactor
│   └── services/
│       └── UserService.js         ← Module 3: vulnerable code for security scan
├── tests/
│   ├── utils/
│   │   └── validators.test.js     ← Module 1: incomplete starter tests
│   └── cart/
│       └── ShoppingCart.test.js   ← Module 1: incomplete starter tests
├── scripts/
│   └── check-coverage.js         ← Module 1: CI quality gate script
├── .github/
│   └── workflows/
│       ├── ci.yml                 ← Module 1: test & coverage CI
│       └── security.yml           ← Module 3: CodeQL & dependency review
├── docs/
│   ├── module-1-test-automation.md
│   ├── module-2-coding-agent.md
│   └── module-3-security-review.md
├── package.json
├── jest.config.js
└── README.md                      ← You are here
```

---

## Module Summaries

### Module 1 — AI-Assisted Test Automation

| Exercise | What You Do |
|----------|------------|
| **1.1** Copilot Test Generation | Use Copilot inline + Chat to generate tests for `validators.js` and `ShoppingCart.js` |
| **1.2** Iterative Fix Loop | Find & fix a deliberately broken test using Copilot's diagnostic ability |
| **1.3** CI Quality Gate | Push code, observe CI runs, configure branch protection to enforce 80% coverage |

**Key skill:** Using Copilot to rapidly build a test suite while critically reviewing generated assertions.

### Module 2 — Coding Agent: Task to Refactor

| Exercise | What You Do |
|----------|------------|
| **2.1** Task Delegation | Write a GitHub Issue with clear acceptance criteria, assign to Copilot Coding Agent, review the auto-generated PR |
| **2.2** Deep Refactoring | Use Copilot Chat to analyze legacy code smells and extract `orderProcessor.js` into focused modules |
| **2.3** PR Auto-Review | Request Copilot Code Review on your refactoring PR, evaluate review quality |

**Key skill:** Writing effective issue descriptions that produce high-quality auto-generated PRs.

### Module 3 — Code Review Agent + GHAS Security Scan

| Exercise | What You Do |
|----------|------------|
| **3.1** Code Review Agent | Create a PR with vulnerable code, observe Copilot's security-related review comments |
| **3.2** Vulnerability Detection | Enable CodeQL, interpret scan results and data flow visualizations, remediate 8 vulnerabilities |
| **3.3** AI Output Verification | Write security tests to verify fixes, check for bypass potential, map to OWASP Top 10 |

**Key skill:** Using AI tools as one layer of defense, while verifying their output through testing and manual review.

---

## Intentional Design Choices

This workshop uses **intentionally imperfect code** to create realistic learning scenarios:

- `validators.test.js` has a **deliberately wrong assertion** for the fix-loop exercise
- `orderProcessor.js` has **multiple code smells** (god function, var, hardcoded values, mixed concerns)
- `UserService.js` has **8 security vulnerabilities** spanning OWASP Top 10 categories
- Test suites are **intentionally incomplete** so students practice generation, not just reading

---

## Tips for Facilitators

1. **Pre-check:** Ensure all participants have Copilot access and can see completions in VS Code before starting.
2. **Module independence:** Modules 1, 2, and 3 can be done in any order, though the numbered sequence is recommended since Module 1 builds the test safety net used in Module 2.
3. **Copilot variability:** Copilot's suggestions vary between runs. Embrace this as a teaching moment — review generated code critically, don't blindly accept.
4. **GHAS availability:** For Module 3, public repos get free CodeQL. For private repos, you need a license. Plan accordingly.
5. **Time management:** Each module is 60–90 minutes. For a half-day workshop, pick 2 modules. For a full day, do all 3 with breaks.

---

## License

MIT
