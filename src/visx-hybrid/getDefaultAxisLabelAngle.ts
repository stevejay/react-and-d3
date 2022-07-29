import type { AxisOrientation, LabelAngle } from './types';

export function getDefaultAxisLabelAngle(axisOrientation: AxisOrientation): LabelAngle {
  return axisOrientation === 'left' || axisOrientation === 'right' ? 'vertical' : 'horizontal';
}
