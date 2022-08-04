import { Children, Fragment, isValidElement, ReactNode } from 'react';
import { extent } from 'd3-array';
import { stack as d3stack } from 'd3-shape';
import { identity } from 'lodash-es';

import { combineBarStackData } from './combineBarStackData';
import { getBarStackDataEntries } from './getBarStackDataEntries';
import { getStackOffset } from './stackOffset';
import { getStackOrder } from './stackOrder';
import type { AxisScale, DataEntry, ScaleInput, StackDataWithSums } from './types';

export function getDataEntriesFromChildren<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale
>(
  children: ReactNode,
  horizontal: boolean
): {
  dataEntries: DataEntry<IndependentScale, DependentScale>[];
  independentDomainValues: ScaleInput<IndependentScale>[];
  dependentDomainValues: ScaleInput<DependentScale>[];
} {
  const dataEntries: DataEntry<IndependentScale, DependentScale>[] = [];
  const independentDomainValues: ScaleInput<IndependentScale>[] = [];
  const dependentDomainValues: ScaleInput<DependentScale>[] = [];

  Children.forEach(children, (element) => {
    if (!isValidElement(element)) {
      return;
    }

    if (
      element.type === Fragment ||
      (typeof element.type !== 'string' && element.type.name.endsWith('Group'))
    ) {
      const result = getDataEntriesFromChildren<IndependentScale, DependentScale>(
        element.props.children,
        horizontal
      );
      result.dataEntries.forEach((dataEntry) => dataEntries.push(dataEntry));
      result.independentDomainValues.forEach((value) => independentDomainValues.push(value));
      result.dependentDomainValues.forEach((value) => dependentDomainValues.push(value));
    } else if (typeof element.type !== 'string' && element.type.name.endsWith('Stack')) {
      const { stackOrder, stackOffset } = element.props;
      const result = getDataEntriesFromChildren<IndependentScale, DependentScale>(
        element.props.children,
        horizontal
      );
      const dataKeys = result.dataEntries.map((entry) => entry.dataKey).filter((dataKey) => Boolean(dataKey));

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

      const stackDataEntries = getBarStackDataEntries(stackedData, element.props.children);
      stackDataEntries.forEach((dataEntry) => {
        dataEntries.push(dataEntry);
        dataEntry.data.forEach((datum) => {
          independentDomainValues.push(dataEntry.independentAccessor(datum));
          // TODO See if this works:
          // dependentDomainValues.push(getFirstItem(datum), getSecondItem(datum));
        });
      });

      const comprehensiveDomain = extent(
        stackedData.reduce((allDatum: number[], stack) => {
          stack.forEach(([min, max]) => {
            allDatum.push(min);
            allDatum.push(max);
          });
          return allDatum;
        }, [])
      ) as [number, number];
      dependentDomainValues.push(comprehensiveDomain[0], comprehensiveDomain[1]);
    } else if (element.props.dataKey && element.props.data) {
      const dataEntry: DataEntry<IndependentScale, DependentScale> = {
        dataKey: element.props.dataKey,
        data: element.props.data,
        independentAccessor: element.props.independentAccessor,
        dependentAccessor: element.props.dependentAccessor,
        underlyingDatumAccessor: identity,
        underlying: {
          keyAccessor: element.props.keyAccessor ?? element.props.independentAccessor,
          independentAccessor: element.props.independentAccessor,
          dependentAccessor: element.props.dependentAccessor,
          colorAccessor: element.props.colorAccessor
        }
      };
      dataEntries.push(dataEntry);
      dataEntry.data.forEach((datum) => {
        independentDomainValues.push(dataEntry.independentAccessor(datum));
        dependentDomainValues.push(dataEntry.dependentAccessor(datum));
      });
    }
  });

  return {
    dataEntries,
    independentDomainValues,
    dependentDomainValues
  };
}
