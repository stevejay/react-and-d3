/**
 * Clones the input date.
 * @returns A new Date object
 */
export function cloneDate(d: Date): Date {
  return new Date(d.getTime());
}

/**
 * Returns a new Date object that is set to the very start of first day of the
 * month of the input date.
 * @returns A new Date object
 */
export function startOfThisMonth(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth()));
}

/**
 * Returns a new Date object that is set to the very last moment of the month of
 * the input date.
 * @returns A new Date object
 */
export function lastMomentOfThisMonth(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 0, 0, 0, -1));
}
