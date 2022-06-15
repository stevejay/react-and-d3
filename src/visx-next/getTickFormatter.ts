import { AxisScale } from '@visx/axis';
import { ScaleInput, toString } from '@visx/scale';

import { TickFormatter } from './types';

/**
 * Returns a tick position for the given tick value
 */
export function getTickFormatter<Scale extends AxisScale>(scale: Scale) {
  // Broaden type before using 'xxx' in s as typeguard.
  const s = scale as AxisScale;

  // For point or band scales,
  // have to add offset to make the tick centered.
  if ('tickFormat' in s) {
    return s.tickFormat() as TickFormatter<ScaleInput<Scale>>;
  }

  return toString as TickFormatter<ScaleInput<Scale>>;
}
