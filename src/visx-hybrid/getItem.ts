import type { AxisScale, StackDatum } from './types';

export function getFirstItem<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(datum: StackDatum<IndependentScale, DependentScale, Datum>): number {
  return datum[0];
}

export function getSecondItem<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(datum: StackDatum<IndependentScale, DependentScale, Datum>): number {
  return datum[1];
}
