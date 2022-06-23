import { JSXElementConstructor, ReactElement, SVGProps, useContext } from 'react';
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

type BarStackSeriesProps<XScale extends PositionScale, YScale extends PositionScale, Datum extends object> = {
  dataKey: string;
  data: readonly SeriesPoint<CombinedStackData<XScale, YScale, Datum>>[];
  dataKeys: readonly string[];
  xScale: XScale;
  yScale: YScale;
  xAccessor: (d: SeriesPoint<CombinedStackData<XScale, YScale, Datum>>) => ScaleInput<XScale>;
  yAccessor: (d: SeriesPoint<CombinedStackData<XScale, YScale, Datum>>) => ScaleInput<YScale>;
  horizontal: boolean;
  renderingOffset?: number;
  animate?: boolean;
  colorAccessor?: (d: Datum, key: string) => string;
  springConfig?: SpringConfig;
  colorScale?: ScaleOrdinal<string, string, never>;
  barClassName?: string;
  barProps?:
    | Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'ref'>
    | ((
        datum: Datum,
        index: number,
        dataKey: string
      ) => Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'ref'>);
};

function BarStackSeries<XScale extends PositionScale, YScale extends PositionScale, Datum extends object>({
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
  colorScale,
  barClassName = '',
  barProps = {}
}: BarStackSeriesProps<XScale, YScale, Datum>) {
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
        const internalDatum = datum.data.__datum__;
        const { style, ...restBarProps } =
          typeof barProps === 'function' ? barProps(internalDatum, index, dataKey) : barProps;
        return (
          <animated.rect
            data-test-id="bar"
            x={x}
            y={y}
            width={width}
            height={height}
            fill={colorAccessor?.(internalDatum, dataKey) ?? colorScale?.(dataKey) ?? 'gray'}
            style={{ ...style, opacity }}
            className={barClassName}
            {...restBarProps}
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
    DataRegistry<XScale, YScale, SeriesPoint<CombinedStackData<XScale, YScale, Datum>>, Datum>,
    'registry' | 'registryKeys'
  >;
  xScale: XScale;
  yScale: YScale;
  horizontal: boolean;
  renderingOffset?: number;
  animate?: boolean;
  springConfig?: SpringConfig;
  colorScale?: ScaleOrdinal<string, string, never>;
  seriesChildren: ReactElement<BarSeriesProps<XScale, YScale, Datum>, string | JSXElementConstructor<any>>[];
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
  springConfig,
  colorScale,
  seriesChildren
}: XYChartBarStackSeriesProps<XScale, YScale, Datum>) {
  const transitions = useSeriesTransitions(
    dataKeys.map((dataKey) => dataRegistry.get(dataKey)),
    springConfig,
    animate
  );
  return (
    <>
      {transitions((styles, datum) => {
        const child = seriesChildren.find((child) => child.props.dataKey === datum.key);
        const { barProps, barClassName, groupProps, groupClassName, renderingOffset } = child?.props ?? {};
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
              xScale={xScale}
              yScale={yScale}
              xAccessor={datum.xAccessor}
              yAccessor={datum.yAccessor}
              horizontal={horizontal ?? false}
              renderingOffset={renderingOffset}
              animate={animate}
              springConfig={springConfig}
              colorAccessor={datum.colorAccessor}
              colorScale={colorScale}
              barProps={barProps}
              barClassName={barClassName}
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
  springConfig?: SpringConfig;
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
  } = useContext(DataContext) as unknown as DataContextType<
    XScale,
    YScale,
    BarStackDatum<XScale, YScale, Datum>,
    Datum
  >;

  const { seriesChildren, groupKeys, stackedData } = useStackedData<
    XScale,
    YScale,
    Datum,
    BarSeriesProps<XScale, YScale, Datum>
  >({
    children,
    stackOrder,
    stackOffset
  });

  // const previousGroupKeys = useRef<string[]>([]);
  // useEffect(() => {
  //   previousGroupKeys.current = groupKeys;
  // }, [groupKeys]);

  // if scales and data are not available in the registry, bail
  if (!stackedData || !xScale || !yScale || !colorScale) {
    return null;
  }

  return (
    <XYChartBarStackSeries
      dataKeys={groupKeys}
      dataRegistry={dataRegistry}
      seriesChildren={seriesChildren}
      xScale={xScale}
      yScale={yScale}
      colorScale={colorScale}
      horizontal={horizontal}
      springConfig={springConfig ?? fallbackSpringConfig}
      animate={animate}
      // Feels better to only animate the chart if the stack keys are the same.
      // animate={
      //   (isEmpty(previousGroupKeys.current) || isEqual(previousGroupKeys.current, groupKeys)) && animate
      // }
    />
  );
}
