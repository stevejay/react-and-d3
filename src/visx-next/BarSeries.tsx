import { SVGProps, useContext } from 'react';
import { animated, SpringConfig } from 'react-spring';
import { AxisScale } from '@visx/axis';
import { Group } from '@visx/group';

import { useBarTransitions } from './animation';
import { DataContext } from './DataContext';
import { SeriesProps } from './types';
import { withRegisteredData, WithRegisteredDataProps } from './withRegisteredData';

export type BarSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = SeriesProps<XScale, YScale, Datum> & {
  // /**
  //  * Specify bar padding when bar thickness does not come from a `band` scale.
  //  * Accepted values are [0, 1], 0 = no padding, 1 = no bar, defaults to 0.1.
  //  */
  // barPadding?: number;
  /** Given a Datum, returns its color. Falls back to theme color if unspecified or if a null-ish value is returned. */
  colorAccessor?: (d: Datum) => string | null | undefined;
  /** Given a Datum, return its key. */
  // keyAccessor: (d: Datum) => Key;
  groupClassName?: string;
  /** Props to apply to the <g> element containing the series. */
  groupProps?: SVGProps<SVGGElement>;
  barClassName?: string;
  barProps?:
    | Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'ref'>
    | ((datum: Datum) => Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'ref'>);
  animate?: boolean;
  /* A react-spring configuration object */
  springConfig?: SpringConfig;
  horizontal: boolean;
  offset?: number;
};

function BarSeries<XScale extends AxisScale, YScale extends AxisScale, Datum extends object>({
  // barPadding = 0.1,
  colorAccessor,
  data,
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
  offset
}: BarSeriesProps<XScale, YScale, Datum> & WithRegisteredDataProps<XScale, YScale, Datum>) {
  const transitions = useBarTransitions(
    data,
    xScale,
    yScale,
    xAccessor,
    yAccessor,
    horizontal,
    0,
    springConfig,
    animate,
    offset
  );
  return (
    <Group {...groupProps} className={groupClassName}>
      {transitions(({ opacity, x, y, width, height }, datum) => {
        const { style, ...restBarProps } = typeof barProps === 'function' ? barProps(datum) : barProps;
        return (
          <animated.rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={colorAccessor?.(datum) ?? restBarProps.fill}
            style={{ ...style, opacity }}
            role="presentation"
            aria-hidden
            className={barClassName}
            {...restBarProps}
          />
        );
      })}
    </Group>
  );
}

function XYChartBarSeriesInner<XScale extends AxisScale, YScale extends AxisScale, Datum extends object>(
  props: Omit<BarSeriesProps<XScale, YScale, Datum>, 'horizontal'> &
    WithRegisteredDataProps<XScale, YScale, Datum>
) {
  const { springConfig: fallbackSpringConfig, horizontal } = useContext(DataContext);
  return (
    <BarSeries
      {...props}
      horizontal={horizontal ?? false}
      springConfig={props.springConfig ?? fallbackSpringConfig}
    />
  );
}

export const XYChartBarSeries = withRegisteredData(XYChartBarSeriesInner);
