import { memo, SVGProps, useCallback, useContext } from 'react';
import { animated, SpringConfig } from 'react-spring';
import { AxisScale } from '@visx/axis';
import { Group } from '@visx/group';
import { CurveFactory, CurveFactoryLineOnly } from 'd3-shape';

import { useLineSeriesTransitions } from './animation';
import { DataContext } from './DataContext';
import { PositionScale, SeriesProps } from './types';
import { withRegisteredData, WithRegisteredDataProps } from './withRegisteredData';

export type LineSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = SeriesProps<XScale, YScale, Datum> & {
  curve?: CurveFactory | CurveFactoryLineOnly;
  colorAccessor?: (d: Datum, key: string) => string;
  size?: number | ((d: Datum) => number);
  groupClassName?: string;
  /** Props to apply to the <g> element containing the series. */
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
  // renderLine: (props: {
  //   size: SpringValue<number>;
  //   x: SpringValue<number>;
  //   y: SpringValue<number>;
  //   opacity: SpringValue<number>;
  //   fill?: string;
  //   datum: Datum;
  // }) => ReactNode;
  animate?: boolean;
  springConfig?: SpringConfig;
  horizontal: boolean;
  renderingOffset?: number;
};

export function LineSeries<XScale extends PositionScale, YScale extends PositionScale, Datum extends object>({
  curve,
  colorAccessor,
  size = 0,
  data,
  dataKey,
  xAccessor,
  yAccessor,
  xScale,
  yScale,
  groupClassName = '',
  groupProps = {},
  // renderLine,
  animate = true,
  springConfig,
  horizontal,
  renderingOffset
}: LineSeriesProps<XScale, YScale, Datum> & WithRegisteredDataProps<XScale, YScale, Datum>) {
  // const isDefined = useCallback(
  //   (d: Datum) => isValidNumber(xScale(xAccessor(d))) && isValidNumber(yScale(yAccessor(d))),
  //   [xScale, xAccessor, yScale, yAccessor]
  // );
  const transitions = useLineSeriesTransitions(
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
      {transitions(
        (styles, datum) => (
          <animated.path
            data-test-id="path"
            fill="none"
            // stroke={colorAccessor?.(datum, dataKey)}
            stroke="blue"
            role="presentation"
            d={styles.d}
            // className={className}
            // {...domainProps}
          />
        )

        // renderLine({ ...styles, datum, fill: colorAccessor?.(datum, dataKey) })
      )}
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
    ...rest
  }: Omit<LineSeriesProps<XScale, YScale, Datum>, 'horizontal' | 'colorAccessor'> &
    WithRegisteredDataProps<XScale, YScale, Datum>) {
    const { springConfig: fallbackSpringConfig, horizontal, colorScale } = useContext(DataContext);
    const colorAccessor = useCallback(() => colorScale?.(dataKey) ?? '', [colorScale, dataKey]);
    return (
      <LineSeries
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
    prevProps.yAccessor === nextProps.yAccessor
  // prevProps.colorAccessor === nextProps.colorAccessor
);

export const XYChartLineSeries = withRegisteredData(MemoizedXYChartLineSeriesInner);
