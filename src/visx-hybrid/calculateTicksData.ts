import { getTicks } from '@visx/scale';

import { getTickFormatter } from './getTickFormatter';
import { isNil } from './isNil';
import type { AxisScale, ScaleInput, TickDatum, TickFormatter } from './types';

export interface TicksDataParams {
  scale: AxisScale | undefined;
  hideZero: boolean;
  tickFormat?: TickFormatter<ScaleInput<AxisScale>>;
  tickCount?: number;
  tickValues?: ScaleInput<AxisScale>[];
}

/**
 * Calculates the tick label values using the given tick parameters.
 */
export function calculateTicksData({
  scale,
  hideZero,
  tickFormat,
  tickCount,
  tickValues
}: TicksDataParams): readonly TickDatum[] {
  if (isNil(scale)) {
    return [];
  }
  const values = (tickValues ?? getTicks(scale, tickCount)).filter(
    (value) => !hideZero || (value !== 0 && value !== '0')
  );
  const tickFormatter = tickFormat ?? getTickFormatter(scale);
  const mappedValues = values.map((value, index) => ({ value, index, label: '' }));
  // Done as a separate mapping to the previous line because all mapped values need to be passed to the tickFormatter:
  return mappedValues.map(({ value, index }) => ({
    value,
    index,
    label: tickFormatter(value, index, mappedValues) ?? ''
  }));
}
