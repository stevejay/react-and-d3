import type { AxisScale, StackDatum } from './types';

export function getFirstItem<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(stackDatum: StackDatum<IndependentScale, DependentScale, Datum>): number {
  return stackDatum[0];
}

export function getSecondItem<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(stackDatum: StackDatum<IndependentScale, DependentScale, Datum>): number {
  return stackDatum[1];
}
