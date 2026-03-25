# Module 4 — Copilot Ecosystem: MCP Servers, Plugins & Extensions (Express — 15 min)

> **Goal:** Discover and configure external tools that supercharge Copilot — from MCP servers that connect Copilot to live data, to community plugins and extensions.

---

## ⏱ Timing Guide

| Section | Time |
|---------|------|
| Explore MCP server config | 5 min |
| Live demo: GitHub + Fetch MCP | 5 min |
| Community plugins & extensions tour | 5 min |

---

## What Are MCP Servers?

**Model Context Protocol (MCP)** lets Copilot call external tools — databases, APIs, browsers, CI/CD systems — as if they were built-in. Think of MCP servers as **plugins that give Copilot hands**.

```
┌──────────────┐     MCP      ┌──────────────────┐
│  Copilot Chat │ ◄──────────► │  GitHub MCP      │ → Issues, PRs, Code Search
│  (Agent Mode) │              │  Playwright MCP  │ → Browser automation
│               │              │  Fetch MCP       │ → Web content & APIs
│               │              │  Docker MCP      │ → Container management
└──────────────┘              └──────────────────┘
```

---

## Exercise 4.1 — Explore the MCP Configuration (5 min)

### Step 1: Open the MCP config

Open `.vscode/mcp.json` in this project. You'll see pre-configured servers:

```jsonc
{
  "servers": {
    "github": { ... },      // Query GitHub repos, issues, PRs
    "fetch": { ... },        // Fetch web pages, API docs
    "playwright": { ... },   // Browser automation & testing
    "context7": { ... }      // Pull library docs into context
  }
}
```

### Step 2: Understand the pattern

Each MCP server follows the same structure:
- **`command`** — How to start the server (npx, docker, binary)
- **`args`** — Command-line arguments
- **`env`** — Environment variables (tokens, API keys)

### Step 3: Check active servers

In VS Code Copilot Chat, type:
```
What MCP servers are available? List the tools each one provides.
```

> **💡 Takeaway:** MCP servers are configured per-project. Teams can share `.vscode/mcp.json` in the repo so everyone gets the same tools.

---

## Exercise 4.2 — Live Demo: MCP in Action (5 min)

### Demo A: GitHub MCP Server

With the GitHub MCP server active, try these in Copilot Chat:

```
Search this repo for open issues labeled "bug"
```

```
Show me the last 5 commits on the main branch
```

```
What files changed in the most recent PR?
```

> Copilot calls the GitHub MCP server's tools (`search_issues`, `list_commits`, `get_pull_request`) behind the scenes.

### Demo B: Fetch MCP Server

```
Fetch the Jest 29 API documentation and summarize the new matchers
```

```
What's the latest Node.js LTS version? Check the official release schedule.
```

> The Fetch MCP server retrieves live web content, so Copilot's answers are up-to-date rather than relying on training data.

### Demo C: Context7 — Library Docs in Context

```
Using context7, pull up the Express.js middleware documentation and explain how error-handling middleware works
```

> Context7 resolves library names to their latest documentation, injecting accurate API references directly into Copilot's context.

---

## Exercise 4.3 — Community Plugins & Extensions Tour (5 min)

### Popular MCP Servers (Curated)

| MCP Server | What It Does | Best For |
|------------|-------------|----------|
| **GitHub** | Issues, PRs, code search, Actions | DevOps, project management |
| **Playwright** | Browser automation, screenshots, testing | E2E testing, web scraping |
| **Fetch** | HTTP requests, web page reading | API testing, docs lookup |
| **Docker** | Container lifecycle, logs, images | DevOps, local environments |
| **PostgreSQL** | Query databases, inspect schemas | Data work, debugging |
| **Context7** | Live library documentation | Staying up-to-date with APIs |
| **Memory** | Persistent knowledge graph | Long-running projects, context retention |
| **Sequential Thinking** | Structured multi-step reasoning | Complex problem decomposition |
| **Filesystem** | Read/write/search local files | Batch file operations |
| **Brave Search** | Web search with citations | Research, current events |

### Agent Skills from the Community

Browse **[Awesome Copilot](https://awesome-copilot.github.com)** for 175+ community skills:

| Category | Example Skills |
|----------|---------------|
| **Testing** | `jest-test-gen`, `pytest-gen`, `playwright-test` |
| **Security** | `security-review`, `dependency-audit`, `secret-scan` |
| **Documentation** | `api-docs-gen`, `readme-writer`, `changelog-gen` |
| **DevOps** | `dockerfile-gen`, `terraform-review`, `k8s-manifest` |
| **Code Quality** | `js-refactor`, `performance-review`, `accessibility-audit` |

### Extensions (Installable Packages)

Extensions bundle skills + MCP servers + agents into one-click installs:

```bash
# Example: Install a community extension
gh copilot extension install @org/extension-name
```

> **💡 Takeaway:** The Copilot ecosystem is growing rapidly. Start with 2–3 MCP servers that match your daily workflow, then explore community skills for your tech stack.

---

## ✅ Express Module 4 Checklist

- [ ] Opened `.vscode/mcp.json` and understood the MCP configuration pattern
- [ ] Saw MCP servers in action (GitHub search, Fetch docs, Context7 library docs)
- [ ] Browsed popular MCP servers and community skills
- [ ] Identified 2–3 MCP servers you'd add to your own projects

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| MCP Server Docs | https://code.visualstudio.com/docs/copilot/chat/mcp-servers |
| MCP Specification | https://modelcontextprotocol.io |
| Awesome MCP Servers | https://github.com/punkpeye/awesome-mcp-servers |
| Awesome Copilot | https://awesome-copilot.github.com |
| Agent Plugins | https://code.visualstudio.com/docs/copilot/customization/agent-plugins |

---

**⏭ Next:** Return to the main workshop or explore the full-length [Module 4](module-4-ecosystem.md) for hands-on MCP server configuration and custom extension building.
