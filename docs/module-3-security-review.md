# Module 3 — Code Review Agent + GHAS Security Scan

## Overview

In this module you will work with **GitHub Copilot Code Review**, **GitHub Advanced Security (GHAS)** — including **CodeQL** and **Dependabot** — to detect vulnerabilities in application code, interpret security scan results, and verify that AI-assisted fixes are correct.

**Time estimate:** 60–90 minutes  
**Prerequisites:** GitHub repository with GHAS enabled (free for public repos; requires GitHub Enterprise or GitHub Advanced Security license for private repos), completion of Modules 1–2

---

## Background — The Vulnerable Code

The file `src/services/UserService.js` contains **8 intentional security vulnerabilities**:

| # | Vulnerability | CWE | Severity | Location |
|---|--------------|-----|----------|----------|
| 1 | Weak hashing (MD5, no salt) | CWE-328 | High | `register()`, `login()` |
| 2 | Sensitive data in logs | CWE-532 | Medium | `_logEvent()` calls |
| 3 | Predictable token generation | CWE-330 | High | `login()` — base64 token |
| 4 | Information disclosure | CWE-200 | Medium | `getProfile()` returns full user object |
| 5 | Missing authorization | CWE-862 | High | `updateRole()` — no auth check |
| 6 | ReDoS via unsanitized regex | CWE-1333 | Medium | `searchUsers()` |
| 7 | Path traversal | CWE-22 | High | `exportUserData()` |
| 8 | Code injection via eval | CWE-94 | Critical | `runQuery()` |

---

## Exercise 1 — Code Review Agent Walkthrough

### Goal

Use GitHub Copilot Code Review to identify code quality and security issues in a PR, and understand how the review agent surfaces findings.

### Step-by-step

#### 1.1 Create a feature branch with the vulnerable code

If you haven't already pushed the project:

```bash
cd ghcp-hands-on
git checkout -b feature/user-service
git add .
git commit -m "feat: add user service with auth features"
git push origin feature/user-service
```

#### 1.2 Open a Pull Request

1. Go to your GitHub repository.
2. Create a Pull Request from `feature/user-service` → `main`.
3. **Title:** `feat: Add user authentication service`
4. **Description:**
   ```markdown
   Adds UserService with:
   - User registration and login
   - Profile management
   - Role management
   - User search
   - Data export
   - Admin query feature
   ```

#### 1.3 Request Copilot review

1. In the PR sidebar, click **Reviewers**.
2. Add **Copilot** as a reviewer.
3. Wait for the review to complete (typically 1–3 minutes).

#### 1.4 Analyze Copilot's review comments

Go through each comment Copilot leaves. For each one, document:

| Comment | Vulnerability Found? | Accurate? | Actionable Fix Suggested? |
|---------|---------------------|-----------|--------------------------|
| (fill in as you review) | | | |

**Questions to answer:**
- How many of the 8 vulnerabilities did Copilot's review catch?
- Did Copilot raise any false positives?
- Were the suggested fixes correct and complete?

#### 1.5 Use Copilot Chat for deeper analysis

In VS Code, open `src/services/UserService.js` and ask:

```
Perform a security review of this file. Identify all vulnerabilities, classify 
them by CWE number and severity, and provide specific code fixes for each.
```

Compare the Chat analysis with the PR review comments. Chat often provides more detail since it sees the full file context rather than just the diff.

### Checkpoint

- [ ] PR created with vulnerable code
- [ ] Copilot Code Review comments received
- [ ] Documented which vulnerabilities Copilot found vs. missed
- [ ] Used Copilot Chat for supplementary analysis
- [ ] Understood the difference between PR review and Chat analysis

---

## Exercise 2 — Vulnerability Detection & Result Interpretation

### Goal

Enable GHAS security scanning (CodeQL), trigger a scan, interpret the results, and remediate findings.

### Step-by-step

#### 2.1 Enable GitHub Advanced Security

1. Go to **Settings → Code security and analysis** in your repository.
2. Enable:
   - **Dependency graph** (usually on by default)
   - **Dependabot alerts**
   - **Dependabot security updates**
   - **Code scanning** (CodeQL)
   - **Secret scanning**

3. When prompted to set up CodeQL, use the **default setup** which auto-detects JavaScript.

Alternatively, the workflow file is already provided at `.github/workflows/security.yml` — you can enable it by pushing to `main`.

#### 2.2 Trigger a CodeQL scan

If using the workflow file:
```bash
git checkout main
git merge feature/user-service
git push origin main
```

Or trigger manually: Go to **Actions → Code Review & Security Scan → Run workflow**.

#### 2.3 Interpret CodeQL results

1. Go to **Security → Code scanning alerts**.
2. You should see alerts for some of these issues:

   | Expected Alert | CodeQL Rule |
   |---------------|-------------|
   | eval() usage | `js/code-injection` |
   | Path traversal | `js/path-injection` |
   | MD5 usage | `js/weak-cryptographic-algorithm` |
   | Regex injection | `js/regex-injection` |
   | Log injection | `js/log-injection` |

3. For each alert, click through and examine:
   - **The data flow** — CodeQL shows the path from source (user input) to sink (dangerous function)
   - **The CWE classification** — Does it match the known vulnerability?
   - **The severity rating** — Do you agree with it?
   - **The remediation guidance** — Is it actionable?

#### 2.4 Remediate the critical findings

Create a fix branch:

```bash
git checkout -b fix/security-vulnerabilities
```

**Fix 1: Replace eval with safe alternative**

Open `src/services/UserService.js` and ask Copilot:
```
Replace the runQuery method that uses eval() with a safe implementation. 
Support only these operations: filter, find, map, sort. 
Do not use eval, Function constructor, or any dynamic code execution.
```

Expected fix — a whitelist-based approach:
```javascript
async runQuery(operation, ...args) {
  const allowedOps = ['filter', 'find', 'map', 'sort'];
  if (!allowedOps.includes(operation)) {
    throw new Error(`Unsupported operation: ${operation}`);
  }
  const usersArray = Array.from(users.values());
  // Only allow predefined safe operations
  return usersArray[operation](...args);
}
```

**Fix 2: Replace MD5 with bcrypt-style hashing**

Ask Copilot:
```
Replace the MD5 password hashing with crypto.scryptSync using a random salt.
Store the salt alongside the hash. Update both register() and login().
```

**Fix 3: Fix path traversal**

Ask Copilot:
```
Fix the path traversal vulnerability in exportUserData. Validate that the 
resolved path is within the exports directory. Reject paths containing '..' 
or absolute paths.
```

**Fix 4: Fix information disclosure in getProfile**

```
Fix getProfile to return only safe fields: id, username, email, role, createdAt. 
Never return password, loginAttempts, or lockedUntil.
```

**Fix 5: Add authorization to updateRole**

```
Add an authorization check to updateRole. It should accept a requestingUser 
parameter and only allow the update if requestingUser.role === 'admin'.
```

**Fix 6: Fix ReDoS in searchUsers**

```
Fix the regex injection vulnerability in searchUsers. Escape special regex 
characters in the query string before creating the RegExp, or use string 
includes() instead.
```

**Fix 7: Fix token generation**

```
Replace the base64 token with a cryptographically random token using 
crypto.randomBytes(32).toString('hex'). Store a token-to-userId mapping.
```

**Fix 8: Remove sensitive data from logs**

```
Audit all _logEvent calls. Remove password hashes, tokens, and email 
addresses from log messages. Log only usernames and event types.
```

#### 2.5 Push fixes and verify

```bash
git add .
git commit -m "fix: remediate security vulnerabilities in UserService"
git push origin fix/security-vulnerabilities
```

Open a PR and verify:
- CodeQL re-runs and the alerts are resolved
- Existing tests still pass (update tests if the API changed)
- Copilot review doesn't flag new issues

### Checkpoint

- [ ] CodeQL enabled and scan completed
- [ ] Identified ≥5 security alerts in the dashboard
- [ ] Understood data flow visualization for at least 2 alerts
- [ ] Remediated all critical and high severity findings
- [ ] Verified fixes resolved the CodeQL alerts

---

## Exercise 3 — AI Output Quality Verification

### Goal

Critically evaluate the quality and correctness of AI-generated security fixes. Not all AI suggestions are safe — learn to verify.

### Step-by-step

#### 3.1 Test the AI-generated fixes

For each fix from Exercise 2, write targeted tests that verify the vulnerability is actually closed:

**Test: eval injection is blocked**
```javascript
describe('runQuery - security', () => {
  test('should reject dangerous operations', async () => {
    const service = new UserService();
    // These should all throw or be rejected
    await expect(service.runQuery('constructor')).rejects.toThrow();
    await expect(service.runQuery('__proto__')).rejects.toThrow();
  });

  test('should not allow code injection via arguments', async () => {
    const service = new UserService();
    // If using the whitelist approach, this tests the operation name
    await expect(service.runQuery('toString')).rejects.toThrow('Unsupported');
  });
});
```

**Test: path traversal is blocked**
```javascript
describe('exportUserData - security', () => {
  test('should reject path traversal attempts', async () => {
    const service = new UserService();
    await service.register('testuser', 'P@ssw0rd!', 'test@test.com');
    
    await expect(
      service.exportUserData('testuser', '../../../etc/passwd')
    ).rejects.toThrow();
    
    await expect(
      service.exportUserData('testuser', '/absolute/path/file.json')
    ).rejects.toThrow();
  });
});
```

**Test: password hashing is strong**
```javascript
describe('password hashing - security', () => {
  test('same password should produce different hashes (salt)', async () => {
    const service = new UserService();
    UserService._resetStore();
    
    await service.register('user1', 'P@ssw0rd!', 'u1@test.com');
    await service.register('user2', 'P@ssw0rd!', 'u2@test.com');
    
    // If using proper salting, the stored hashes should differ
    // (You'll need to access internal state or add a test helper)
  });
});
```

#### 3.2 Check for incomplete fixes

AI-generated fixes sometimes introduce new problems. Review each fix for:

| Check | What to Look For |
|-------|-----------------|
| **Bypass potential** | Can the fix be circumvented with different input? |
| **Error handling** | Does the fix handle errors gracefully or does it crash? |
| **Breaking changes** | Did the fix change the API contract? |
| **Performance** | Did the fix introduce performance issues (e.g., synchronous crypto on hot paths)? |
| **New vulnerabilities** | Did the fix introduce a different vulnerability? |

Ask Copilot Chat for each fix:
```
Review this security fix. Can it be bypassed? Are there edge cases 
that would still allow the original vulnerability? What could go wrong?
```

#### 3.3 Cross-reference with OWASP

Map each vulnerability and fix to the **OWASP Top 10 (2021)**:

| Vulnerability | OWASP Category | Fix Adequate? |
|--------------|---------------|---------------|
| eval() injection | A03: Injection | |
| Path traversal | A01: Broken Access Control | |
| Weak hashing | A02: Cryptographic Failures | |
| Missing auth | A01: Broken Access Control | |
| Info disclosure | A01: Broken Access Control | |
| ReDoS | A03: Injection | |
| Predictable tokens | A02: Cryptographic Failures | |
| Sensitive logging | A09: Security Logging Failures | |

#### 3.4 Final security review

Run all scans one more time:

1. **CodeQL scan:** Push the fixes, verify zero critical/high alerts remain.
2. **Copilot Code Review:** Request review on the fix PR. Are there any remaining concerns?
3. **Manual review:** Read through the final code yourself. Are you confident it's secure?

Write a brief summary (3–5 sentences) of:
- What AI tools caught vs. what required human judgment
- Where AI fixes were correct vs. where they needed adjustment
- Your confidence level in shipping this code to production

### Checkpoint

- [ ] Security tests written and passing for ≥4 fixed vulnerabilities
- [ ] Reviewed fixes for bypass potential and incompleteness
- [ ] Mapped vulnerabilities to OWASP Top 10
- [ ] Final scan shows zero critical/high alerts
- [ ] Written reflection on AI-assisted security review quality

---

## Key Takeaways

| Topic | What You Learned |
|-------|-----------------|
| Code Review Agent | Copilot review catches common issues but may miss subtle vulnerabilities |
| CodeQL | Static analysis finds data-flow vulnerabilities that code review often misses |
| GHAS Dashboard | The Security tab provides a consolidated view of all vulnerability types |
| AI Fix Quality | AI-generated security fixes must be verified — they can be incomplete or introduce new issues |
| Defense in Depth | Use multiple layers: Copilot review + CodeQL + Dependabot + human review |
| OWASP Mapping | Understanding vulnerability taxonomy helps assess completeness of security posture |
