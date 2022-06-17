import { ReactElement, useContext, useEffect, useMemo } from 'react';
import { AxisScale } from '@visx/axis';
import { StackPathConfig } from '@visx/shape';
import { extent } from 'd3-array';
import { SeriesPoint, stack as d3stack } from 'd3-shape';

import { getChildrenAndGrandchildrenWithProps } from './types/typeguards/isChildWithProps';
import { BarSeriesProps } from './BarSeries';
import { combineBarStackData } from './combineBarStackData';
import { DataContext } from './DataContext';
import { getBarStackRegistryData } from './getBarStackRegistryData';
import getStackOffset from './stackOffset';
import getStackOrder from './stackOrder';
import { CombinedStackData, DataContextType, SeriesProps } from './types';

interface JSXElement extends ReactElement<any, any> {}

type UseStackedData<Datum extends object> = {
  children: JSXElement | JSXElement[];
} & Pick<StackPathConfig<Datum, string>, 'stackOffset' | 'stackOrder'>;

export function useStackedData<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object,
  ChildrenProps extends SeriesProps<XScale, YScale, Datum>
>({ children, stackOrder, stackOffset }: UseStackedData<Datum>) {
  type StackDatum = SeriesPoint<CombinedStackData<XScale, YScale>>;

  const { horizontal, registerData, unregisterData } = useContext(DataContext) as unknown as DataContextType<
    XScale,
    YScale,
    StackDatum
  >;

  // TODO I doubt this memoization works.
  const barSeriesChildren = useMemo(
    () => getChildrenAndGrandchildrenWithProps<BarSeriesProps<XScale, YScale, Datum>>(children),
    [children]
  );

  // extract data keys from child series
  const dataKeys: string[] = useMemo(
    () => barSeriesChildren.map((child) => child.props.dataKey ?? '').filter((key) => key),
    [barSeriesChildren]
  );

  // find series children
  // @TODO: memoization doesn't work well if at all for this
  // const seriesChildren = useMemo(
  //   () => Children.toArray(children).filter((child) => isChildWithProps<ChildrenProps>(child)),
  //   [children]
  // ) as ReactElement<ChildrenProps>[];

  // // extract data keys from child series
  // const dataKeys: string[] = useMemo(
  //   () => seriesChildren.filter((child) => child.props.dataKey).map((child) => child.props.dataKey),
  //   [seriesChildren]
  // );

  // group all child data by stack value { [x | y]: { [dataKey]: value } }
  // this format is needed by d3Stack
  const combinedData = useMemo(
    () => combineBarStackData<XScale, YScale, Datum>(barSeriesChildren, horizontal),
    [horizontal, barSeriesChildren]
  );

  // stack data
  const stackedData = useMemo(() => {
    // automatically set offset to diverging if it's undefined and negative values are present
    const hasSomeNegativeValues = stackOffset ? null : combinedData.some((d) => d.negativeSum < 0);

    const stack = d3stack<CombinedStackData<XScale, YScale>, string>();
    stack.keys(dataKeys);
    if (stackOrder) {
      stack.order(getStackOrder(stackOrder));
    }
    if (stackOffset || hasSomeNegativeValues) {
      stack.offset(getStackOffset(stackOffset || 'diverging'));
    }

    return stack(combinedData);
  }, [combinedData, dataKeys, stackOrder, stackOffset]);

  // update the domain to account for the (directional) stacked value
  const comprehensiveDomain = useMemo(
    () =>
      extent(
        stackedData.reduce((allDatum: number[], stack) => {
          stack.forEach(([min, max]) => {
            allDatum.push(min);
            allDatum.push(max);
          });
          return allDatum;
        }, [])
      ) as [number, number],
    [stackedData]
  );

  // register all child data using the stack-transformed values
  useEffect(() => {
    const dataToRegister = getBarStackRegistryData(stackedData, comprehensiveDomain, horizontal);
    registerData(dataToRegister);
    // unregister data on unmount
    return () => unregisterData(dataKeys);
  }, [
    dataKeys,
    comprehensiveDomain,
    horizontal,
    stackedData,
    registerData,
    unregisterData,
    barSeriesChildren
  ]);

  return { seriesChildren: barSeriesChildren, dataKeys, stackedData };
}
