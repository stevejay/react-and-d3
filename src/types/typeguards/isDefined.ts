export function isDefined<T>(input: T | undefined | null): input is T {
  return typeof input !== 'undefined' && input !== null;
}
