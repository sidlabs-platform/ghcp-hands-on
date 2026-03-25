---
name: security-review
description: >
  Review JavaScript code for security vulnerabilities. Covers OWASP Top 10,
  CWE classification, severity ratings, audit checklists, and fix patterns
  for common CVE-prone code.
---

# Security Review Skill

## How to Use

When asked to review code for security, scan every file for the patterns below.
Report findings in the output table format at the bottom of this document.
Map each finding to a CWE number and assign a severity.

## OWASP Top 10 (2021) — JavaScript Patterns

### A01: Broken Access Control
- Missing authorization checks before data access.
- Path traversal: user input passed to `fs.readFile` / `fs.readFileSync` without validation.
- Internal object IDs or admin flags exposed in API responses.

### A02: Cryptographic Failures
- Use of `MD5` or `SHA1` for passwords or tokens.
- Hashing without a random salt.
- Predictable tokens (`Math.random()`, `Date.now()`).
- Base64 used as "encryption" — it is encoding, not encryption.

### A03: Injection
- `eval()`, `new Function()`, `setTimeout(string)` with dynamic input.
- `RegExp` constructed from unsanitized user input (ReDoS risk).
- String-concatenated SQL queries.
- `child_process.exec()` with user-controlled arguments (command injection).

### A04: Insecure Design
- Business logic that trusts client-supplied values (e.g., price, role).

### A05: Security Misconfiguration
- Debug mode / verbose errors enabled in production.
- Default credentials or API keys in source.

### A06: Vulnerable & Outdated Components
- Dependencies with known CVEs — check with `npm audit`.

### A07: Identification & Authentication Failures
- Passwords stored in plain text or weak hashes.
- No rate limiting on login endpoints.

### A08: Software & Data Integrity Failures
- Deserialization of untrusted data without validation.

### A09: Security Logging & Monitoring Failures
- Passwords, tokens, or PII written to logs.
- No logging of authentication events.

### A10: Server-Side Request Forgery (SSRF)
- User-supplied URLs passed to `http.get()` / `fetch()` without allow-list.

## CWE Classification

Map every finding to the most specific CWE:

| Pattern | CWE |
|---|---|
| `eval()` / `new Function()` | CWE-95 (Eval Injection) |
| SQL string concatenation | CWE-89 (SQL Injection) |
| Command injection via `exec()` | CWE-78 (OS Command Injection) |
| Path traversal | CWE-22 (Path Traversal) |
| MD5/SHA1 for passwords | CWE-328 (Weak Hash) |
| No salt on hash | CWE-916 (Insufficient Password Hashing) |
| `Math.random()` for tokens | CWE-330 (Insufficient Randomness) |
| Sensitive data in logs | CWE-532 (Info Exposure Through Logs) |
| Missing authorization | CWE-862 (Missing Authorization) |
| ReDoS | CWE-1333 (ReDoS) |

## Fix Patterns

### eval → whitelist of allowed operations

```js
// Vulnerable
const result = eval(userExpression);

// Fixed — use a lookup of permitted operations
const OPERATIONS = { add: (a, b) => a + b, sub: (a, b) => a - b };
const fn = OPERATIONS[userOp];
if (!fn) throw new Error('Unsupported operation');
const result = fn(a, b);
```

### MD5 → crypto.scryptSync with random salt

```js
// Vulnerable
const hash = crypto.createHash('md5').update(password).digest('hex');

// Fixed
const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(password, salt, 64);
// Store both salt and hash
```

### Path traversal → path.resolve + startsWith check

```js
// Vulnerable
const file = fs.readFileSync('uploads/' + userPath);

// Fixed
const BASE = path.resolve(__dirname, 'uploads');
const resolved = path.resolve(BASE, userPath);
if (!resolved.startsWith(BASE + path.sep)) throw new Error('Invalid path');
const file = fs.readFileSync(resolved);
```

### ReDoS → escape regex or use string methods

```js
// Vulnerable
const re = new RegExp(userInput);

// Fixed — use string.includes() when possible
if (text.includes(userInput)) { ... }

// Or escape special characters
function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
const re = new RegExp(escapeRegex(userInput));
```

### Predictable tokens → crypto.randomBytes

```js
// Vulnerable
const token = Math.random().toString(36);

// Fixed
const token = crypto.randomBytes(32).toString('hex');
```

### Sensitive data in logs → log only safe fields

```js
// Vulnerable
logger.info('Login', { username, password, token });

// Fixed
logger.info('Login attempt', { username, event: 'login' });
```

### Missing authorization → check role before action

```js
// Vulnerable
function deleteUser(userId) { return db.delete(userId); }

// Fixed
function deleteUser(userId, requestingUser) {
  if (requestingUser.role !== 'admin') throw new Error('Forbidden');
  return db.delete(userId);
}
```

### Info disclosure → return only safe fields

```js
// Vulnerable
app.get('/user/:id', (req, res) => res.json(user));

// Fixed
const { id, name, email } = user;
res.json({ id, name, email });
```

## Output Format

Report findings as a markdown table:

| # | Vulnerability | CWE | Severity | Location | Suggested Fix |
|---|---|---|---|---|---|
| 1 | eval() with user input | CWE-95 | Critical | src/calc.js:12 | Replace with operation lookup object |
| 2 | MD5 password hash | CWE-328 | High | src/auth.js:34 | Use crypto.scryptSync with random salt |

**Severity scale:**
- **Critical** — Exploitable remotely with no authentication; leads to RCE or full data breach.
- **High** — Exploitable with minimal access; leads to data exposure or privilege escalation.
- **Medium** — Requires specific conditions; limited impact.
- **Low** — Informational or defense-in-depth improvement.
