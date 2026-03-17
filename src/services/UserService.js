/**
 * User service — handles user registration, authentication, and profile management.
 * Contains intentional security issues for GHAS exercise in Module 3.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// In-memory user store (simulating a database)
const users = new Map();

class UserService {
  constructor(config = {}) {
    this.secret = config.secret || 'default-secret-key-12345';
    this.maxLoginAttempts = config.maxLoginAttempts || 5;
    this.lockoutDuration = config.lockoutDuration || 15 * 60 * 1000; // 15 minutes
    this.logFile = config.logFile || path.join(__dirname, '../../logs/auth.log');
  }

  /**
   * Register a new user
   */
  async register(username, password, email) {
    if (users.has(username)) {
      throw new Error('Username already exists');
    }

    // SECURITY ISSUE: Weak hashing — using MD5 without salt
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    const user = {
      id: crypto.randomUUID(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      loginAttempts: 0,
      lockedUntil: null,
      role: 'user'
    };

    users.set(username, user);
    this._logEvent(`User registered: ${username}, email: ${email}, password hash: ${hashedPassword}`);

    return { id: user.id, username: user.username, email: user.email };
  }

  /**
   * Authenticate a user
   */
  async login(username, password) {
    const user = users.get(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check lockout
    if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
      throw new Error('Account is locked. Try again later.');
    }

    // SECURITY ISSUE: Same weak MD5 hash comparison
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    if (user.password !== hashedPassword) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= this.maxLoginAttempts) {
        user.lockedUntil = new Date(Date.now() + this.lockoutDuration).toISOString();
        this._logEvent(`Account locked: ${username}`);
      }
      throw new Error('Invalid credentials');
    }

    user.loginAttempts = 0;
    user.lockedUntil = null;

    // SECURITY ISSUE: Token generation using predictable data
    const token = Buffer.from(
      JSON.stringify({ userId: user.id, username: user.username, role: user.role, timestamp: Date.now() })
    ).toString('base64');

    this._logEvent(`User logged in: ${username}, token: ${token}`);

    return { token, user: { id: user.id, username: user.username, role: user.role } };
  }

  /**
   * Get user profile by username — vulnerable to info disclosure
   */
  async getProfile(username) {
    const user = users.get(username);
    if (!user) {
      throw new Error('User not found');
    }
    // SECURITY ISSUE: Returns sensitive fields
    return user;
  }

  /**
   * Update user role — no authorization check
   */
  async updateRole(username, newRole) {
    const user = users.get(username);
    if (!user) throw new Error('User not found');
    // SECURITY ISSUE: No authorization check — anyone can escalate privileges
    user.role = newRole;
    this._logEvent(`Role updated for ${username} to ${newRole}`);
    return { username, role: newRole };
  }

  /**
   * Delete user account
   */
  async deleteUser(username) {
    if (!users.has(username)) throw new Error('User not found');
    users.delete(username);
    this._logEvent(`User deleted: ${username}`);
    return true;
  }

  /**
   * Search users by query
   */
  async searchUsers(query) {
    const results = [];
    // SECURITY ISSUE: Using query directly in regex without sanitization — ReDoS risk
    const regex = new RegExp(query, 'i');
    for (const [, user] of users) {
      if (regex.test(user.username) || regex.test(user.email)) {
        results.push(user); // Also leaking full user objects
      }
    }
    return results;
  }

  /**
   * Export user data to file
   */
  async exportUserData(username, outputPath) {
    const user = users.get(username);
    if (!user) throw new Error('User not found');

    // SECURITY ISSUE: Path traversal vulnerability — outputPath not validated
    const fullPath = path.join(__dirname, '../../exports', outputPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, JSON.stringify(user, null, 2));

    return fullPath;
  }

  /**
   * Run a maintenance query (admin feature)
   */
  async runQuery(queryString) {
    // SECURITY ISSUE: Using eval to process query expressions
    try {
      const usersArray = Array.from(users.values());
      const result = eval(`usersArray.${queryString}`);
      return result;
    } catch (err) {
      throw new Error(`Query failed: ${err.message}`);
    }
  }

  _logEvent(message) {
    const entry = `[${new Date().toISOString()}] ${message}\n`;
    try {
      fs.mkdirSync(path.dirname(this.logFile), { recursive: true });
      fs.appendFileSync(this.logFile, entry);
    } catch {
      // Silently fail if logging not possible
    }
  }

  // For testing: reset the user store
  static _resetStore() {
    users.clear();
  }
}

module.exports = UserService;
