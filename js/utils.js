/**
 * Formats a numeric value as a German Euro currency string.
 * Handles invalid numbers safely.
 *
 * @param {number} value - Number to format
 * @returns {string} Formatted currency string
 */
export function euro(value) {
  if (!isFinite(value)) return "-";

  return Number(value).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

/**
 * Generates a simple unique id.
 * @returns {number}
 */
export function generateId() {
  return Date.now() + Math.random();
}