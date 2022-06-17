import { AxisScale } from '@visx/axis';

import { coerceNumber, getScaleBandwidth, ScaleInput } from '../scale';
import { GridScale } from '../types';

export function createTickPositioning<Scale extends GridScale>(
  scale: Scale,
  offset: number
): (d: ScaleInput<Scale>) => number {
  const scaleCopy = scale.copy();
  let scaleOffset = Math.max(0, getScaleBandwidth(scaleCopy) - offset * 2) / 2;

  // Broaden type before using 'round' in s as typeguard.
  const s = scale as AxisScale;
  if ('round' in s) {
    scaleOffset = Math.round(scaleOffset);
  }

  // offset + getScaleBandwidth(scaleCopy) / 2;
  return (d) => (coerceNumber(scaleCopy(d)) ?? 0) + scaleOffset;
}
