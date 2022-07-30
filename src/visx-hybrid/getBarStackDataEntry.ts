import type { JSXElementConstructor, ReactElement } from 'react';
// import { extent } from 'd3-array';
import { identity } from 'lodash-es';

import { getFirstItem, getSecondItem } from './getItem';
import type { AxisScale, BarStackData, BarStackDatum, DataEntry } from './types';

const getStack = <IndependentScale extends AxisScale, DependentScale extends AxisScale, Datum extends object>(
  bar: BarStackDatum<IndependentScale, DependentScale, Datum>
) => bar?.data?.stack;

// returns average of top + bottom of bar (the middle) as this enables more accurately
// finding the nearest datum to a FocusEvent (which is based on the middle of the rect bounding box)
const getNumericValue = <
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(
  bar: BarStackDatum<IndependentScale, DependentScale, Datum>
) => (getFirstItem(bar) + getSecondItem(bar)) / 2;

/** Constructs the `DataRegistryEntry`s for a BarStack, using the stacked data. */
export function getBarStackDataEntry<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale
  //   Datum extends object
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stackedData: BarStackData<IndependentScale, DependentScale, any>,
  //   comprehensiveDomain: [number, number],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  barSeriesChildren: ReactElement<
    // BarSeriesProps<IndependentScale, DependentScale, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    string | JSXElementConstructor<any>
  >[],
  horizontal?: boolean
): DataEntry<IndependentScale, DependentScale>[] {
  const [independentAccessor, dependentAccessor] = horizontal
    ? [getNumericValue, getStack]
    : [getStack, getNumericValue];

  return stackedData
    .map((data) => {
      // TODO the data types don't match.
      const matchingChild = barSeriesChildren.find((child) => child.props.dataKey === data.key); // as any;
      const colorAccessor = matchingChild?.props?.colorAccessor;
      const keyAccessor = matchingChild?.props?.keyAccessor ?? identity; // TODO bad fallback.

      const entry: DataEntry<IndependentScale, DependentScale> = {
        dataKey: data.key,
        data,
        keyAccessor,
        independentAccessor,
        dependentAccessor,
        colorAccessor
      };

      // update the numeric domain to account for full data stack
      // only need to do this for one key
      //   if (comprehensiveDomain.length > 0 && index === 0) {
      //     if (horizontal) {
      //       entry.xScale = (scale) =>
      //         scale.domain(extent(scale.domain().concat(comprehensiveDomain))) as typeof scale;
      //     } else {
      //       entry.yScale = (scale) =>
      //         scale.domain(extent(scale.domain().concat(comprehensiveDomain))) as typeof scale;
      //     }
      //   }

      return entry;
    })
    .filter((entry) => entry) as DataEntry<IndependentScale, DependentScale>[];
}
