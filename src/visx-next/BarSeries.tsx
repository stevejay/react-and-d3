import { memo, SVGProps, useCallback, useContext } from 'react';
import { animated, SpringConfig } from 'react-spring';
import { AxisScale } from '@visx/axis';
import { Group } from '@visx/group';

import { useBarSeriesTransitions } from './animation';
import { DataContext } from './DataContext';
import { BARSERIES_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from './eventSources';
import { PositionScale, SeriesProps } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { withRegisteredData, WithRegisteredDataProps } from './withRegisteredData';

export type BarSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = SeriesProps<XScale, YScale, Datum> & {
  /** Given a Datum, returns its color. */
  colorAccessor?: (d: Datum, key: string) => string;
  /** Given a Datum, return its key. */
  // keyAccessor: (d: Datum) => Key;
  groupClassName?: string;
  /** Props to apply to the <g> element containing the series. */
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
  barClassName?: string;
  barProps?:
    | Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'ref'>
    | ((
        datum: Datum,
        index: number,
        dataKey: string
      ) => Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'ref'>);
  animate?: boolean;
  springConfig?: SpringConfig;
  horizontal: boolean;
  renderingOffset?: number;
};

export function BarSeries<XScale extends PositionScale, YScale extends PositionScale, Datum extends object>({
  colorAccessor,
  data,
  dataKey,
  keyAccessor,
  xAccessor,
  yAccessor,
  xScale,
  yScale,
  groupClassName = '',
  groupProps = {},
  barClassName = '',
  barProps = {},
  animate = true,
  springConfig,
  horizontal,
  renderingOffset,
  onBlur,
  onFocus,
  onPointerMove,
  onPointerOut,
  onPointerUp,
  enableEvents = true
}: BarSeriesProps<XScale, YScale, Datum> & WithRegisteredDataProps<XScale, YScale, Datum>) {
  const ownEventSourceKey = `${BARSERIES_EVENT_SOURCE}-${dataKey}`;
  const eventEmitters = useSeriesEvents<XScale, YScale, Datum>({
    dataKey,
    enableEvents,
    onBlur,
    onFocus,
    onPointerMove,
    onPointerOut,
    onPointerUp,
    source: ownEventSourceKey,
    allowedSources: [XYCHART_EVENT_SOURCE, ownEventSourceKey]
  });
  const transitions = useBarSeriesTransitions(
    data,
    xScale,
    yScale,
    keyAccessor,
    xAccessor,
    yAccessor,
    horizontal,
    springConfig,
    animate,
    renderingOffset
  );
  return (
    <Group data-testid="bar-series" {...groupProps} className={groupClassName}>
      {transitions(({ opacity, x, y, width, height }, datum, _, index) => {
        const { style, ...restBarProps } =
          typeof barProps === 'function' ? barProps(datum, index, dataKey) : barProps;
        return (
          <animated.rect
            data-testid="bar"
            x={x}
            y={y}
            width={width}
            height={height}
            fill={colorAccessor?.(datum, dataKey) ?? restBarProps.fill}
            style={{ ...style, opacity }}
            className={barClassName}
            {...restBarProps}
            {...eventEmitters}
          />
        );
      })}
    </Group>
  );
}

const MemoizedXYChartBarSeriesInner = memo(
  function XYChartBarSeriesInner<
    XScale extends PositionScale,
    YScale extends PositionScale,
    Datum extends object
  >({
    colorAccessor,
    springConfig,
    dataKey,
    ...rest
  }: Omit<BarSeriesProps<XScale, YScale, Datum>, 'horizontal'> &
    WithRegisteredDataProps<XScale, YScale, Datum> &
    Pick<
      SeriesProps<XScale, YScale, Datum>,
      'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onBlur' | 'onFocus' | 'enableEvents'
    >) {
    const { springConfig: fallbackSpringConfig, horizontal, colorScale } = useContext(DataContext);
    const fallbackColorAccessor = useCallback(() => colorScale?.(dataKey) ?? '', [colorScale, dataKey]);
    return (
      <BarSeries
        {...rest}
        horizontal={horizontal ?? false}
        springConfig={springConfig ?? fallbackSpringConfig}
        dataKey={dataKey}
        colorAccessor={colorAccessor ?? fallbackColorAccessor}
      />
    );
  },
  // TODO remove memoization
  (prevProps, nextProps) =>
    prevProps.xScale === nextProps.xScale &&
    prevProps.yScale === nextProps.yScale &&
    prevProps.data === nextProps.data &&
    prevProps.xAccessor === nextProps.xAccessor &&
    prevProps.yAccessor === nextProps.yAccessor &&
    prevProps.colorAccessor === nextProps.colorAccessor &&
    prevProps.keyAccessor === nextProps.keyAccessor
);

export const XYChartBarSeries = withRegisteredData(MemoizedXYChartBarSeriesInner);
