# Module 4 — Copilot Ecosystem: MCP Servers, Plugins & Extensions (Full-Length — 45–60 min)

> **Goal:** Go beyond built-in Copilot features — configure MCP servers for external tool access, leverage community plugins, and understand how the ecosystem fits into real development workflows.

---

## Prerequisites

- Completed at least one of Modules 1–3 (familiarity with Copilot Chat and agent mode)
- VS Code with GitHub Copilot extension
- Node.js 20+ (for npx-based MCP servers)
- Optional: GitHub personal access token (for GitHub MCP server)
- Optional: Docker (for Docker MCP server)

---

## Exercise 4.1 — Understanding MCP: Model Context Protocol (15 min)

### What Is MCP?

MCP (Model Context Protocol) is an **open protocol** that connects AI assistants to external tools and data sources. It turns Copilot from a code-only assistant into a **universal developer interface**.

```
Without MCP:                          With MCP:
┌────────────┐                        ┌────────────┐
│  Copilot    │ → code only           │  Copilot    │ → code + live data
└────────────┘                        └─────┬──────┘
                                            │ MCP Protocol
                                      ┌─────┴──────┐
                                      │  MCP Servers │
                                      ├─────────────┤
                                      │ GitHub       │ → Issues, PRs, Actions
                                      │ Playwright   │ → Browser, screenshots
                                      │ PostgreSQL   │ → Live database queries
                                      │ Docker       │ → Containers, images
                                      │ Fetch        │ → Any URL/API
                                      │ Context7     │ → Library documentation
                                      └─────────────┘
```

### Step 1: Inspect the project MCP configuration

Open `.vscode/mcp.json` in this repository:

```jsonc
{
  "servers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github-token}" }
    }
  }
}
```

**Key concepts:**
- **`servers`** — Named MCP server definitions
- **`command` + `args`** — How VS Code launches the server process
- **`env`** — Environment variables (use `${input:name}` for VS Code input prompts)
- Servers run as local processes and communicate via stdin/stdout

### Step 2: How Copilot discovers tools

When you open the project, VS Code reads `.vscode/mcp.json` and starts the configured servers. Each server **advertises its tools** — Copilot automatically sees them:

```
GitHub MCP:  search_issues, list_pull_requests, get_commit, list_branches, ...
Fetch MCP:   fetch_url, fetch_html, ...
Playwright:  navigate, screenshot, click, fill, ...
```

In Copilot Chat, ask:
```
What tools are available from MCP servers?
```

### Step 3: Tool invocation flow

When you ask Copilot a question that needs external data:

1. Copilot **selects** the right MCP tool (e.g., `search_issues`)
2. Copilot **calls** the tool with parameters (e.g., `{query: "label:bug", repo: "owner/repo"}`)
3. The MCP server **executes** the request and returns results
4. Copilot **incorporates** the results into its response

> **💡 Key Insight:** You don't need to know tool names. Just ask naturally — "What bugs are open?" — and Copilot routes to the right MCP tool.

---

## Exercise 4.2 — Configuring Popular MCP Servers (15 min)

### Server 1: GitHub MCP Server

**Use case:** Query issues, PRs, commits, code search, and Actions workflows.

The GitHub MCP server is already in `.vscode/mcp.json`. Try these prompts:

```
List open issues in this repository
```

```
Show me the CI workflow status for the last 3 runs
```

```
Search the codebase for all functions that use eval()
```

**What's happening:** Copilot calls `list_issues`, `list_workflow_runs`, and `search_code` tools behind the scenes.

### Server 2: Fetch MCP Server

**Use case:** Retrieve web pages, API documentation, or any URL content.

Try:
```
Fetch https://nodejs.org/api/crypto.html and explain what scryptSync does
```

```
Fetch the npm page for jest and tell me what version 30 changes
```

> **Why this matters:** Copilot's training data has a cutoff. Fetch MCP gives it access to **current** documentation.

### Server 3: Playwright MCP Server

**Use case:** Browser automation, visual testing, web scraping, E2E test generation.

Try:
```
Navigate to https://example.com and take a screenshot
```

```
Generate a Playwright test that verifies the login form has email and password fields
```

> **Tip:** Playwright MCP is especially powerful combined with the `jest-test-gen` skill — generate E2E tests alongside unit tests.

### Server 4: Context7 — Live Library Documentation

**Use case:** Pull the latest API docs for any library directly into Copilot's context.

Try:
```
Using context7, look up the Express.js Router API and show how to create nested routers
```

```
What assertion methods does Jest provide? Use context7 to check the latest docs.
```

> **Why this matters:** Instead of Copilot guessing from training data, Context7 fetches the **actual** current docs — fewer hallucinations, more accurate code suggestions.

### Server 5: Memory MCP Server

**Use case:** Persistent knowledge graphs that survive across sessions.

```
Remember that our team uses camelCase for JavaScript and snake_case for database columns
```

```
What conventions have I stored about this project?
```

> **Tip:** Memory MCP is great for encoding team decisions, architecture choices, and naming conventions that aren't in code.

### DIY: Add a New MCP Server

Try adding one yourself. Open `.vscode/mcp.json` and add:

```jsonc
{
  "servers": {
    // ... existing servers ...
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "${input:brave-api-key}"
      }
    }
  }
}
```

Then reload VS Code and ask Copilot to search the web for something.

---

## Exercise 4.3 — Community Skills & Extensions Deep Dive (10 min)

### What Makes a Good Skill?

Recall from earlier modules: skills live in `.github/skills/<name>/SKILL.md` and teach Copilot domain-specific workflows. This workshop ships 3:

| Skill | Focus | Triggers On |
|-------|-------|-------------|
| `jest-test-gen` | Test generation patterns | "generate tests", "create test file" |
| `js-refactor` | Safe refactoring methodology | "refactor", "extract function", "code smells" |
| `security-review` | OWASP vulnerability detection | "security audit", "find vulnerabilities" |

### Exploring Community Skills

The **Awesome Copilot** registry catalogs community-contributed skills:

| Category | Popular Skills | Description |
|----------|---------------|-------------|
| **Testing** | `playwright-test-gen`, `cypress-e2e`, `pytest-gen` | Framework-specific test generation |
| **Security** | `dependency-audit`, `secret-scanner`, `cve-checker` | Supply chain and secrets scanning |
| **Documentation** | `api-docs-gen`, `readme-writer`, `adr-template` | Auto-generate project documentation |
| **DevOps** | `dockerfile-best-practices`, `terraform-review`, `gh-actions-gen` | Infrastructure as code guidance |
| **Code Quality** | `performance-profiler`, `accessibility-a11y`, `i18n-checker` | Non-functional quality attributes |
| **Data** | `sql-optimizer`, `schema-migration`, `data-validation` | Database and data pipeline patterns |

### Installing a Community Skill

Adding a community skill is as simple as creating a `SKILL.md` file:

```bash
# Create skill directory
mkdir -p .github/skills/playwright-test-gen

# Add the skill definition
# (Copy from the community registry or write your own)
```

A skill file follows this structure:

```markdown
---
name: playwright-test-gen
description: Generate Playwright E2E tests following project conventions
---

# Playwright Test Generation Skill

## Test File Placement
- E2E tests go in `e2e/<feature>.spec.ts`
- Use Page Object Model pattern
...
```

### Extensions: Bundled Packages

Extensions bundle multiple capabilities into installable packages:

```
Extension Package
├── skills/           ← Agent skills (SKILL.md files)
├── prompts/          ← Reusable prompt templates
├── mcp-servers/      ← MCP server configurations
└── instructions/     ← Custom instructions
```

> **💡 Takeaway:** Skills customize Copilot's knowledge. MCP servers extend its capabilities. Extensions bundle both for easy distribution.

---

## Exercise 4.4 — Building Your Ecosystem Strategy (5 min)

### The Integration Stack

Think of the Copilot ecosystem as layers:

```
┌─────────────────────────────────────────┐
│          Your Development Workflow        │
├─────────────────────────────────────────┤
│  Custom Instructions  │  Agent Skills    │  ← Team conventions & domain knowledge
├─────────────────────────────────────────┤
│  Prompt Files         │  Extensions      │  ← Reusable workflows & packages
├─────────────────────────────────────────┤
│  MCP Servers (GitHub, Playwright, etc.) │  ← External tool connections
├─────────────────────────────────────────┤
│  Copilot Core (Chat, Agent Mode, CLI)   │  ← Foundation
└─────────────────────────────────────────┘
```

### Recommended Starter Setup by Role

| Role | Must-Have MCP Servers | Recommended Skills |
|------|----------------------|-------------------|
| **Frontend Dev** | Playwright, Fetch, Context7 | `accessibility-a11y`, `component-test-gen` |
| **Backend Dev** | GitHub, PostgreSQL, Docker | `api-design`, `sql-optimizer` |
| **Full-Stack** | GitHub, Playwright, Fetch, Docker | `jest-test-gen`, `js-refactor` |
| **DevOps/SRE** | GitHub, Docker, Kubernetes | `dockerfile-best-practices`, `terraform-review` |
| **Security Eng** | GitHub, Fetch | `security-review`, `dependency-audit` |

### Action Items

Before leaving this module, decide on your personal ecosystem:

1. **Pick 2–3 MCP servers** that match your daily work
2. **Choose 1–2 community skills** for your primary language/framework
3. **Create one custom skill** for your team's specific conventions
4. **Share your `.vscode/mcp.json`** in your team's repo

---

## ✅ Module 4 Checklist

- [ ] Understand what MCP is and how tools are discovered
- [ ] Configured and tested at least 2 MCP servers
- [ ] Tried natural-language prompts that trigger MCP tool calls
- [ ] Explored community skills on Awesome Copilot
- [ ] Understand the difference between skills, MCP servers, and extensions
- [ ] Identified MCP servers and skills for your own workflow

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| MCP Specification | https://modelcontextprotocol.io |
| MCP Server Docs (VS Code) | https://code.visualstudio.com/docs/copilot/chat/mcp-servers |
| Awesome MCP Servers | https://github.com/punkpeye/awesome-mcp-servers |
| MCP Server Registry | https://mcp.so |
| Awesome Copilot (Skills) | https://awesome-copilot.github.com |
| Agent Plugins | https://code.visualstudio.com/docs/copilot/customization/agent-plugins |
| Context7 | https://github.com/nicepkg/context7 |
| Copilot Extensions | https://docs.github.com/en/copilot/building-copilot-extensions |

---

## Key Takeaways

1. **MCP turns Copilot into a universal interface** — it can now talk to your databases, browsers, APIs, and CI/CD pipelines
2. **Configuration is per-project** — share `.vscode/mcp.json` so the whole team gets the same tools
3. **Skills + MCP = powerful combinations** — e.g., `security-review` skill + GitHub MCP = audit code and auto-file issues
4. **Start small, expand gradually** — 2–3 MCP servers and 1–2 skills cover most workflows
5. **The ecosystem is growing fast** — check Awesome Copilot and MCP registries monthly for new capabilities
