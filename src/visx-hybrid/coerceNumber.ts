import type { NumberLike } from './types';

/**
 * Tries to convert the given value into a number.
 */
export function coerceNumber<T>(value: T | NumberLike): T | number {
  if ((typeof value === 'function' || (typeof value === 'object' && !!value)) && 'valueOf' in value) {
    const num = value.valueOf();
    if (typeof num === 'number') {
      return num;
    }
  }
  return value as T;
}
