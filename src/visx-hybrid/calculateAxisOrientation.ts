import type { AxisOrientation, Variable } from './types';

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
