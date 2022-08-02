import { ReactElement } from 'react';
import { AxisScale } from '@visx/axis';

import { SeriesProps, StackDataWithSums } from './types';

/** Returns the value which forms a stack group. */
export const getStackValue = <XScale extends AxisScale, YScale extends AxisScale, Datum extends object>(
  d: Pick<StackDataWithSums<XScale, YScale, Datum>, 'stack'>
) => d.stack;

/**
 * Merges `seriesChildren` `props.data` by their `stack` value which
 * forms the stack grouping (`x` if vertical, `y` if horizontal)
 * and returns `StackDataWithSums[]`.
 */
export function combineBarStackData<XScale extends AxisScale, YScale extends AxisScale, Datum extends object>(
  seriesChildren: ReactElement<SeriesProps<XScale, YScale, Datum>>[],
  horizontal?: boolean
): StackDataWithSums<XScale, YScale, Datum>[] {
  const dataByStackValue: {
    [stackValue: string]: StackDataWithSums<XScale, YScale, Datum>;
  } = {};

  seriesChildren.forEach((child) => {
    const { dataKey, data, xAccessor, yAccessor } = child.props;

    // this should exist but double check
    if (!xAccessor || !yAccessor) {
      return;
    }

    const [stackFn, valueFn] = horizontal ? [yAccessor, xAccessor] : [xAccessor, yAccessor];

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
