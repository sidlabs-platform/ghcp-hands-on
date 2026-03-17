/**
 * Validation utility functions for user input and data processing.
 * Used across the application for form validation and API request validation.
 */

function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function validateAge(age) {
  const parsed = Number(age);
  if (isNaN(parsed)) return false;
  return parsed >= 0 && parsed <= 150;
}

function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validatePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?\d{10,15}$/.test(cleaned);
}

module.exports = {
  validateEmail,
  validatePassword,
  sanitizeInput,
  validateAge,
  validateURL,
  validatePhoneNumber
};
