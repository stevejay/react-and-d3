import type { AxisScale } from './types';

export function getScaleStep(scale?: AxisScale): number {
  // Broaden type before using 'xxx' in s as typeguard.
  return scale && 'step' in scale ? scale?.step() ?? 0 : 0;
}
