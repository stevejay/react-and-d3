import { getDefaultRenderingOffset } from '../rendering';
import { coerceNumber, getScaleBandwidth, ScaleInput } from '../scale';
import { GridScale } from '../types';

export function createGridGenerator<Scale extends GridScale>(
  scale: Scale,
  offset?: number
): (d: ScaleInput<Scale>) => number {
  const scaleCopy = scale.copy();
  const scaleOffset = (offset ?? getDefaultRenderingOffset()) + getScaleBandwidth(scaleCopy) / 2;
  return (d) => (coerceNumber(scaleCopy(d)) ?? 0) + scaleOffset;
}
