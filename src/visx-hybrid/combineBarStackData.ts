import { AxisScale } from '@visx/axis';

import { CombinedStackData } from '@/visx-next/types';

import { DataEntry } from './types';

/** Returns the value which forms a stack group. */
export const getStackValue = <
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(
  d: Pick<CombinedStackData<IndependentScale, DependentScale, Datum>, 'stack'>
) => d.stack;

/**
 * Merges `seriesChildren` `props.data` by their `stack` value which
 * forms the stack grouping (`x` if vertical, `y` if horizontal)
 * and returns `CombinedStackData[]`.
 */
export function combineBarStackData<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(
  stackDataEntries: DataEntry<IndependentScale, DependentScale, Datum>[],
  horizontal?: boolean
): CombinedStackData<IndependentScale, DependentScale, Datum>[] {
  const dataByStackValue: {
    [stackValue: string]: CombinedStackData<IndependentScale, DependentScale, Datum>;
  } = {};

  stackDataEntries.forEach((dataEntry) => {
    const { dataKey, data, independentAccessor, dependentAccessor } = dataEntry;

    // this should exist but double check
    if (!independentAccessor || !dependentAccessor) {
      return;
    }

    const [stackFn, valueFn] = horizontal
      ? [dependentAccessor, independentAccessor]
      : [independentAccessor, dependentAccessor];

    data.forEach((d) => {
      const stack = stackFn(d);
      const numericValue = valueFn(d);
      const stackKey = String(stack);
      if (!dataByStackValue[stackKey]) {
        dataByStackValue[stackKey] = { stack, positiveSum: 0, negativeSum: 0, __datum__: d };
      }
      dataByStackValue[stackKey][dataKey] = numericValue;
      dataByStackValue[stackKey][numericValue >= 0 ? 'positiveSum' : 'negativeSum'] += numericValue;
    });
  });

  return Object.values(dataByStackValue);
}
