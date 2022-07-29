import { getTicks } from '@visx/scale';
import { isNil } from 'lodash-es';

import { getTickFormatter } from '@/visx-next/getTickFormatter';

import type { AxisScale, ScaleInput, TickDatum, TickFormatter } from './types';

export function getTicksData(
  scale: AxisScale | undefined,
  hideZero?: boolean,
  tickFormat?: TickFormatter<ScaleInput<AxisScale>>,
  tickCount?: number,
  tickValues?: ScaleInput<AxisScale>[]
): TickDatum[] {
  if (isNil(scale)) {
    return [];
  }
  const values = (tickValues ?? getTicks(scale, tickCount)).filter(
    (value) => !hideZero || (value !== 0 && value !== '0')
  );
  const tickFormatter = tickFormat ?? getTickFormatter(scale);
  const mappedValues = values.map((value, index) => ({ value, index, label: '' }));
  return mappedValues.map(({ value, index }) => ({
    value,
    index,
    label: tickFormatter(value, index, mappedValues) ?? ''
  }));
}
