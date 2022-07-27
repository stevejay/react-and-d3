import { Orientation } from '@/visx-next/types';

export function calculateOrientation(
  horizontal: boolean,
  variableType: 'independent' | 'dependent',
  position: 'start' | 'end'
): Orientation {
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
