import { AxisScale } from './types';

export function isBandScale(scale: AxisScale): boolean {
  return 'bandwidth' in scale;
}
