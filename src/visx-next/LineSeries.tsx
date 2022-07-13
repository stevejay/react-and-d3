import { memo, SVGProps, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { animated, Spring, SpringConfig } from 'react-spring';
import { AxisScale } from '@visx/axis';
import { Group } from '@visx/group';
import { CurveFactory, CurveFactoryLineOnly } from 'd3-shape';
import { isNil } from 'lodash-es';

import { useLineSeriesTransitions } from './animation';
import { DataContext } from './DataContext';
import { LINESERIES_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from './eventSources';
import { createLineSeriesPositioning } from './positioning';
import { PositionScale, SeriesProps } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { withRegisteredData, WithRegisteredDataProps } from './withRegisteredData';

export type LineSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = SeriesProps<XScale, YScale, Datum> & {
  curve?: CurveFactory | CurveFactoryLineOnly;
  colorAccessor?: () => string;
  groupClassName?: string;
  /** Props to apply to the <g> element containing the series. */
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
  pathProps?: Omit<SVGProps<SVGPathElement>, 'ref'>;
  animate?: boolean;
  springConfig?: SpringConfig;
  horizontal: boolean;
  renderingOffset?: number;
};

export function LineSeries<XScale extends PositionScale, YScale extends PositionScale, Datum extends object>({
  curve,
  colorAccessor,
  data,
  dataKey,
  xAccessor,
  yAccessor,
  xScale,
  yScale,
  groupClassName = '',
  groupProps = {},
  pathProps = {},
  // renderLine,
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
}: LineSeriesProps<XScale, YScale, Datum> & WithRegisteredDataProps<XScale, YScale, Datum>) {
  const ownEventSourceKey = `${LINESERIES_EVENT_SOURCE}-${dataKey}`;
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
  const transition = useLineSeriesTransitions(
    data,
    xScale,
    yScale,
    xAccessor,
    yAccessor,
    horizontal,
    curve,
    springConfig,
    animate,
    renderingOffset
  );
  return (
    <Group data-test-id="line-series" {...groupProps} className={groupClassName}>
      <animated.path
        data-test-id="path"
        fill="none"
        stroke={colorAccessor?.()}
        role="presentation"
        d={transition}
        {...pathProps}
        {...eventEmitters}
      />
    </Group>
  );
}

// From https://github.com/flashblaze/flashblaze-website/blob/39c459c7664590d80eac7329b596a1cfee1beb9a/src/posts/2020-06-15-svg-animations-using-react-spring.mdx
function AnimatedPath({
  d,
  springConfig,
  colorAccessor,
  pathProps = {}
}: {
  d: string;
  animate?: boolean;
  springConfig?: SpringConfig;
  colorAccessor?: () => string;
  pathProps?: Omit<SVGProps<SVGPathElement>, 'ref'>;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [offset, setOffset] = useState<number | null>(null);

  useEffect(() => {
    setOffset(pathRef.current?.getTotalLength() ?? 0);
  }, [offset]);

  const { stroke, ...rest } = pathProps;

  return (
    <>
      {!isNil(offset) ? (
        <Spring from={{ x: offset }} to={{ x: 0 }} config={springConfig} immediate={!animated}>
          {(props) => (
            <animated.path
              ref={pathRef}
              d={d}
              strokeDashoffset={props.x}
              strokeDasharray={`${offset} ${offset}`}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round" // without this a datum surrounded by nulls will not be visible
              stroke={stroke ?? colorAccessor?.()}
              role="presentation"
              {...rest}
            />
          )}
        </Spring>
      ) : (
        <path ref={pathRef} strokeWidth="2" d={d} stroke="none" fill="none" {...rest} />
      )}
    </>
  );
}

export function CurtainLineSeries<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>({
  curve,
  colorAccessor,
  data,
  dataKey,
  xAccessor,
  yAccessor,
  xScale,
  yScale,
  groupClassName = '',
  groupProps = {},
  pathProps = {},
  // renderLine,
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
}: LineSeriesProps<XScale, YScale, Datum> & WithRegisteredDataProps<XScale, YScale, Datum>) {
  const ownEventSourceKey = `${LINESERIES_EVENT_SOURCE}-${dataKey}`;
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
  const path = createLineSeriesPositioning({
    xScale,
    yScale,
    xAccessor,
    yAccessor,
    horizontal,
    curve,
    renderingOffset
  });
  const pathD = path(data);
  return (
    <Group key={dataKey} data-test-id="line-series" {...groupProps} className={groupClassName}>
      <AnimatedPath
        key={pathD}
        d={pathD ?? ''}
        springConfig={springConfig}
        colorAccessor={colorAccessor}
        pathProps={pathProps}
        animate={animate}
        {...eventEmitters}
      />
    </Group>
  );
}

const MemoizedXYChartLineSeriesInner = memo(
  function XYChartLineSeriesInner<
    XScale extends PositionScale,
    YScale extends PositionScale,
    Datum extends object
  >({
    // colorAccessor,
    springConfig,
    dataKey,
    animationType = 'morph',
    ...rest
  }: Omit<LineSeriesProps<XScale, YScale, Datum>, 'horizontal' | 'colorAccessor'> &
    WithRegisteredDataProps<XScale, YScale, Datum> & { animationType?: 'morph' | 'dashoffset' }) {
    const { springConfig: fallbackSpringConfig, horizontal, colorScale } = useContext(DataContext);
    const colorAccessor = useCallback(() => colorScale?.(dataKey) ?? '', [colorScale, dataKey]);
    const Component = animationType === 'morph' ? LineSeries : CurtainLineSeries;
    return (
      <Component
        {...rest}
        horizontal={horizontal ?? false}
        springConfig={springConfig ?? fallbackSpringConfig}
        dataKey={dataKey}
        colorAccessor={colorAccessor}
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
    prevProps.keyAccessor === nextProps.keyAccessor
  // prevProps.colorAccessor === nextProps.colorAccessor
);

export const XYChartLineSeries = withRegisteredData(MemoizedXYChartLineSeriesInner);
