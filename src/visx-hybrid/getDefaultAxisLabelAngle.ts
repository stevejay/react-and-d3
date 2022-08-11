import type { AxisOrientation, LabelAlignment } from './types';

export function getDefaultAxisLabelAngle(axisOrientation: AxisOrientation): LabelAlignment {
  return axisOrientation === 'left' || axisOrientation === 'right' ? 'vertical' : 'horizontal';
}
