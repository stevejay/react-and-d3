import type { AxisScale } from './types';

export function isInvertibleScale(scale: AxisScale): boolean {
  return 'invert' in scale && typeof scale.invert === 'function';
}
