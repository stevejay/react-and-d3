import { AxisScale } from '@visx/axis';
import type { ScaleInput } from '@visx/scale';
import { toString } from '@visx/scale';

import { TickFormatter } from './types';

/**
 * Returns a tick position for the given tick value
 */
export function getTickFormatter(scale: AxisScale) {
  // For point or band scales,
  // have to add offset to make the tick centered.
  if ('tickFormat' in scale) {
    return scale.tickFormat() as TickFormatter<ScaleInput<AxisScale>>;
  }
  return toString as TickFormatter<ScaleInput<AxisScale>>;
}
