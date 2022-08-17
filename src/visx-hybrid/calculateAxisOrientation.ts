import type { AxisOrientation, Variable } from './types';

/**
 * Determines the correct `AxisOrientation` value for an axis, given the particular arguments.
 */
export function calculateAxisOrientation(
  horizontal: boolean,
  variable: Variable,
  position: 'start' | 'end'
): AxisOrientation {
  return (horizontal && variable === 'independent') ||
    (!horizontal && (variable === 'dependent' || variable === 'alternateDependent'))
    ? position === 'start'
      ? 'left'
      : 'right'
    : position === 'start'
    ? 'bottom'
    : 'top';
}
