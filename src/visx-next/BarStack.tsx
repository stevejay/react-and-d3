import { JSXElementConstructor, ReactElement, SVGProps, useCallback, useContext } from 'react';
import { animated, SpringConfig } from 'react-spring';
import { ScaleOrdinal } from 'd3-scale';
import { SeriesPoint } from 'd3-shape';

import { useBarStackTransitions, useSeriesTransitions } from './animation';
import { BarSeriesProps } from './BarSeries';
import { DataContext } from './DataContext';
import { DataRegistry } from './DataRegistry';
import { BARSTACK_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from './eventSources';
import findNearestStackDatum from './findNearestStackDatum';
import { ScaleInput } from './scale';
import {
  BarStackDatum,
  DataContextType,
  NearestDatumArgs,
  NearestDatumReturnType,
  PositionScale,
  SeriesProps,
  StackDataWithSums,
  StackPathConfig
} from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { useStackedData } from './useStackedData';

type BarStackSeriesProps<XScale extends PositionScale, YScale extends PositionScale, Datum extends object> = {
  dataKey: string;
  data: readonly SeriesPoint<StackDataWithSums<XScale, YScale, Datum>>[];
  dataKeys: readonly string[];
  xScale: XScale;
  yScale: YScale;
  keyAccessor: (d: Datum) => string; // TODO should be like colorAccessor
  xAccessor: (d: SeriesPoint<StackDataWithSums<XScale, YScale, Datum>>) => ScaleInput<XScale>;
  yAccessor: (d: SeriesPoint<StackDataWithSums<XScale, YScale, Datum>>) => ScaleInput<YScale>;
  horizontal: boolean;
  renderingOffset?: number;
  animate?: boolean;
  colorAccessor?: (d: Datum, dataKey: string) => string;
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
} & Pick<SVGProps<SVGRectElement>, 'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onFocus' | 'onBlur'>;

function BarStackSeries<XScale extends PositionScale, YScale extends PositionScale, Datum extends object>({
  dataKey,
  dataKeys,
  data,
  xScale,
  yScale,
  keyAccessor,
  xAccessor,
  yAccessor,
  horizontal,
  renderingOffset,
  springConfig,
  animate = true,
  colorAccessor,
  colorScale,
  barClassName = '',
  barProps = {},
  ...events
}: BarStackSeriesProps<XScale, YScale, Datum>) {
  const transitions = useBarStackTransitions(
    data,
    dataKeys,
    xScale,
    yScale,
    dataKey,
    keyAccessor,
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
            data-testid="bar"
            x={x}
            y={y}
            width={width}
            height={height}
            fill={colorAccessor?.(internalDatum, dataKey) ?? colorScale?.(dataKey) ?? 'gray'}
            style={{ ...style, opacity }}
            className={barClassName}
            {...restBarProps}
            {...events}
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
    DataRegistry<XScale, YScale, SeriesPoint<StackDataWithSums<XScale, YScale, Datum>>, Datum>,
    'registry' | 'registryKeys'
  >;
  xScale: XScale;
  yScale: YScale;
  horizontal: boolean;
  renderingOffset?: number;
  animate?: boolean;
  springConfig?: SpringConfig;
  colorScale?: ScaleOrdinal<string, string, never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  seriesChildren: ReactElement<BarSeriesProps<XScale, YScale, Datum>, string | JSXElementConstructor<any>>[];
} & Pick<SVGProps<SVGRectElement>, 'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onFocus' | 'onBlur'>;

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
  animate,
  springConfig,
  colorScale,
  seriesChildren,
  ...events
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
            data-testid="bar-series"
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
              keyAccessor={datum.keyAccessor}
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
              {...events}
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
} & Pick<StackPathConfig<Datum, string>, 'stackOffset' | 'stackOrder'> &
  Pick<
    SeriesProps<XScale, YScale, Datum>,
    'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onBlur' | 'onFocus' | 'enableEvents'
  >;

export function SvgXYChartBarStack<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>({
  children,
  stackOrder,
  stackOffset,
  animate = true,
  springConfig,
  onBlur,
  onFocus,
  onPointerMove,
  onPointerOut,
  onPointerUp,
  enableEvents = true
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
    Datum
    // BarSeriesProps<XScale, YScale, Datum>
  >({
    children,
    stackOrder,
    stackOffset
  });

  // custom logic to find the nearest AreaStackDatum (context) and return the original Datum (props)
  const findNearestDatum = useCallback(
    (
      params: NearestDatumArgs<XScale, YScale, BarStackDatum<XScale, YScale, Datum>>
    ): NearestDatumReturnType<Datum> => {
      // const childProps = seriesChildren.find((child) => child.props.dataKey === params.dataKey)?.props;
      // if (!childProps) {
      //   return null;
      // }
      // const { data: childData, xAccessor, yAccessor } = childProps;
      // const datum = findNearestStackDatum(params, childData, horizontal);
      // return datum ? ({ ...datum, xAccessor, yAccessor } as any) : null;

      const childData = seriesChildren.find((child) => child.props.dataKey === params.dataKey)?.props?.data;
      return childData ? findNearestStackDatum(params, childData, horizontal) : null;
    },
    [seriesChildren, horizontal]
  );

  const ownEventSourceKey = `${BARSTACK_EVENT_SOURCE}-${groupKeys.join('-')}`;
  const eventEmitters = useSeriesEvents<XScale, YScale, Datum>({
    dataKey: groupKeys, // POINTER_EVENTS_NEAREST,
    enableEvents,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Datum input + return type are expected to be the same type but they differ for BarStack (registry data is StackedDatum, return type is user Datum)
    findNearestDatum,
    onBlur,
    onFocus,
    onPointerMove,
    onPointerOut,
    onPointerUp,
    source: ownEventSourceKey,
    allowedSources: [XYCHART_EVENT_SOURCE, ownEventSourceKey]
  });

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
      {...eventEmitters}
      // Feels better to only animate the chart if the stack keys are the same.
      // animate={
      //   (isEmpty(previousGroupKeys.current) || isEqual(previousGroupKeys.current, groupKeys)) && animate
      // }
    />
  );
}
