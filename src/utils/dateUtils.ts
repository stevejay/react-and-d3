/**
 * Clones the input date.
 * @returns A new Date object
 */
export function cloneDate(value: Date): Date {
  return new Date(value.getTime());
}

/**
 * Returns a new Date object that is set to the very start of first day of the
 * month of the input date.
 * @returns A new Date object
 */
export function startOfThisMonth(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth()));
}

/**
 * Returns a new Date object that is set to the very last moment of the month of
 * the input date.
 * @returns A new Date object
 */
export function lastMomentOfThisMonth(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth() + 1, 0, 0, 0, 0, -1));
}
