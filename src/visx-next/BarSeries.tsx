import { Key, SVGProps, useContext } from 'react';
import { animated } from 'react-spring';
import { AxisScale } from '@visx/axis';

import { useBarTransitions } from './animation';
import { defaultSpringConfig } from './constants';
import { DataContext } from './DataContext';
import { SeriesProps } from './types';
import { withRegisteredData, WithRegisteredDataProps } from './withRegisteredData';

export type BarSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = SeriesProps<XScale, YScale, Datum> & {
  /**
   * Specify bar padding when bar thickness does not come from a `band` scale.
   * Accepted values are [0, 1], 0 = no padding, 1 = no bar, defaults to 0.1.
   */
  barPadding?: number;
  // /** Given a Datum, returns its color. Falls back to theme color if unspecified or if a null-ish value is returned. */
  colorAccessor?: (d: Datum) => string | null | undefined;
  // /** Given a Datum, return its key. */
  keyAccessor: (d: Datum) => Key;
  /** Props to apply to the <g> element containing the series. */
  groupProps?: SVGProps<SVGGElement>;
  getBarProps?: (
    datum: Datum
  ) => Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'ref' | 'fill'>;
};

// Fallback bandwidth estimate assumes no missing data values (divides chart space by # datum)
const getFallbackBandwidth = (fullBarWidth: number, barPadding: number) =>
  // clamp padding to [0, 1], bar thickness = (1-padding) * availableSpace
  fullBarWidth * (1 - Math.min(1, Math.max(0, barPadding)));

function BarSeries<XScale extends AxisScale, YScale extends AxisScale, Datum extends object>({
  barPadding = 0.1,
  colorAccessor,
  keyAccessor,
  data,
  // dataKey,
  xAccessor,
  xScale,
  yAccessor,
  yScale,
  groupProps,
  getBarProps
}: BarSeriesProps<XScale, YScale, Datum> & WithRegisteredDataProps<XScale, YScale, Datum>) {
  const { horizontal, innerWidth = 0, innerHeight = 0 } = useContext(DataContext);
  const fallbackBandwidth = getFallbackBandwidth(
    (horizontal ? innerHeight : innerWidth) / data.length,
    barPadding
  );

  const transitions = useBarTransitions(
    data,
    xScale,
    yScale,
    xAccessor,
    yAccessor,
    keyAccessor,
    horizontal ?? false,
    fallbackBandwidth,
    defaultSpringConfig, // TODO fix
    true // TODO fix
  );

  return (
    <g {...groupProps}>
      {transitions(({ opacity, x, y, width, height }, datum) => {
        const { style, ...restBarProps } = getBarProps?.(datum) ?? {};

        // TODO make this rect component configurable?
        return (
          <animated.rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{ ...style, opacity }}
            // className="visx-bar"
            // tabIndex={isFocusable ? 0 : undefined}
            // key={keyAccessor?.(bar!.datum, index) ?? `${index}`}
            fill={colorAccessor?.(datum) ?? undefined}
            // role="presentation"
            {...restBarProps}
          />
        );
      })}
    </g>
  );
}

export default withRegisteredData(BarSeries);
