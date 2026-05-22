/**
 * Formats a date/timestamp to a beautiful 24-hour time representation (HH:MM).
 * @param {string|Date} dateVal - The input date or ISO string.
 * @returns {string} Formatted 24-hour time representation.
 */
export function formatMessageTime(dateVal) {
  if (!dateVal) return "";
  return new Date(dateVal).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // FIXED: changed from string "false" to boolean false
  });
}

/**
 * Formats file size in bytes to a human-readable string (e.g., KB, MB).
 * @param {number} bytes - The file size in bytes.
 * @returns {string} The formatted file size representation.
 */
export function formatFileSize(bytes) {
  if (bytes === 0 || !bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}