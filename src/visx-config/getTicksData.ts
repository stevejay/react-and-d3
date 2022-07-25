import { isNil } from 'lodash-es';

import { getTickFormatter } from '@/visx-next/getTickFormatter';
import { getTicks, ScaleInput } from '@/visx-next/scale';
import { AxisScale, TickFormatter } from '@/visx-next/types';

import { TickDatum } from './types';

export function getTicksData<Scale extends AxisScale>(
  scale: Scale | undefined,
  config: {
    hideZero?: boolean;
    tickFormat?: TickFormatter<ScaleInput<AxisScale>>; // wrong
    tickCount?: number;
    tickValues?: ScaleInput<AxisScale>[]; // wrong
  }
): TickDatum[] {
  if (isNil(scale)) {
    return [];
  }
  const values = (config.tickValues ?? getTicks(scale, config.tickCount)).filter(
    (value) => !config.hideZero || (value !== 0 && value !== '0')
  );
  const tickFormatter = config.tickFormat ?? getTickFormatter(scale);
  const mappedValues = values.map((value, index) => ({ value, index, label: '' }));
  return mappedValues.map(({ value, index }) => ({
    value,
    index,
    label: tickFormatter(value, index, mappedValues) ?? ''
  }));
}
