import { AxisScale } from '@visx/axis';

import type { StackDatum } from './types';

export function getStackOriginalDatum<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(datum: StackDatum<IndependentScale, DependentScale, Datum>): Datum {
  return datum.data.__datum__;
}
