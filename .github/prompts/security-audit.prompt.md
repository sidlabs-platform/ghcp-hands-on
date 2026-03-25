---
mode: agent
description: "Perform a security audit of JavaScript code against OWASP Top 10"
---

Perform a comprehensive security audit of the specified file(s) against the OWASP Top 10 (2021).

## Audit Process

1. **Scan for each OWASP category**:
   - **A01 Broken Access Control**: Missing authorization checks, path traversal, exposed sensitive fields
   - **A02 Cryptographic Failures**: Weak hashing (MD5, SHA1), no salt, predictable tokens, hardcoded secrets
   - **A03 Injection**: eval(), Function(), unsanitized RegExp, template injection, command injection
   - **A04 Insecure Design**: Missing input validation, no rate limiting
   - **A05 Security Misconfiguration**: Verbose errors, debug mode, default credentials
   - **A07 XSS**: Unescaped user input in output
   - **A09 Logging Failures**: Sensitive data in logs, insufficient audit logging

2. **For each finding, document**:
   | Field | Description |
   |-------|-------------|
   | Vulnerability | Brief description |
   | CWE | CWE number (e.g., CWE-79) |
   | Severity | Critical / High / Medium / Low |
   | Location | File, function, and line number |
   | Impact | What an attacker could do |
   | Fix | Specific code change to remediate |

3. **Apply fixes** for Critical and High severity findings.

4. **Write security tests** to verify each fix:
   - Test that the vulnerability is actually closed
   - Test bypass attempts (variations of the attack)
   - Test that normal functionality still works

5. **Run verification**:
   - `npm test` — all tests pass
   - Review that no new vulnerabilities were introduced by the fixes

## Common Fix Patterns

- `eval(userInput)` → Whitelist of allowed operations
- `crypto.createHash('md5')` → `crypto.scryptSync(password, salt, 64)`
- `path.join(base, userInput)` → Validate `path.resolve()` starts with allowed directory
- `new RegExp(userInput)` → Escape special chars or use `string.includes()`
- `return fullUserObject` → Return only safe fields via explicit pick
- No auth check → Add `requestingUser` parameter, verify `role === 'admin'`
- `Math.random()` token → `crypto.randomBytes(32).toString('hex')`
- `log(password)` → Log only event type and username
