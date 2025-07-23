/**
 * Utility functions for date handling and validation
 */

/**
 * Checks if a date falls on a non-working day
 * @param date The date to check
 * @param workingDays Array of working days (0=Sunday, 6=Saturday)
 * @returns true if the date is a non-working day, false otherwise
 */
export function isNonWorkingDay(date: Date, workingDays: number[]): boolean {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  return !workingDays.includes(dayOfWeek);
}

/**
 * Creates a date filter function that combines working days constraints with other filters
 * @param workingDays Array of working days (0=Sunday, 6=Saturday)
 * @param additionalFilter Optional additional filter function
 * @param minDate Optional minimum date
 * @param maxDate Optional maximum date
 * @returns A filter function that returns true for dates that should be disabled
 */
export function createDateFilter(
  workingDays: number[],
  additionalFilter?: (date: Date) => boolean,
  minDate?: Date,
  maxDate?: Date
): (date: Date) => boolean {
  return (date: Date) => {
    // Check min/max date constraints
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;

    // Check if it's a non-working day
    if (isNonWorkingDay(date, workingDays)) return true;

    // Apply additional filter if provided
    return additionalFilter ? additionalFilter(date) : false;
  };
}

/**
 * Parses a time string in HH:MM format to minutes since midnight
 * @param timeString Time string in HH:MM format
 * @returns Minutes since midnight
 */
export function parseTimeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Checks if a time (in hours and minutes) is within operating hours
 * @param hours Hours (0-23)
 * @param minutes Minutes (0-59)
 * @param operatingHours Operating hours object with start and end times in HH:MM format
 * @returns true if the time is within operating hours, false otherwise
 */
export function isTimeWithinOperatingHours(
  hours: number,
  minutes: number,
  operatingHours?: { start: string; end: string }
): boolean {
  if (!operatingHours) return true; // No restrictions if operating hours not provided

  const timeInMinutes = hours * 60 + minutes;
  const startMinutes = parseTimeToMinutes(operatingHours.start);
  const endMinutes = parseTimeToMinutes(operatingHours.end);

  return timeInMinutes >= startMinutes && timeInMinutes <= endMinutes;
}

/**
 * Gets valid hours for selection based on operating hours
 * @param isPM Whether it's PM (true) or AM (false)
 * @param operatingHours Operating hours object with start and end times in HH:MM format
 * @returns Array of valid hours (1-12) that can be selected
 */
export function getValidHours(
  isPM: boolean,
  operatingHours?: { start: string; end: string }
): number[] {
  if (!operatingHours) return Array.from({ length: 12 }, (_, i) => i + 1); // All hours if no restrictions

  const startMinutes = parseTimeToMinutes(operatingHours.start);
  const endMinutes = parseTimeToMinutes(operatingHours.end);

  const startHour24 = Math.floor(startMinutes / 60);
  const endHour24 = Math.floor(endMinutes / 60);

  // Convert to 12-hour format with AM/PM context
  const startIsPM = startHour24 >= 12;
  const endIsPM = endHour24 >= 12;

  const hours: number[] = [];

  // If we're in AM but operating hours start in PM, no AM hours are valid
  if (!isPM && startIsPM) return [];

  // If we're in PM but operating hours end in AM, no PM hours are valid
  if (isPM && !endIsPM) return [];

  // If we're in the same period as start/end (both AM or both PM)
  if ((!isPM && !startIsPM) || (isPM && startIsPM)) {
    // Get valid hours in the current period
    for (let h = 1; h <= 12; h++) {
      const hour24 = isPM ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;

      if (
        (!isPM && !startIsPM && hour24 >= startHour24) ||
        (isPM && startIsPM && hour24 >= startHour24)
      ) {
        if (
          (!isPM && !endIsPM && hour24 <= endHour24) ||
          (isPM && endIsPM && hour24 <= endHour24) ||
          (isPM && !endIsPM)
        ) {
          hours.push(h);
        }
      }
    }
  } else if (!isPM && endIsPM) {
    // If we're in AM and end is in PM, all AM hours after start are valid
    for (let h = 1; h <= 12; h++) {
      const hour24 = h === 12 ? 0 : h;
      if (hour24 >= startHour24) {
        hours.push(h);
      }
    }
  } else if (isPM && !startIsPM) {
    // If we're in PM and start is in AM, all PM hours before end are valid
    for (let h = 1; h <= 12; h++) {
      const hour24 = h === 12 ? 12 : h + 12;
      if (hour24 <= endHour24) {
        hours.push(h);
      }
    }
  }

  return hours;
}

/**
 * Gets valid minutes for selection based on operating hours and selected hour
 * @param hour Selected hour in 12-hour format (1-12)
 * @param isPM Whether it's PM (true) or AM (false)
 * @param operatingHours Operating hours object with start and end times in HH:MM format
 * @returns Array of valid minutes (0-55, step 5) that can be selected
 */
export function getValidMinutes(
  hour: number,
  isPM: boolean,
  operatingHours?: { start: string; end: string },
  minuteStep: number = 5
): number[] {
  if (!operatingHours) return Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep);

  const startMinutes = parseTimeToMinutes(operatingHours.start);
  const endMinutes = parseTimeToMinutes(operatingHours.end);

  // Convert selected hour to 24-hour format
  const hour24 = isPM ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour;

  const startHour24 = Math.floor(startMinutes / 60);
  const endHour24 = Math.floor(endMinutes / 60);

  const startMinute = startMinutes % 60;
  const endMinute = endMinutes % 60;

  // Generate all possible minutes with the specified step
  const allMinutes = Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep);

  // If hour is outside operating hours, return empty array
  if (hour24 < startHour24 || hour24 > endHour24) return [];

  // If hour is at the boundaries, filter minutes
  if (hour24 === startHour24) {
    // At start hour, only include minutes >= startMinute
    return allMinutes.filter((m) => m >= startMinute);
  } else if (hour24 === endHour24) {
    // At end hour, only include minutes <= endMinute
    return allMinutes.filter((m) => m <= endMinute);
  }

  // Hour is within range but not at boundaries, all minutes are valid
  return allMinutes;
}
