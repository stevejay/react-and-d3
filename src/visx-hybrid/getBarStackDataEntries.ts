import type { JSXElementConstructor, ReactElement } from 'react';

import { getFirstItem, getSecondItem } from './getItem';
import { getStackOriginalDatum } from './getStackOriginalDatum';
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
  return stackedData
    .map((seriesData) => {
      const matchingChild = barSeriesChildren.find((child) => child.props.dataKey === seriesData.key);
      const {
        colorAccessor,
        keyAccessor,
        independentAccessor: underlyingIndependentAccessor,
        dependentAccessor: underlyingDependentAccessor
      } = matchingChild?.props ?? {};
      return {
        dataKey: seriesData.key,
        data: seriesData,
        independentAccessor: getStack,
        dependentAccessor: getNumericValue,
        underlyingDatumAccessor: getStackOriginalDatum<IndependentScale, DependentScale, Datum>,
        underlying: {
          keyAccessor: keyAccessor ?? underlyingIndependentAccessor,
          independentAccessor: underlyingIndependentAccessor,
          dependentAccessor: underlyingDependentAccessor,
          colorAccessor
        }
      };
    })
    .filter((entry) => entry) as DataEntry<IndependentScale, DependentScale>[];
}
