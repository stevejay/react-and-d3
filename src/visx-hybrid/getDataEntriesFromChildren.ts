import { Children, Fragment, isValidElement, JSXElementConstructor, ReactElement, ReactNode } from 'react';
import { scaleBand } from '@visx/scale';
import { extent } from 'd3-array';
import type { ScaleBand } from 'd3-scale';
import { stack as d3stack } from 'd3-shape';
import { identity } from 'lodash-es';

import { combineBarStackData } from './combineBarStackData';
import { defaultGroupPadding } from './constants';
import { GroupDatumEntry, SimpleDatumEntry, StackDatumEntry } from './DatumEntry';
import { getBarStackDataEntries } from './getBarStackDataEntries';
import { isDefined } from './isDefined';
import { getStackOffset } from './stackOffset';
import { getStackOrder } from './stackOrder';
import type { AxisScale, DataEntry, IDatumEntry, ScaleInput, StackDataWithSums } from './types';

export function getDataEntriesFromChildren<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale
>(
  children: ReactNode,
  horizontal: boolean,
  isInsideGroup = false
): {
  dataEntries: DataEntry<IndependentScale, DependentScale>[];
  independentDomainValues: ScaleInput<IndependentScale>[];
  dependentDomainValues: ScaleInput<DependentScale>[];
  newDataEntries: readonly IDatumEntry[];
  groupScales: readonly ScaleBand<string>[];
} {
  const dataEntries: DataEntry<IndependentScale, DependentScale>[] = [];
  const independentDomainValues: ScaleInput<IndependentScale>[] = [];
  const dependentDomainValues: ScaleInput<DependentScale>[] = [];

  const newDataEntries: IDatumEntry[] = [];
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
      const dataKeys = result.newDataEntries.map((dataEntry) => dataEntry.dataKey);

      const groupScale = scaleBand<string>({ domain: sort ? [...dataKeys].sort(sort) : dataKeys, padding });
      groupScales.push(groupScale);

      result.newDataEntries.forEach((dataEntry) => newDataEntries.push(dataEntry));
      result.dataEntries.forEach((dataEntry) => {
        dataEntry.transformation = 'grouped';
        dataEntries.push(dataEntry);
      });
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

      const newStackDataEntries = stackedData
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
      newStackDataEntries.forEach((dataEntry) => newDataEntries.push(dataEntry));

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
      const newDatumEntry = new (isInsideGroup ? GroupDatumEntry : SimpleDatumEntry)(
        element.props.dataKey,
        element.props.data,
        element.props.independentAccessor,
        element.props.dependentAccessor,
        element.props.colorAccessor,
        element.props.keyAccessor
      );
      newDataEntries.push(newDatumEntry);

      const dataEntry: DataEntry<IndependentScale, DependentScale> = {
        dataKey: element.props.dataKey,
        data: element.props.data,
        independentAccessor: element.props.independentAccessor,
        dependentAccessor: element.props.dependentAccessor,
        underlyingDatumAccessor: identity,
        transformation: 'none',
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
    dependentDomainValues,
    newDataEntries,
    groupScales
  };
}
