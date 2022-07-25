import { AxisScale } from '../types';

export function getScaleStep<Scale extends AxisScale>(scale?: Scale) {
  // Broaden type before using 'xxx' in s as typeguard.
  const s = scale as AxisScale;
  return s && 'step' in s ? s?.step() ?? 0 : 0;
}
