/**
 * Converts a number or string to scientific notation with fixed precision.
 * Useful for displaying large transaction or bet amounts.
 *
 * @param value - The numeric value to convert
 * @param precision - Number of digits after the decimal (default: 2)
 * @returns Scientific notation string (e.g., "1.23e+6")
 */
export function toScientificNotation(value: number | string, precision: number = 2): string {
    const num = typeof value === "string" ? Number(value) : value;
  
    if (isNaN(num)) {
      console.warn("Invalid number provided to toScientificNotation:", value);
      return String(value);
    }
  
    // If the number is small enough, return as-is
    if (num < 1e6) return num.toString();
  
    return num.toExponential(precision);
  }
  