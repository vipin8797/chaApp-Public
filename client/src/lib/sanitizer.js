/**
 * Utility for sanitizing string inputs to prevent HTML/XSS injection on the client side.
 */

/**
 * Escapes common HTML special characters from a string.
 * @param {string} rawString 
 * @returns {string} The escaped safe string.
 */
export const escapeHtml = (rawString) => {
  if (typeof rawString !== "string") return rawString;
  return rawString
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Truncates text to a maximum length with ellipses if needed.
 * @param {string} str 
 * @param {number} maxLen 
 * @returns {string}
 */
export const truncateText = (str, maxLen = 100) => {
  if (typeof str !== "string" || str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "...";
};
