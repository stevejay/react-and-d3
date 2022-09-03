/** Checks if `value` is `null` or `undefined`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNil(value: any): value is null | undefined {
  return value == null;
}
