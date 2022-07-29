import type { AxisOrientation, VariableType } from './types';

export function calculateAxisOrientation(
  horizontal: boolean,
  variableType: VariableType,
  position: 'start' | 'end'
): AxisOrientation {
  return horizontal && variableType === 'independent'
    ? position === 'start'
      ? 'left'
      : 'right'
    : horizontal && variableType === 'dependent'
    ? position === 'start'
      ? 'bottom'
      : 'top'
    : !horizontal && variableType == 'independent'
    ? position === 'start'
      ? 'bottom'
      : 'top'
    : position === 'start'
    ? 'left'
    : 'right'; // !horizontal && variableType === 'dependent'
}
