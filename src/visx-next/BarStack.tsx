import { ReactElement, useContext } from 'react';
import { animated, SpringConfig } from 'react-spring';
import { Group } from '@visx/group';
import { ScaleOrdinal } from 'd3-scale';
import { Series, SeriesPoint } from 'd3-shape';

import { useBarStackTransitions } from './animation/useBarStackTransitions';
import { BarSeriesProps } from './BarSeries';
import { DataContext } from './DataContext';
import { DataRegistry } from './DataRegistry';
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
  data: Series<CombinedStackData<XScale, YScale>, string>;
  dataRegistry: Omit<
    DataRegistry<XScale, YScale, SeriesPoint<CombinedStackData<XScale, YScale>>>,
    'registry' | 'registryKeys'
  >;
  xScale: XScale;
  yScale: YScale;
  // groupScale: ScaleBand<string>;
  horizontal: boolean;
  renderingOffset?: number;
  animate?: boolean;
  colorAccessor?: (
    d: SeriesPoint<CombinedStackData<XScale, YScale>>,
    index?: number | undefined
  ) => string | null | undefined;
  /* A react-spring configuration object */
  springConfig?: SpringConfig;
  colorScale?: ScaleOrdinal<string, string, never>;
};

function BarStackSeries<XScale extends PositionScale, YScale extends PositionScale>({
  dataKey,
  data,
  dataRegistry,
  xScale,
  yScale,
  horizontal,
  renderingOffset,
  springConfig,
  animate = true,
  colorAccessor,
  colorScale
}: BarStackSeriesProps<XScale, YScale>) {
  // const registryEntry = dataRegistry?.get(dataKey);

  const transitions = useBarStackTransitions(
    data,
    xScale,
    yScale,
    dataKey,
    dataRegistry,
    horizontal,
    springConfig,
    animate,
    renderingOffset
  );
  // const transitions = useBarGroupTransitions(
  //   registryEntry.data,
  //   xScale,
  //   yScale,
  //   groupScale,
  //   dataKey,
  //   dataRegistry,
  //   // keyAccessor: (datum: Datum) => Key,
  //   horizontal,
  //   //   fallbackBandwidth: number,
  //   springConfig,
  //   animate,
  //   renderingOffset
  // );
  return (
    <Group data-test-id="bar-stack-series" data-series-id={dataKey}>
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

type BarStackChildProps<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
> = Omit<SeriesProps<XScale, YScale, Datum>, 'BarsComponent'>; // TODO SeriesProps might be wrong; maybe also add BarSeriesProps?

export type BaseBarStackProps<
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

function BaseBarStack<XScale extends PositionScale, YScale extends PositionScale, Datum extends object>({
  children,
  stackOrder,
  stackOffset,
  animate,
  springConfig
}: //   BarsComponent
//   onBlur,
//   onFocus,
//   onPointerMove,
//   onPointerOut,
//   onPointerUp,
//   enableEvents = true,
BaseBarStackProps<XScale, YScale, Datum>) {
  // type StackBar = SeriesPoint<CombinedStackData<XScale, YScale>>;

  const {
    colorScale,
    dataRegistry,
    horizontal,
    xScale,
    yScale,
    springConfig: fallbackSpringConfig
  } = useContext(DataContext) as unknown as DataContextType<XScale, YScale, BarStackDatum<XScale, YScale>>;

  // seriesChildren = used to find the color accessor
  const { seriesChildren, dataKeys, stackedData } = useStackedData<
    XScale,
    YScale,
    Datum,
    BarSeriesProps<XScale, YScale, Datum>
  >({
    children,
    stackOrder,
    stackOffset
  });

  //   // custom logic to find the nearest AreaStackDatum (context) and return the original Datum (props)
  //   const findNearestDatum = useCallback(
  //     (
  //       params: NearestDatumArgs<XScale, YScale, BarStackDatum<XScale, YScale>>
  //     ): NearestDatumReturnType<Datum> => {
  //       const childData = seriesChildren.find((child) => child.props.dataKey === params.dataKey)?.props?.data;
  //       return childData ? findNearestStackDatum(params, childData, horizontal) : null;
  //     },
  //     [seriesChildren, horizontal]
  //   );

  //   const ownEventSourceKey = `${BARSTACK_EVENT_SOURCE}-${dataKeys.join('-')}`;
  //   const eventEmitters = useSeriesEvents<XScale, YScale, Datum>({
  //     dataKey: dataKeys,
  //     enableEvents,
  //     // @ts-ignore Datum input + return type are expected to be the same type but they differ for BarStack (registry data is StackedDatum, return type is user Datum)
  //     findNearestDatum,
  //     onBlur,
  //     onFocus,
  //     onPointerMove,
  //     onPointerOut,
  //     onPointerUp,
  //     source: ownEventSourceKey,
  //     allowedSources: [XYCHART_EVENT_SOURCE, ownEventSourceKey]
  //   });

  // if scales and data are not available in the registry, bail
  if (dataKeys.some((key) => dataRegistry.get(key) == null) || !xScale || !yScale || !colorScale) {
    return null;
  }

  return (
    <>
      {dataKeys.map((dataKey) => {
        const data = stackedData.find((x) => x.key === dataKey);
        if (!data) {
          return null;
        }
        const colorAccessor = seriesChildren.find((child) => child.props.dataKey === dataKey)?.props
          ?.colorAccessor;
        return (
          <BarStackSeries
            key={dataKey}
            data={data}
            dataKey={dataKey}
            dataRegistry={dataRegistry}
            xScale={xScale}
            yScale={yScale}
            // groupScale={groupScale}
            horizontal={horizontal ?? false}
            // renderingOffset?: number;
            animate={animate}
            springConfig={springConfig ?? fallbackSpringConfig}
            colorAccessor={colorAccessor as any} // TODO fix.
            colorScale={colorScale}
          />
        );
      })}
    </>
  );

  // const barThickness = getScaleBandwidth(horizontal ? yScale : xScale);
  // const halfBarThickness = barThickness / 2;

  // let getWidth: (bar: StackBar) => number | undefined;
  // let getHeight: (bar: StackBar) => number | undefined;
  // let getX: (bar: StackBar) => number | undefined;
  // let getY: (bar: StackBar) => number | undefined;

  // if (horizontal) {
  //   getWidth = (bar) => (xScale(getSecondItem(bar)) ?? NaN) - (xScale(getFirstItem(bar)) ?? NaN);
  //   getHeight = () => barThickness;
  //   getX = (bar) => xScale(getFirstItem(bar));
  //   getY = (bar) =>
  //     'bandwidth' in yScale
  //       ? yScale(getStackValue(bar.data))
  //       : Math.max((yScale(getStackValue(bar.data)) ?? NaN) - halfBarThickness);
  // } else {
  //   getWidth = () => barThickness;
  //   getHeight = (bar) => (yScale(getFirstItem(bar)) ?? NaN) - (yScale(getSecondItem(bar)) ?? NaN);
  //   getX = (bar) =>
  //     'bandwidth' in xScale
  //       ? xScale(getStackValue(bar.data))
  //       : Math.max((xScale(getStackValue(bar.data)) ?? NaN) - halfBarThickness);
  //   getY = (bar) => yScale(getSecondItem(bar));
  // }

  // const bars = stackedData
  //   .flatMap((barStack, stackIndex) => {
  //     const entry = dataRegistry.get(barStack.key);
  //     if (!entry) {
  //       return null;
  //     }

  //     // get colorAccessor from child BarSeries, if available
  //     const barSeries: ReactElement<BarSeriesProps<XScale, YScale, Datum>> | undefined = seriesChildren.find(
  //       (child) => child.props.dataKey === barStack.key
  //     );
  //     const colorAccessor = barSeries?.props?.colorAccessor;

  //     return barStack.map((bar, index) => {
  //       const barX = getX(bar);
  //       if (!isValidNumber(barX)) {
  //         return null;
  //       }

  //       const barY = getY(bar);
  //       if (!isValidNumber(barY)) {
  //         return null;
  //       }

  //       const barWidth = getWidth(bar);
  //       if (!isValidNumber(barWidth)) {
  //         return null;
  //       }

  //       const barHeight = getHeight(bar);
  //       if (!isValidNumber(barHeight)) {
  //         return null;
  //       }

  //       const barSeriesDatum = colorAccessor ? barSeries?.props?.data[index] : null;

  //       return {
  //         key: `${stackIndex}-${barStack.key}-${index}`,
  //         x: barX,
  //         y: barY,
  //         width: barWidth,
  //         height: barHeight,
  //         fill:
  //           barSeriesDatum && colorAccessor ? colorAccessor(barSeriesDatum, index) : colorScale(barStack.key)
  //       };
  //     });
  //   })
  //   .filter((bar) => bar) as Bar[];

  // return (
  //   <g className="bar-stack">
  //     <BarsComponent
  //       bars={bars}
  //       horizontal={horizontal}
  //       xScale={xScale}
  //       yScale={yScale}
  //       //    {...eventEmitters}
  //     />
  //   </g>
  // );
}

export function SvgXYChartBarStack<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>(props: Omit<BaseBarStackProps<XScale, YScale, Datum>, 'BarsComponent'>) {
  return <BaseBarStack<XScale, YScale, Datum> {...props} />;
}
