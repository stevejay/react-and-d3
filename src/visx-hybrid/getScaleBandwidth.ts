import type { AxisScale } from './types';

export function getScaleBandwidth(scale?: AxisScale): number {
  return scale && 'bandwidth' in scale ? scale?.bandwidth() ?? 0 : 0;
}
