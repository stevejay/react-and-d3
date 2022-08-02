import type { JSXElementConstructor, ReactElement } from 'react';
import { identity } from 'lodash-es';

import { getFirstItem, getSecondItem } from './getItem';
import type { AxisScale, DataEntry, StackDatum, StackedData } from './types';

const getStack = <IndependentScale extends AxisScale, DependentScale extends AxisScale, Datum extends object>(
  bar: StackDatum<IndependentScale, DependentScale, Datum>
) => bar?.data?.stack;

// returns average of top + bottom of bar (the middle) as this enables more accurately
// finding the nearest datum to a FocusEvent (which is based on the middle of the rect bounding box)
const getNumericValue = <
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(
  bar: StackDatum<IndependentScale, DependentScale, Datum>
) => (getFirstItem(bar) + getSecondItem(bar)) * 0.5;

/** Constructs the `DataRegistryEntry`s for a BarStack, using the stacked data. */
export function getBarStackDataEntries<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(
  stackedData: StackedData<IndependentScale, DependentScale, Datum>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  barSeriesChildren: ReactElement<any, string | JSXElementConstructor<any>>[]
): DataEntry<IndependentScale, DependentScale>[] {
  const [independentAccessor, dependentAccessor] = [getStack, getNumericValue];
  return stackedData
    .map((data) => {
      const matchingChild = barSeriesChildren.find((child) => child.props.dataKey === data.key);
      const colorAccessor = matchingChild?.props?.colorAccessor;
      const keyAccessor = matchingChild?.props?.keyAccessor ?? identity; // TODO bad fallback.
      return {
        dataKey: data.key,
        data,
        keyAccessor,
        independentAccessor,
        dependentAccessor,
        colorAccessor
      };
    })
    .filter((entry) => entry) as DataEntry<IndependentScale, DependentScale>[];
}
