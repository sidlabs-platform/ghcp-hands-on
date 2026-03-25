# GitHub Copilot Hands-On Workshop

Practical exercises for AI-assisted development using **GitHub Copilot**, **Copilot Coding Agent**, **Copilot Code Review**, **GitHub Advanced Security (GHAS)**, and newer capabilities like **Agent Skills**, **Custom Instructions**, **Agent Mode**, and **Prompt Files**.

---

## Workshop Structure

### Express Format (70 min) — Recommended for live sessions

| Module | Title | Focus Area | Time |
|--------|-------|-----------|------|
| [Module 1](docs/module-1-express.md) | AI-Assisted Test Automation | Agent mode test gen, iterative fix loop, CI quality gate | 25 min |
| [Module 2](docs/module-2-express.md) | Coding Agent: Task to Refactor | Coding Agent + agent mode refactoring, agent skills, PR review | 25 min |
| [Module 3](docs/module-3-express.md) | Code Review Agent + GHAS Security | Security review skill, vulnerability fixes, CodeQL | 20 min |

### Full-Length Format — Self-paced or half-day workshop

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

### New Copilot Features Used

| Feature | Where Configured | Used In |
|---------|-----------------|---------|
| Agent Skills | `.github/skills/` | All modules — domain-specific AI guidance |
| Custom Instructions | `.github/copilot-instructions.md` | All modules — repo-wide AI conventions |
| Path-Specific Instructions | `.github/instructions/` | Modules 1 & 2 — test and source conventions |
| Prompt Files | `.github/prompts/` | All modules — reusable prompt templates |
| Agent Mode | VS Code Copilot Chat | Modules 1 & 2 — multi-step autonomous editing |

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
│   ├── copilot-instructions.md   ← NEW: repo-wide Copilot conventions
│   ├── instructions/
│   │   ├── tests.instructions.md  ← NEW: test-specific AI rules
│   │   └── source.instructions.md ← NEW: source code AI rules
│   ├── skills/
│   │   ├── jest-test-gen/SKILL.md ← NEW: test generation agent skill
│   │   ├── js-refactor/SKILL.md   ← NEW: refactoring agent skill
│   │   └── security-review/SKILL.md ← NEW: security review agent skill
│   ├── prompts/
│   │   ├── generate-tests.prompt.md ← NEW: reusable test gen prompt
│   │   ├── refactor-legacy.prompt.md ← NEW: reusable refactoring prompt
│   │   └── security-audit.prompt.md ← NEW: reusable security audit prompt
│   └── workflows/
│       ├── ci.yml                 ← Module 1: test & coverage CI
│       └── security.yml           ← Module 3: CodeQL & dependency review
├── docs/
│   ├── module-1-express.md        ← NEW: 25-min express guide
│   ├── module-2-express.md        ← NEW: 25-min express guide
│   ├── module-3-express.md        ← NEW: 20-min express guide
│   ├── module-1-test-automation.md ← Full-length guide
│   ├── module-2-coding-agent.md   ← Full-length guide
│   ├── module-3-security-review.md ← Full-length guide
│   └── prompt-tips.md             ← NEW: prompt engineering cheat sheet
├── package.json
├── jest.config.js
└── README.md                      ← You are here
```

---

## Module Summaries

### Module 1 — AI-Assisted Test Automation

| Exercise | What You Do |
|----------|------------|
| **1.1** Copilot Test Generation | Use Copilot agent mode + `jest-test-gen` skill to generate tests for `validators.js` and `ShoppingCart.js` |
| **1.2** Iterative Fix Loop | Find & fix a deliberately broken test using Copilot's diagnostic ability |
| **1.3** CI Quality Gate | Push code, observe CI runs, configure branch protection to enforce 80% coverage |

**Key skill:** Using agent mode with agent skills to rapidly build a test suite while critically reviewing generated assertions.

### Module 2 — Coding Agent: Task to Refactor

| Exercise | What You Do |
|----------|------------|
| **2.1** Task Delegation | Write a GitHub Issue, assign to Copilot Coding Agent (guided by `js-refactor` skill), review auto-generated PR |
| **2.2** Agent Mode Refactoring | Use VS Code agent mode to interactively refactor `orderProcessor.js` into focused modules |
| **2.3** PR Auto-Review | Request Copilot Code Review on your refactoring PR, evaluate review quality |

**Key skill:** Comparing Coding Agent (async Issue→PR) vs Agent Mode (interactive editor-based) for different refactoring scenarios.

### Module 3 — Code Review Agent + GHAS Security Scan

| Exercise | What You Do |
|----------|------------|
| **3.1** AI Security Audit | Use Copilot + `security-review` skill to identify OWASP Top 10 vulnerabilities in `UserService.js` |
| **3.2** Vulnerability Detection | Enable CodeQL, interpret scan results, remediate critical findings with Copilot |
| **3.3** AI Output Verification | Write security tests to verify fixes, check for bypass potential, map to OWASP Top 10 |

**Key skill:** Using AI tools as one layer of defense (agent skills + CodeQL + human review), while verifying their output through testing.

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
4. **Agent skills showcase:** Point out the `.github/skills/` directory early — it demonstrates how teams can codify their conventions for AI assistance.
5. **GHAS availability:** For Module 3, public repos get free CodeQL. For private repos, you need a license. Plan accordingly.
6. **Time management:**
   - **Express format (70 min):** Use the express module guides. Each has timing annotations. Prioritize hands-on exercises over demos.
   - **Half-day workshop:** Pick 2 full-length modules with breaks.
   - **Full-day workshop:** Do all 3 full-length modules with breaks.
7. **New capabilities:** Highlight custom instructions, agent skills, and prompt files as things participants can take back to their own projects immediately.

---

## Prompt Engineering Quick Reference

See **[docs/prompt-tips.md](docs/prompt-tips.md)** for a comprehensive cheat sheet covering:
- Copilot Chat prompts for testing, review, and security
- Agent mode best practices
- Writing effective Coding Agent issues
- Skill-aware prompting patterns
- Common anti-patterns to avoid

---

## Beyond This Workshop — Emerging Copilot Capabilities

Now that you've experienced the core Copilot workflow, here are additional capabilities
worth exploring on your own. Several are already configured in this repository.

---

### 🧩 Agent Skills (`.github/skills/`)

Modular capability packages that teach Copilot domain-specific workflows.
This workshop includes **3 skills**: `jest-test-gen`, `js-refactor`, and `security-review`.

- Create your own: add a `SKILL.md` file with YAML frontmatter and instructions
- Skills are auto-discovered by both VS Code agent mode and Coding Agent

📖 [About Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)

---

### 📋 Custom Instructions (`.github/copilot-instructions.md`)

Repo-wide AI behavior configuration that shapes every Copilot response.

- Path-specific rules with `.instructions.md` files for fine-grained control
- This workshop demonstrates both repo-wide and path-specific approaches

📖 [Use Custom Instructions](https://docs.github.com/en/copilot/tutorials/use-custom-instructions)

---

### 🤖 Agent Mode

Multi-step autonomous coding directly in VS Code.

- Edits multiple files, runs terminal commands, and iterates on errors
- Self-healing: detects test/lint failures and auto-corrects
- Used in **Module 2** for the refactoring exercise

📖 [Introducing Copilot Agent Mode](https://code.visualstudio.com/blogs/2025/02/24/introducing-copilot-agent-mode)

---

### 📝 Prompt Files (`.github/prompts/`)

Reusable, shareable prompt templates for common tasks.

- Invoke from Copilot Chat to standardize team workflows
- This workshop includes prompts for test generation, refactoring, and security audits

---

### 🔌 Agent Plugins (Preview)

Bundle skills, agents, and MCP servers into installable packages.

- Distributed via community repositories and the Awesome Copilot marketplace

📖 [Agent Plugins](https://code.visualstudio.com/docs/copilot/customization/agent-plugins)

---

### 🔗 MCP — Model Context Protocol

Connect Copilot to external tools: databases, APIs, documentation, CI/CD.

- Enables custom tool integrations beyond built-in capabilities

📖 [MCP Servers](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)

---

### 💻 Copilot CLI

AI assistance right in your terminal.

- `gh copilot suggest` — Get command suggestions in the terminal
- `gh copilot explain` — Explain any command or error message

📖 [Copilot in the CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli)

---

### 🌐 Awesome Copilot

Community marketplace with **175+ agents**, **200+ skills**, and dozens of plugins.

- Browse, preview, and install directly into your projects

📖 [Awesome Copilot](https://awesome-copilot.github.com)

---

### Capability Summary

| Capability | Where to Find | Covered in Workshop? |
|---|---|---|
| Agent Skills | `.github/skills/` | ✅ 3 included |
| Custom Instructions | `.github/copilot-instructions.md` | ✅ Repo-wide + path-specific |
| Agent Mode | VS Code Copilot Chat | ✅ Module 2 |
| Prompt Files | `.github/prompts/` | ✅ 3 included |
| Agent Plugins | VS Code marketplace | 🔗 Link provided |
| MCP Servers | VS Code settings | 🔗 Link provided |
| Copilot CLI | Terminal | 🔗 Link provided |

---

## License

MIT
