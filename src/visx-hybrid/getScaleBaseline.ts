import { coerceNumber } from './coerceNumber';
import { isNil } from './isNil';
import { isValidNumber } from './isValidNumber';
import type { AxisScale } from './types';

/**
 * Returns the output value of a scale's baseline value, which is either zero
 * or the minimum scale value if its domain doesn't include zero.
 */
export function getScaleBaseline<Scale extends AxisScale>(scale: Scale): number {
  const [a, b] = scale.range().map((rangeBoundary) => coerceNumber(rangeBoundary) ?? 0);
  const isDescending = !isNil(a) && !isNil(b) && b < a;
  const maybeScaleZero = scale(0);
  const [minOutput, maxOutput] = isDescending ? [b, a] : [a, b];

  // if maybeScaleZero _is_ a number, but the scale is not clamped and it's outside the domain
  // fallback to the scale's minimum
  return isDescending
    ? isValidNumber(maybeScaleZero)
      ? Math.min(Math.max(minOutput, maybeScaleZero), maxOutput)
      : maxOutput
    : isValidNumber(maybeScaleZero)
    ? Math.max(maybeScaleZero, minOutput)
    : minOutput;
}
