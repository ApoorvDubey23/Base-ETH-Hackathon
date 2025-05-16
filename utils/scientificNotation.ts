/**
 * Converts a number or string to a formatted string.
 *
 * For numbers between 1e-3 and 1e6, returns a string with fixed decimals.
 * For numbers smaller than 1e-3 or larger than or equal to 1e6, returns
 * a string in the format "a x 10^b". For example, 0.000000000087 becomes "8.7 x 10^-12".
 *
 * @param value - The numeric value to convert
 * @param precision - Number of digits after the decimal (default: 2)
 * @returns Formatted string (e.g., "8.7 x 10^-12" or "123.00")
 */
export function toScientificNotation(value: number | string, precision: number = 2): string {
  
  const num = typeof value === "string" ? Number(value) : value;

  if (isNaN(num)) {
    console.warn("Invalid number provided to toScientificNotation:", value);
    return String(value);
  }

  // For zero, simply return the fixed decimal representation.
  if (num === 0) {
    return num.toFixed(precision);
  }

  // For extremely small (< 1e-3) or very large (>= 1e6), use scientific notation.
  if (Math.abs(num) < 1e-3 || Math.abs(num) >= 1e6) {
    const exponentialString = num.toExponential(precision); // e.g., "8.70e-12"
    const [coefficientStr, exponentStr] = exponentialString.split("e");

    // Parse the coefficient to remove any trailing zeros
    const coefficient = parseFloat(coefficientStr).toString();
    const exponent = Number(exponentStr);

    return `${coefficient} x 10^${exponent}`;
  }

  // For numbers in between, return a fixed decimal representation.
  return num.toFixed(precision);
}