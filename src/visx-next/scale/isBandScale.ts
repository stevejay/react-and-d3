import { GridScale } from '../types';

export function isBandScale(scale: GridScale) {
  return 'bandwidth' in scale;
}
