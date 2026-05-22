/**
 * Utility functions for validating user input formats (email, password strength, name validity).
 */

/**
 * Validates if a string matches standard email formatting.
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === "string" && emailRegex.test(email.trim());
};

/**
 * Validates if password matches basic complexity requirements:
 * - At least 6 characters
 * @param {string} password 
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
  return typeof password === "string" && password.length >= 6;
};

/**
 * Checks if a user's full name is valid (at least 2 letters, only letters and spaces).
 * @param {string} name 
 * @returns {boolean}
 */
export const isValidName = (name) => {
  return typeof name === "string" && name.trim().length >= 2;
};
