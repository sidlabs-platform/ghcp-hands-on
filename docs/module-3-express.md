# Module 3 Express — Code Review Agent + GHAS Security (20 min)

**Time estimate:** 20 minutes
**Prerequisites:** GHAS (GitHub Advanced Security) enabled on the repository — pre-configure before the workshop to save time

## Overview

Use Copilot to perform an AI-driven security audit against OWASP Top 10, fix critical vulnerabilities interactively, and see how CodeQL provides automated verification — building a defense-in-depth strategy.

---

## Security Review Skill ⏱ 2 min

See how a dedicated skill gives Copilot a structured security checklist.

1. Open `.github/skills/security-review/SKILL.md` — this skill provides Copilot with a systematic approach: map OWASP categories → identify vulnerabilities → classify severity → recommend fixes.
2. Open `.github/prompts/security-audit.prompt.md` — a reusable prompt that targets `UserService.js` with specific audit criteria.
3. Note: the skill includes CWE references and severity classification, giving Copilot the structured context needed for thorough security analysis.

**Key insight:** Without the skill, Copilot finds obvious issues. With the skill, it performs a methodical, categorized audit.

---

## Exercise 1 — AI Security Audit ⏱ 8 min

### Goal

Audit `UserService.js` for its 8 intentional security vulnerabilities using Copilot.

### Steps

1. Open `src/services/UserService.js` in VS Code.

2. Open Copilot Chat (agent mode or inline) and enter:

   ```
   Perform a security audit of this file against OWASP Top 10. List each
   vulnerability with CWE number, severity, and specific fix.
   ```

3. Compare Copilot's findings against the known vulnerabilities:

   | # | Vulnerability | CWE | Severity |
   |---|--------------|-----|----------|
   | 1 | Weak hashing (MD5, no salt) | CWE-328 | High |
   | 2 | `eval()` injection | CWE-94 | Critical |
   | 3 | Path traversal | CWE-22 | Critical |
   | 4 | ReDoS pattern | CWE-1333 | Medium |
   | 5 | Information disclosure in errors | CWE-209 | Medium |
   | 6 | Missing authorization checks | CWE-862 | High |
   | 7 | Predictable token generation | CWE-330 | High |
   | 8 | Sensitive data in logs | CWE-532 | Medium |

4. Score the results:
   - How many of the 8 did Copilot identify?
   - Did it flag any false positives?
   - Were the suggested fixes specific and actionable?

### Checkpoint

- [ ] Copilot audit completed with CWE-categorized findings
- [ ] Compared AI findings against the known 8 vulnerabilities
- [ ] Noted which vulnerabilities Copilot caught vs. missed

---

## Exercise 2 — Fix Critical Vulnerabilities ⏱ 5 min

### Goal

Fix the two most critical vulnerabilities using Copilot-assisted code generation.

### Fix 1: `eval()` Injection (CWE-94)

Select the code containing `eval()` and ask Copilot:

```
Replace this eval() usage with a safe whitelist approach. Only allow
predefined operations — no dynamic code execution.
```

The fix should replace dynamic `eval()` with a map of allowed operations:

```javascript
const allowedOperations = {
  sum: (a, b) => a + b,
  multiply: (a, b) => a * b,
  // ... other safe operations
};
```

### Fix 2: Path Traversal (CWE-22)

Select the file access code and ask Copilot:

```
Add path traversal protection. Validate that the resolved path stays
within the allowed base directory.
```

The fix should use `path.resolve()` and verify the result starts with the expected base path.

### Verify

```bash
npm test
```

### Checkpoint

- [ ] `eval()` replaced with a whitelist approach
- [ ] Path traversal protection added with path validation
- [ ] All tests pass after fixes

---

## Demo — CodeQL + Verification ⏱ 5 min

See how automated tooling complements AI-driven review.

1. **Security workflow** (`.github/workflows/security.yml`) — runs two jobs:
   - `codeql` — static analysis that detects vulnerabilities via data flow analysis
   - `dependency-review` — checks for known vulnerabilities in dependencies

2. **CodeQL results** — in the GitHub Security tab:
   - CodeQL should flag the `eval()` injection (`js/code-injection`) and path traversal (`js/path-injection`)
   - Click a finding to see the **data flow visualization** — it traces tainted input from source to sink
   - After your fixes, re-running the scan should show these alerts resolved

3. **Defense in depth** — three layers working together:

   | Layer | Tool | Catches |
   |-------|------|---------|
   | AI Review | Copilot + security skill | Pattern-based issues, OWASP mapping |
   | Static Analysis | CodeQL | Data flow vulnerabilities, injection paths |
   | Human Review | Developer | Business logic flaws, architectural concerns |

**Takeaway:** No single tool catches everything. AI review + CodeQL + human review provides comprehensive coverage.

---

## Go Further

- 📖 Complete the full module: [Module 3 — Code Review Agent + GHAS Security](module-3-security-review.md)
- Fix the remaining 6 vulnerabilities (MD5 hashing, ReDoS, info disclosure, missing auth, predictable tokens, sensitive logging)
- Write security-focused tests that verify each fix prevents the original attack
- Complete the full OWASP Top 10 mapping exercise from the full module

---

## Key Takeaways

| Topic | What You Learned |
|-------|-----------------|
| AI Security Audit | Copilot with a security skill performs structured, CWE-categorized vulnerability analysis |
| Critical Fixes | `eval()` injection and path traversal are fixable with whitelist and path validation patterns |
| CodeQL | Static analysis traces data flow from source to sink, catching issues AI review may miss |
| Defense in Depth | AI review + CodeQL + human review together provide comprehensive security coverage |
