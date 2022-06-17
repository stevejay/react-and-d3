import { ReactNode, useContext, useEffect, useMemo } from 'react';
import { animated, SpringConfig } from 'react-spring';
import { Group } from '@visx/group';
import { scaleBand } from '@visx/scale';
import { ScaleBand, ScaleOrdinal } from 'd3-scale';

import { useBarGroupTransitions } from './animation/useBarGroupTransitions';
import { getChildrenAndGrandchildrenWithProps } from './types/typeguards/isChildWithProps';
import { BarSeriesProps } from './BarSeries';
import { DataContext } from './DataContext';
import { DataRegistry } from './DataRegistry';
import { getScaleBandwidth } from './scale';
import { DataContextType, PositionScale } from './types';

type BarGroupSeriesProps<XScale extends PositionScale, YScale extends PositionScale, Datum extends object> = {
  dataKey: string;
  dataRegistry: Omit<DataRegistry<XScale, YScale, Datum>, 'registry' | 'registryKeys'>;
  xScale: XScale;
  yScale: YScale;
  groupScale: ScaleBand<string>;
  horizontal: boolean;
  renderingOffset?: number;
  animate?: boolean;
  colorAccessor?: (d: Datum, index?: number | undefined) => string | null | undefined;
  /* A react-spring configuration object */
  springConfig?: SpringConfig;
  colorScale?: ScaleOrdinal<string, string, never>;
};

function BarGroupSeries<XScale extends PositionScale, YScale extends PositionScale, Datum extends object>({
  dataKey,
  dataRegistry,
  xScale,
  yScale,
  groupScale,
  horizontal,
  renderingOffset,
  springConfig,
  animate = true,
  colorAccessor,
  colorScale
}: BarGroupSeriesProps<XScale, YScale, Datum>) {
  const registryEntry = dataRegistry?.get(dataKey);
  const transitions = useBarGroupTransitions(
    registryEntry.data,
    xScale,
    yScale,
    groupScale,
    dataKey,
    dataRegistry,
    // keyAccessor: (datum: Datum) => Key,
    horizontal,
    //   fallbackBandwidth: number,
    springConfig,
    animate,
    renderingOffset
  );
  return (
    <Group data-test-id="bar-group-series" data-series-id={dataKey}>
      {transitions(({ opacity, x, y, width, height }, datum, _, index) => {
        // const { style, ...restBarProps } = typeof barProps === 'function' ? barProps(datum) : barProps;
        return (
          <animated.rect
            data-test-id="bar"
            x={x}
            y={y}
            width={width}
            height={height}
            fill={colorAccessor?.(datum, index) ?? colorScale?.(dataKey) ?? 'gray'}
            style={{ opacity }}
            role="presentation"
            aria-hidden
            // className={barClassName}
            // {...restBarProps}
          />
        );
      })}
    </Group>
  );
}

export type XYChartBarGroupProps<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
> = {
  /** `BarSeries` elements */
  children: ReactNode;
  /** Group band scale padding, [0, 1] where 0 = no padding, 1 = no bar. */
  padding?: number;
  /** Comparator function to sort `dataKeys` within a bar group. By default the DOM rendering order of `BarGroup`s `children` is used. Must be stable. */
  sortBars?: (dataKeyA: string, dataKeyB: string) => number;
  /** Rendered component which is passed BarsProps by BaseBarGroup after processing. */
  //   BarsComponent: React.FC<BarsProps<XScale, YScale>>;
  animate?: boolean;
  /* A react-spring configuration object */
  springConfig?: SpringConfig;
};
// & Pick<
//   SeriesProps<XScale, YScale, Datum>,
//   'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onBlur' | 'onFocus' | 'enableEvents'
// >;

export function XYChartBarGroup<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>({
  children,
  padding,
  springConfig,
  animate,
  sortBars,
  ...rest
}: XYChartBarGroupProps<XScale, YScale, Datum>) {
  //   const {
  //     // colorScale,
  //     dataRegistry,
  //     horizontal,
  //     registerData,
  //     unregisterData,
  //     xScale,
  //     yScale
  //   } = useContext(DataContext);

  const {
    dataRegistry,
    horizontal,
    registerData,
    unregisterData,
    xScale,
    yScale,
    colorScale,
    springConfig: fallbackSpringConfig
  } = useContext(DataContext) as unknown as DataContextType<XScale, YScale, Datum>;

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

  // register all child data
  // This is because the contained BarSeries components are not actually rendered.
  // Instead they act as props containers.
  useEffect(() => {
    const dataToRegister = barSeriesChildren.map((child) => {
      const { dataKey: key, data, xAccessor, yAccessor } = child.props;
      return { key, data, xAccessor, yAccessor };
    });
    registerData?.(dataToRegister);
    return () => unregisterData?.(dataKeys);
  }, [registerData, unregisterData, barSeriesChildren, dataKeys]);

  // create group scale
  const groupScale = useMemo(
    () =>
      scaleBand<string>({
        domain: sortBars ? [...dataKeys].sort(sortBars) : dataKeys,
        range: [0, getScaleBandwidth(horizontal ? yScale! : xScale!)], // TODO fix use of '!'
        padding
      }),
    [sortBars, dataKeys, xScale, yScale, horizontal, padding]
  );

  const registryEntries = dataKeys.map((key) => dataRegistry.get(key));

  // if scales and data are not available in the registry, bail
  if (registryEntries.some((entry) => entry == null) || !xScale || !yScale || !colorScale) {
    return null;
  }

  return (
    <>
      {dataKeys.map((dataKey) => {
        const colorAccessor = barSeriesChildren.find((child) => child.props.dataKey === dataKey)?.props
          ?.colorAccessor;
        return (
          <BarGroupSeries
            key={dataKey}
            dataKey={dataKey}
            dataRegistry={dataRegistry}
            xScale={xScale}
            yScale={yScale}
            groupScale={groupScale}
            horizontal={horizontal ?? false}
            // renderingOffset?: number;
            animate={animate}
            springConfig={springConfig ?? fallbackSpringConfig}
            colorAccessor={colorAccessor}
            colorScale={colorScale}
          />
        );
      })}
    </>
  );

  //   const { springConfig: fallbackSpringConfig, horizontal, colorScale } = useContext(DataContext);
  //   const fallbackColorAccessor = useCallback(() => colorScale?.(dataKey) ?? '', [colorScale, dataKey]);
  //   return (
  //     <BarGroup
  //       {...rest}
  //       horizontal={horizontal ?? false}
  //       springConfig={springConfig ?? fallbackSpringConfig}
  //       dataKey={dataKey}
  //       colorAccessor={colorAccessor ?? fallbackColorAccessor}
  //     />
  //   );
}
