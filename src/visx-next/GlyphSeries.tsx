import { FocusEvent, memo, PointerEvent, ReactNode, SVGProps, useCallback, useContext } from 'react';
import { SpringConfig, SpringValue } from 'react-spring';
import { AxisScale } from '@visx/axis';
import { Group } from '@visx/group';

import { useGlyphSeriesTransitions } from './animation';
import { DataContext } from './DataContext';
import { GLYPHSERIES_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from './eventSources';
import { PositionScale, SeriesProps } from './types';
import { useSeriesEvents } from './useSeriesEvents';
import { withRegisteredData, WithRegisteredDataProps } from './withRegisteredData';

export type GlyphSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = SeriesProps<XScale, YScale, Datum> & {
  colorAccessor?: (d: Datum, key: string) => string;
  size?: number | ((d: Datum) => number);
  groupClassName?: string;
  /** Props to apply to the <g> element containing the series. */
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
  renderGlyph: (props: {
    size: SpringValue<number>;
    x: SpringValue<number>;
    y: SpringValue<number>;
    opacity: SpringValue<number>;
    fill?: string;
    datum: Datum;
    /** Callback to invoke for onBlur. */
    onBlur?: (event: FocusEvent) => void;
    /** Callback to invoke for onFocus. */
    onFocus?: (event: FocusEvent) => void;
    /** Callback to invoke for onPointerMove. */
    onPointerMove?: (event: PointerEvent) => void;
    /** Callback to invoke for onPointerOut. */
    onPointerOut?: (event: PointerEvent) => void;
    /** Callback to invoke for onPointerUp. */
    onPointerUp?: (event: PointerEvent) => void;
  }) => ReactNode;
  animate?: boolean;
  springConfig?: SpringConfig;
  horizontal: boolean;
  renderingOffset?: number;
};

export function GlyphSeries<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>({
  colorAccessor,
  size = 0,
  data,
  dataKey,
  keyAccessor,
  xAccessor,
  yAccessor,
  xScale,
  yScale,
  groupClassName = '',
  groupProps = {},
  renderGlyph,
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
}: GlyphSeriesProps<XScale, YScale, Datum> & WithRegisteredDataProps<XScale, YScale, Datum>) {
  const ownEventSourceKey = `${GLYPHSERIES_EVENT_SOURCE}-${dataKey}`;
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
  const transitions = useGlyphSeriesTransitions(
    data,
    xScale,
    yScale,
    keyAccessor,
    xAccessor,
    yAccessor,
    horizontal,
    size,
    springConfig,
    animate,
    renderingOffset
  );
  return (
    <Group data-test-id="glyph-series" {...groupProps} className={groupClassName}>
      {transitions((styles, datum) =>
        renderGlyph({ ...styles, datum, fill: colorAccessor?.(datum, dataKey), ...eventEmitters })
      )}
    </Group>
  );
}

const MemoizedXYChartGlyphSeriesInner = memo(
  function XYChartGlyphSeriesInner<
    XScale extends PositionScale,
    YScale extends PositionScale,
    Datum extends object
  >({
    colorAccessor,
    springConfig,
    dataKey,
    ...rest
  }: Omit<GlyphSeriesProps<XScale, YScale, Datum>, 'horizontal'> &
    WithRegisteredDataProps<XScale, YScale, Datum>) {
    const { springConfig: fallbackSpringConfig, horizontal, colorScale } = useContext(DataContext);
    const fallbackColorAccessor = useCallback(() => colorScale?.(dataKey) ?? '', [colorScale, dataKey]);
    return (
      <GlyphSeries
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

export const XYChartGlyphSeries = withRegisteredData(MemoizedXYChartGlyphSeriesInner);
