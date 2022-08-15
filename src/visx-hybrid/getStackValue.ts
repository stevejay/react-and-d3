import type { AxisScale, StackDatum } from './types';

// REMOVE
/** Returns the value which forms a stack group. */
export function getStackValue<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(datum: StackDatum<IndependentScale, DependentScale, Datum>) {
  return datum?.data?.stack;
}
