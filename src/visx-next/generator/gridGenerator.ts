import { AxisScale } from '@visx/axis';

import { coerceNumber, getScaleBandwidth, ScaleInput } from '../scale';
import { GridScale } from '../types';

export function createGridGenerator<Scale extends GridScale>(
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

// export function getTickPosition<Scale extends AxisScale>(
//   scale: Scale,
//   renderingOffset: number /* TODO use */,
//   align: 'start' | 'center' | 'end' = 'center'
// ) {
//   // Broaden type before using 'xxx' in s as typeguard.
//   const s = scale as AxisScale;

//   // For point or band scales,
//   // have to add offset to make the tick at center or end.
//   if (align !== 'start' && 'bandwidth' in s) {
//     let offset = s.bandwidth();
//     if (align === 'center') {
//       offset /= 2;
//     }
//     if (s.round()) {
//       offset = Math.round(offset);
//     }
//     return (d: ScaleInput<Scale>) => {
//       const scaledValue = s(d);
//       return typeof scaledValue === 'number' ? scaledValue + offset : scaledValue;
//     };
//   }

//   return scale as (d: ScaleInput<Scale>) => AxisScaleOutput;
// }
