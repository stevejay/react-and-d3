import type { AxisScale, StackDataWithSums } from './types';

/** Returns the value which forms a stack group. */
export const getStackValue = <
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(
  d: Pick<StackDataWithSums<IndependentScale, DependentScale, Datum>, 'stack'>
) => d.stack;
