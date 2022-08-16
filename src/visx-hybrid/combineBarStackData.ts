import type { AxisScale, IDataEntry, StackDataWithSums } from './types';

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
  dataEntries: readonly IDataEntry<Datum, Datum>[],
  horizontal?: boolean
): StackDataWithSums<IndependentScale, DependentScale, Datum>[] {
  type MapValue = StackDataWithSums<IndependentScale, DependentScale, Datum>;
  const dataByStackValue = new Map<string, MapValue>();
  // Note: At this point the data entries are the original data entries,
  // ones that have not yet been transformed into stack data entries.
  dataEntries.forEach((dataEntry) => {
    const { dataKey, independentAccessor, dependentAccessor } = dataEntry;
    if (!independentAccessor || !dependentAccessor) {
      return;
    }
    const [stackAccessor, valueAccessor] = horizontal
      ? [dependentAccessor, independentAccessor]
      : [independentAccessor, dependentAccessor];
    dataEntry.getRenderingData().forEach((originalDatum) => {
      const stack = stackAccessor(originalDatum);
      const numericValue = valueAccessor(originalDatum);
      const stackKey = String(stack);
      const stackValue =
        dataByStackValue.get(stackKey) ??
        ({ stack, positiveSum: 0, negativeSum: 0, __datum__: originalDatum } as MapValue);
      stackValue[dataKey] = numericValue;
      stackValue[numericValue >= 0 ? 'positiveSum' : 'negativeSum'] += numericValue;
      dataByStackValue.set(stackKey, stackValue);
    });
  });

  return [...dataByStackValue.values()];
}
