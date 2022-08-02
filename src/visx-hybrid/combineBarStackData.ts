import type { AxisScale, DataEntry, StackDataWithSums } from './types';

/**
 * Merges `seriesChildren` `props.data` by their `stack` value which
 * forms the stack grouping (`x` if vertical, `y` if horizontal)
 * and returns `StackDataWithSums[]`.
 */
export function combineBarStackData<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(
  stackDataEntries: DataEntry<IndependentScale, DependentScale, Datum>[],
  horizontal?: boolean
): StackDataWithSums<IndependentScale, DependentScale, Datum>[] {
  const dataByStackValue: {
    [stackValue: string]: StackDataWithSums<IndependentScale, DependentScale, Datum>;
  } = {};

  stackDataEntries.forEach((dataEntry) => {
    const { dataKey, data, independentAccessor, dependentAccessor } = dataEntry;
    if (!independentAccessor || !dependentAccessor) {
      return;
    }

    const [stackAccessor, valueAccessor] = horizontal
      ? [dependentAccessor, independentAccessor]
      : [independentAccessor, dependentAccessor];

    data.forEach((d) => {
      const stack = stackAccessor(d);
      const numericValue = valueAccessor(d);
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
