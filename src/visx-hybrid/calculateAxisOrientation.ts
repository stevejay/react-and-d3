import type { AxisOrientation, Variable } from './types';

export function calculateAxisOrientation(
  horizontal: boolean,
  variable: Variable,
  position: 'start' | 'end'
): AxisOrientation {
  return horizontal && variable === 'independent'
    ? position === 'start'
      ? 'left'
      : 'right'
    : horizontal && variable === 'dependent'
    ? position === 'start'
      ? 'bottom'
      : 'top'
    : !horizontal && variable == 'independent'
    ? position === 'start'
      ? 'bottom'
      : 'top'
    : position === 'start'
    ? 'left'
    : 'right'; // !horizontal && variable === 'dependent'
}
