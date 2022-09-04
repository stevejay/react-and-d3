import { Children, Fragment, isValidElement, JSXElementConstructor, ReactElement, ReactNode } from 'react';
import { scaleBand } from '@visx/scale';
import type { ScaleBand } from 'd3-scale';
import { stack as d3stack } from 'd3-shape';

import { combineBarStackData } from './combineBarStackData';
import { defaultGroupPadding } from './constants';
import { GroupDataEntry, SimpleDataEntry, StackDataEntry } from './DataEntry';
import { isDefined } from './isDefined';
import { getStackOffset } from './stackOffset';
import { getStackOrder } from './stackOrder';
import type { AxisScale, IDataEntry, ISeriesContainerComponent, StackDataWithSums } from './types';

export function getDataEntriesFromChildren<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale
>(
  children: ReactNode,
  isInsideGroup = false
): {
  dataEntries: readonly IDataEntry[];
  groupScale: ScaleBand<string> | null;
} {
  const dataEntries: IDataEntry[] = [];
  let groupScale: ScaleBand<string> | null = null;

  Children.forEach(children, (element) => {
    if (!isValidElement(element)) {
      return;
    }

    // Groups can't be nested in groups.
    if (
      element.type === Fragment ||
      (typeof element.type !== 'string' &&
        (element.type as ISeriesContainerComponent)?.type === 'group' &&
        !isInsideGroup)
    ) {
      if (groupScale) {
        throw new Error('Only one grouping is allowed in the XY chart.');
      }
      const { sort, padding = defaultGroupPadding, children } = element.props;
      const result = getDataEntriesFromChildren<IndependentScale, DependentScale>(children, true);
      const dataKeys = result.dataEntries.map((dataEntry) => dataEntry.dataKey);
      groupScale = scaleBand<string>({ domain: sort ? [...dataKeys].sort(sort) : dataKeys, padding });
      result.dataEntries.forEach((dataEntry) => dataEntries.push(dataEntry));
    } else if (
      typeof element.type !== 'string' &&
      (element.type as ISeriesContainerComponent)?.type === 'stack'
    ) {
      const { stackOrder, stackOffset } = element.props;
      const result = getDataEntriesFromChildren<IndependentScale, DependentScale>(
        element.props.children,
        false
      );
      const dataKeys = result.dataEntries.map((dataEntry) => dataEntry.dataKey).filter(isDefined);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const combinedData = combineBarStackData<IndependentScale, DependentScale, any>(result.dataEntries);
      const hasSomeNegativeValues = stackOffset ? false : combinedData.some((datum) => datum.negativeSum < 0);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stack = d3stack<StackDataWithSums<IndependentScale, DependentScale, any>, string>();
      stack.keys(dataKeys);

      if (stackOrder) {
        stack.order(getStackOrder(stackOrder));
      }

      // Set offset to diverging if it's undefined and negative values are present
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
            ? (new StackDataEntry({
                dataKey: matchingChild.props.dataKey,
                stackData: seriesData,
                independentAccessor: matchingChild.props.independentAccessor,
                dependentAccessor:
                  matchingChild.props.alternateDependentAccessor ?? matchingChild.props.dependentAccessor,
                usesAlternateDependent: Boolean(matchingChild.props.alternateDependentAccessor),
                colorAccessor: matchingChild.props.colorAccessor,
                keyAccessor: matchingChild.props.keyAccessor
              }) as IDataEntry)
            : null;
        })
        .filter(isDefined);
      stackDataEntries.forEach((dataEntry) => dataEntries.push(dataEntry));
    } else if (element.props.dataKey && element.props.data) {
      const dataEntry = new (isInsideGroup ? GroupDataEntry : SimpleDataEntry)({
        dataKey: element.props.dataKey,
        data: element.props.data,
        independentAccessor: element.props.independentAccessor,
        dependentAccessor: element.props.alternateDependentAccessor ?? element.props.dependentAccessor,
        usesAlternateDependent: Boolean(element.props.alternateDependentAccessor),
        colorAccessor: element.props.colorAccessor,
        keyAccessor: element.props.keyAccessor
      });
      dataEntries.push(dataEntry);
    }
  });

  return { dataEntries, groupScale };
}
