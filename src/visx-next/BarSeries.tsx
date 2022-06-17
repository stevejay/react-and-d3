import { SVGProps, useCallback, useContext } from 'react';
import { animated, SpringConfig } from 'react-spring';
import { AxisScale } from '@visx/axis';
import { Group } from '@visx/group';

import { useBarSeriesTransitions } from './animation';
import { DataContext } from './DataContext';
import { PositionScale, SeriesProps } from './types';
import { withRegisteredData, WithRegisteredDataProps } from './withRegisteredData';

// export function AnimatedBars<XScale extends AxisScale, YScale extends AxisScale>({
//   bars,
//   xScale,
//   yScale,
//   horizontal,
//   ...rectProps
// }: BarsProps<XScale, YScale>) {
//   const animatedBars = useTransition(bars, {
//     ...useBarTransitionConfig({ horizontal, scale: horizontal ? xScale : yScale })
//   });
//   const isFocusable = Boolean(rectProps.onFocus || rectProps.onBlur);

//   return (
//     <>
//       {animatedBars(
//         (
//           // @ts-expect-error x/y aren't in react-spring types (which are HTML CSS properties)
//           { x, y, width, height, fill, opacity },
//           item,
//           { key }
//         ) =>
//           item == null || key == null ? null : (
//             <animated.rect
//               key={key}
//               tabIndex={isFocusable ? 0 : undefined}
//               className="visx-bar"
//               x={x}
//               y={y}
//               width={width}
//               height={height}
//               // use the item's fill directly if it's not animate-able
//               fill={colorHasUrl(item.fill) ? item.fill : fill}
//               opacity={opacity}
//               {...rectProps}
//             />
//           )
//       )}
//     </>
//   );
// }

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
  colorAccessor?: (d: Datum, index?: number) => string | null | undefined;
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

export function BarSeries<XScale extends PositionScale, YScale extends PositionScale, Datum extends object>({
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
  const transitions = useBarSeriesTransitions(
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
    <Group data-test-id="bar-series" {...groupProps} className={groupClassName}>
      {transitions(({ opacity, x, y, width, height }, datum) => {
        const { style, ...restBarProps } = typeof barProps === 'function' ? barProps(datum) : barProps;
        return (
          <animated.rect
            data-test-id="bar"
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
  WithRegisteredDataProps<XScale, YScale, Datum>) {
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
}

export const XYChartBarSeries = withRegisteredData(XYChartBarSeriesInner);
