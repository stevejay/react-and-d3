import { JSXElementConstructor, ReactElement, useContext } from 'react';
import { animated, SpringConfig } from 'react-spring';
import { ScaleOrdinal } from 'd3-scale';
import { SeriesPoint } from 'd3-shape';

import { useBarStackTransitions, useSeriesTransitions } from './animation';
import { BarSeriesProps } from './BarSeries';
import { DataContext } from './DataContext';
import { DataRegistry } from './DataRegistry';
import { ScaleInput } from './scale';
import {
  BarStackDatum,
  CombinedStackData,
  DataContextType,
  PositionScale,
  SeriesProps,
  StackPathConfig
} from './types';
import { useStackedData } from './useStackedData';

type BarStackSeriesProps<XScale extends PositionScale, YScale extends PositionScale> = {
  dataKey: string;
  data: readonly SeriesPoint<CombinedStackData<XScale, YScale>>[];
  dataKeys: readonly string[];
  xScale: XScale;
  yScale: YScale;
  xAccessor: (d: SeriesPoint<CombinedStackData<XScale, YScale>>) => ScaleInput<XScale>;
  yAccessor: (d: SeriesPoint<CombinedStackData<XScale, YScale>>) => ScaleInput<YScale>;
  horizontal: boolean;
  renderingOffset?: number;
  animate?: boolean;
  colorAccessor?: (
    d: SeriesPoint<CombinedStackData<XScale, YScale>>,
    index?: number | undefined
  ) => string | null | undefined;
  springConfig?: SpringConfig;
  colorScale?: ScaleOrdinal<string, string, never>;
};

function BarStackSeries<XScale extends PositionScale, YScale extends PositionScale>({
  dataKey,
  dataKeys,
  data,
  xScale,
  yScale,
  xAccessor,
  yAccessor,
  horizontal,
  renderingOffset,
  springConfig,
  animate = true,
  colorAccessor,
  colorScale
}: BarStackSeriesProps<XScale, YScale>) {
  const transitions = useBarStackTransitions(
    data,
    dataKeys,
    xScale,
    yScale,
    dataKey,
    xAccessor,
    yAccessor,
    horizontal,
    springConfig,
    animate,
    renderingOffset
  );
  return (
    <>
      {transitions(({ opacity, x, y, width, height }, datum, _, index) => {
        return (
          <animated.rect
            data-test-id="bar"
            x={x}
            y={y}
            width={width}
            height={height}
            fill={colorAccessor?.(datum, index) ?? colorScale?.(dataKey) ?? 'gray'}
            style={{ opacity }}
            // role="presentation"
            // aria-hidden
            // className={barClassName}
            // {...restBarProps}
          />
        );
      })}
    </>
  );
}

type XYChartBarStackSeriesProps<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
> = {
  dataKeys: readonly string[];
  dataRegistry: Omit<
    DataRegistry<XScale, YScale, SeriesPoint<CombinedStackData<XScale, YScale>>>,
    'registry' | 'registryKeys'
  >;
  xScale: XScale;
  yScale: YScale;
  horizontal: boolean;
  renderingOffset?: number;
  animate?: boolean;
  // colorAccessor?: (
  //   d: SeriesPoint<CombinedStackData<XScale, YScale>>,
  //   index?: number | undefined
  // ) => string | null | undefined;
  /* A react-spring configuration object */
  springConfig?: SpringConfig;
  colorScale?: ScaleOrdinal<string, string, never>;
  // barSeriesChildren: | ReactElement<BarStackChildProps<XScale, YScale, Datum>>
  barSeriesChildren: ReactElement<
    BarSeriesProps<XScale, YScale, Datum>,
    string | JSXElementConstructor<any>
  >[];
};

function XYChartBarStackSeries<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>({
  dataKeys,
  dataRegistry,
  xScale,
  yScale,
  horizontal,
  renderingOffset,
  animate,
  // colorAccessor,
  springConfig,
  colorScale,
  barSeriesChildren
}: XYChartBarStackSeriesProps<XScale, YScale, Datum>) {
  const transitions = useSeriesTransitions(
    dataKeys.map((dataKey) => dataRegistry.get(dataKey)),
    springConfig,
    animate
  );
  return (
    <>
      {transitions((styles, datum) => {
        // const data = stackedData.find((x) => x.key === datum.key);
        // if (!data) {
        //   return null;
        // }
        const child = barSeriesChildren.find((child) => child.props.dataKey === datum.key);
        const {
          // colorAccessor, barProps, barClassName,
          groupProps,
          groupClassName,
          renderingOffset
        } = child?.props ?? {};
        const { style, ...restGroupProps } = groupProps ?? {};
        return (
          <animated.g
            data-test-id="bar-series"
            {...restGroupProps}
            className={groupClassName}
            style={{ ...style, ...styles }}
          >
            <BarStackSeries
              dataKey={datum.key}
              dataKeys={dataKeys}
              data={datum.data}
              // dataKeys={dataKeys}
              xScale={xScale}
              yScale={yScale}
              xAccessor={datum.xAccessor}
              yAccessor={datum.yAccessor}
              horizontal={horizontal ?? false}
              renderingOffset={renderingOffset}
              animate={animate}
              springConfig={springConfig}
              // colorAccessor={colorAccessor} // TODO Fix
              colorScale={colorScale}
              // barProps={barProps}
              // barClassName={barClassName}
              // dataRegistry={dataRegistry}
            />
          </animated.g>
        );
      })}
    </>
  );
}

type BarStackChildProps<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
> = Omit<SeriesProps<XScale, YScale, Datum>, 'BarsComponent'>; // TODO SeriesProps might be wrong; maybe also add BarSeriesProps?

export type SvgXYChartBarStackProps<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
> = {
  /** `BarSeries` elements, note we can't strictly enforce this with TS yet. */
  children:
    | ReactElement<BarStackChildProps<XScale, YScale, Datum>>
    | ReactElement<BarStackChildProps<XScale, YScale, Datum>>[];
  animate?: boolean;
  /* A react-spring configuration object */
  springConfig?: SpringConfig;
  /** Rendered component which is passed BarsProps by BaseBarStack after processing. */
  //   BarsComponent: (props: Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'ref'>) => ReactNode;
} & Pick<StackPathConfig<Datum, string>, 'stackOffset' | 'stackOrder'>;
// &
//   Pick<
//     SeriesProps<XScale, YScale, Datum>,
//     'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onBlur' | 'onFocus' | 'enableEvents'
//   >;

export function SvgXYChartBarStack<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>({
  children,
  stackOrder,
  stackOffset,
  animate = true,
  springConfig
}: SvgXYChartBarStackProps<XScale, YScale, Datum>) {
  const {
    colorScale,
    dataRegistry,
    horizontal,
    xScale,
    yScale,
    springConfig: fallbackSpringConfig
  } = useContext(DataContext) as unknown as DataContextType<XScale, YScale, BarStackDatum<XScale, YScale>>;

  // seriesChildren = used to find the color accessor
  const {
    seriesChildren: barSeriesChildren,
    groupKeys,
    stackedData
  } = useStackedData<XScale, YScale, Datum, BarSeriesProps<XScale, YScale, Datum>>({
    children,
    stackOrder,
    stackOffset
  });

  // if scales and data are not available in the registry, bail
  if (!stackedData || !xScale || !yScale || !colorScale) {
    return null;
  }

  return (
    <XYChartBarStackSeries
      dataKeys={groupKeys}
      dataRegistry={dataRegistry}
      barSeriesChildren={barSeriesChildren}
      xScale={xScale}
      yScale={yScale}
      colorScale={colorScale}
      horizontal={horizontal}
      springConfig={springConfig ?? fallbackSpringConfig}
      animate={animate}
    />
  );
}
