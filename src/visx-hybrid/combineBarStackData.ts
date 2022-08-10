import type { AxisScale, IDatumEntry, StackDataWithSums } from './types';

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
  dataEntries: readonly IDatumEntry[],
  horizontal?: boolean
): StackDataWithSums<IndependentScale, DependentScale, Datum>[] {
  type MapValue = StackDataWithSums<IndependentScale, DependentScale, Datum>;
  const dataByStackValue = new Map<string, MapValue>();

  dataEntries.forEach((dataEntry) => {
    const { dataKey, independentAccessor, dependentAccessor } = dataEntry;

    if (!independentAccessor || !dependentAccessor) {
      return;
    }

    const [stackAccessor, valueAccessor] = horizontal
      ? [dependentAccessor, independentAccessor]
      : [independentAccessor, dependentAccessor];

    dataEntry.getRenderingData().forEach((datum) => {
      const stack = stackAccessor(datum);
      const numericValue = valueAccessor(datum);
      const stackKey = String(stack);
      const stackValue =
        dataByStackValue.get(stackKey) ??
        ({ stack, positiveSum: 0, negativeSum: 0, __datum__: datum } as MapValue);
      stackValue[dataKey] = numericValue;
      stackValue[numericValue >= 0 ? 'positiveSum' : 'negativeSum'] += numericValue;
      dataByStackValue.set(stackKey, stackValue);
    });
  });

  return [...dataByStackValue.values()];
}
