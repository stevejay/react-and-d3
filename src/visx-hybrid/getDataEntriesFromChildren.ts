import { Children, Fragment, isValidElement, JSXElementConstructor, ReactElement, ReactNode } from 'react';
import { scaleBand } from '@visx/scale';
import type { ScaleBand } from 'd3-scale';
import { stack as d3stack } from 'd3-shape';

import { combineBarStackData } from './combineBarStackData';
import { defaultGroupPadding } from './constants';
import { GroupDatumEntry, SimpleDatumEntry, StackDatumEntry } from './DatumEntry';
import { isDefined } from './isDefined';
import { getStackOffset } from './stackOffset';
import { getStackOrder } from './stackOrder';
import type { AxisScale, IDatumEntry, StackDataWithSums } from './types';

export function getDataEntriesFromChildren<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale
>(
  children: ReactNode,
  horizontal: boolean,
  isInsideGroup = false
): {
  dataEntries: readonly IDatumEntry[];
  groupScales: readonly ScaleBand<string>[];
} {
  const dataEntries: IDatumEntry[] = [];
  const groupScales: ScaleBand<string>[] = [];

  Children.forEach(children, (element) => {
    if (!isValidElement(element)) {
      return;
    }

    // Groups can't be nested in groups.
    if (
      element.type === Fragment ||
      (typeof element.type !== 'string' && element.type.name.endsWith('Group') && !isInsideGroup)
    ) {
      const { sort, padding = defaultGroupPadding, children } = element.props;

      const result = getDataEntriesFromChildren<IndependentScale, DependentScale>(children, horizontal, true);
      const dataKeys = result.dataEntries.map((dataEntry) => dataEntry.dataKey);

      const groupScale = scaleBand<string>({ domain: sort ? [...dataKeys].sort(sort) : dataKeys, padding });
      groupScales.push(groupScale);

      result.dataEntries.forEach((dataEntry) => dataEntries.push(dataEntry));
    } else if (typeof element.type !== 'string' && element.type.name.endsWith('Stack')) {
      const { stackOrder, stackOffset } = element.props;
      const result = getDataEntriesFromChildren<IndependentScale, DependentScale>(
        element.props.children,
        horizontal
      );
      const dataKeys = result.dataEntries.map((dataEntry) => dataEntry.dataKey).filter(isDefined);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const combinedData = combineBarStackData<IndependentScale, DependentScale, any>(
        result.dataEntries,
        horizontal
      );
      // automatically set offset to diverging if it's undefined and negative values are present
      const hasSomeNegativeValues = stackOffset ? false : combinedData.some((datum) => datum.negativeSum < 0);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stack = d3stack<StackDataWithSums<IndependentScale, DependentScale, any>, string>();
      stack.keys(dataKeys);

      if (stackOrder) {
        stack.order(getStackOrder(stackOrder));
      }

      if (stackOffset || hasSomeNegativeValues) {
        stack.offset(getStackOffset(stackOffset || 'diverging'));
      }

      const stackedData = stack(combinedData);

      const stackDataEntries = stackedData
        .map((seriesData) => {
          const matchingChild = element.props.children.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (child: ReactElement<any, string | JSXElementConstructor<any>>) =>
              child.props.dataKey === seriesData.key
          );
          return matchingChild
            ? new StackDatumEntry(
                matchingChild.props.dataKey,
                seriesData,
                matchingChild.props.independentAccessor,
                matchingChild.props.dependentAccessor,
                matchingChild.props.colorAccessor,
                matchingChild.props.keyAccessor
              )
            : null;
        })
        .filter(isDefined);
      stackDataEntries.forEach((dataEntry) => dataEntries.push(dataEntry));
    } else if (element.props.dataKey && element.props.data) {
      const dataEntry = new (isInsideGroup ? GroupDatumEntry : SimpleDatumEntry)(
        element.props.dataKey,
        element.props.data,
        element.props.independentAccessor,
        element.props.dependentAccessor,
        element.props.colorAccessor,
        element.props.keyAccessor
      );
      dataEntries.push(dataEntry);
    }
  });

  return { dataEntries, groupScales };
}
