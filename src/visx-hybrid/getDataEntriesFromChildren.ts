import { Children, Fragment, isValidElement, ReactNode } from 'react';
import { stack as d3stack } from 'd3-shape';
import { identity } from 'lodash-es';

import { combineBarStackData } from './combineBarStackData';
import { getBarStackDataEntry } from './getBarStackDataEntry';
import { getStackOffset } from './stackOffset';
import { getStackOrder } from './stackOrder';
import type { AxisScale, CombinedStackData, DataEntry } from './types';

export function getDataEntriesFromChildren<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale
>(children: ReactNode, horizontal: boolean): DataEntry<IndependentScale, DependentScale>[] {
  const dataEntries: DataEntry<IndependentScale, DependentScale>[] = [];

  Children.forEach(children, (element) => {
    if (!isValidElement(element)) {
      return;
    }

    if (element.type === Fragment) {
      // Transparently support React.Fragment and its children.
      getDataEntriesFromChildren<IndependentScale, DependentScale>(
        element.props.children,
        horizontal
      ).forEach((entry) => dataEntries.push(entry));
    } else if (typeof element.type !== 'string' && element.type.name.endsWith('Stack')) {
      const childDataEntries = getDataEntriesFromChildren<IndependentScale, DependentScale>(
        element.props.children,
        horizontal
      );
      const { stackOrder, stackOffset } = element.props;

      // -----

      const dataKeys = childDataEntries.map((entry) => entry.dataKey).filter((dataKey) => dataKey);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const combinedData = combineBarStackData<IndependentScale, DependentScale, any>(
        childDataEntries,
        horizontal
      );
      // automatically set offset to diverging if it's undefined and negative values are present
      const hasSomeNegativeValues = stackOffset ? false : combinedData.some((d) => d.negativeSum < 0);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stack = d3stack<CombinedStackData<IndependentScale, DependentScale, any>, string>();
      stack.keys(dataKeys);

      if (stackOrder) {
        stack.order(getStackOrder(stackOrder));
      }

      if (stackOffset || hasSomeNegativeValues) {
        stack.offset(getStackOffset(stackOffset || 'diverging'));
      }

      const stackedData = stack(combinedData);

      // const comprehensiveDomain = extent(
      //   stackedData.reduce((allDatum: number[], stack) => {
      //     stack.forEach(([min, max]) => {
      //       allDatum.push(min);
      //       allDatum.push(max);
      //     });
      //     return allDatum;
      //   }, [])
      // ) as [number, number];

      const stackDataEntries = getBarStackDataEntry(
        stackedData,
        // comprehensiveDomain,
        element.props.children,
        horizontal
      );

      stackDataEntries.forEach((entry) => dataEntries.push(entry));
    } else if (element.props.dataKey) {
      const dataEntry: DataEntry<IndependentScale, DependentScale> = {
        dataKey: element.props.dataKey,
        data: element.props.data,
        keyAccessor: element.props.keyAccessor ?? identity,
        independentAccessor: element.props.independentAccessor,
        dependentAccessor: element.props.dependentAccessor,
        colorAccessor: element.props.colorAccessor
      };
      dataEntries.push(dataEntry);
    }
  });

  return dataEntries;
}
