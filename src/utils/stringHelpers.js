/**
 * String utility functions. Used for formatting and transformation.
 */

function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function titleCase(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function slugify(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function truncate(str, maxLength, suffix = '...') {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

function countWords(str) {
  if (!str || typeof str !== 'string') return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

function reverseWords(str) {
  if (!str || typeof str !== 'string') return '';
  return str.trim().split(/\s+/).reverse().join(' ');
}

function isPalindrome(str) {
  if (!str || typeof str !== 'string') return false;
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

function camelToKebab(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function kebabToCamel(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

module.exports = {
  capitalize,
  titleCase,
  slugify,
  truncate,
  countWords,
  reverseWords,
  isPalindrome,
  camelToKebab,
  kebabToCamel
};
