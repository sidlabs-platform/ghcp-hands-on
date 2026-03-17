/**
 * STARTER TESTS — Intentionally incomplete and with some failing tests.
 * Students will use GitHub Copilot to generate missing tests and fix failures.
 * 
 * Exercise: Module 1, Exercise 1 — Copilot Unit Test Generation
 */

const {
  validateEmail,
  validatePassword,
  sanitizeInput,
  validateAge,
  validateURL,
  validatePhoneNumber
} = require('../../src/utils/validators');

describe('validateEmail', () => {
  test('should return true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  test('should return false for email without @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  // TODO: Add more test cases using Copilot
  // Hint: test null, undefined, empty string, emails with spaces, subdomains, etc.
});

describe('validatePassword', () => {
  test('should return true for a strong password', () => {
    expect(validatePassword('MyP@ssw0rd')).toBe(true);
  });

  // FAILING TEST — intentional bug for iterative fix loop exercise
  test('should reject password without special character', () => {
    expect(validatePassword('MyPassword1')).toBe(true); // BUG: should be false
  });

  // TODO: Use Copilot to generate comprehensive password validation tests
});

describe('sanitizeInput', () => {
  // TODO: Use Copilot to generate all tests for this function
  // Hint: test HTML entities, script tags, quotes, non-string inputs
});

describe('validateAge', () => {
  // TODO: Use Copilot to generate tests
});

describe('validateURL', () => {
  // TODO: Use Copilot to generate tests
});

describe('validatePhoneNumber', () => {
  // TODO: Use Copilot to generate tests
});
