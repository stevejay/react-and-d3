import type { AxisScale } from './types';

export function isBandScale(scale: AxisScale): boolean {
  return 'bandwidth' in scale && typeof scale.bandwidth !== 'undefined';
}
