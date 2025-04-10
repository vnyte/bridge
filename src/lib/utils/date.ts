/**
 * Formats a Date object as a YYYY-MM-DD string without timezone information
 * @param date The Date object to format
 * @returns A string in YYYY-MM-DD format, or null if the input is null
 */
export function formatDateToYYYYMMDD(date: Date | null): string | null {
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD string to a Date object
 * @param dateString The string in YYYY-MM-DD format
 * @returns A Date object, or null if the input is null or invalid
 */
export function parseYYYYMMDDToDate(dateString: string | null): Date | null {
  if (!dateString) return null;

  // Check if the string is in the expected format
  const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  if (!isValidFormat) return null;

  // Create a new date (using the constructor with year, month, day ensures no timezone issues)
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  // Validate that the date is valid
  if (isNaN(date.getTime())) return null;

  return date;
}
