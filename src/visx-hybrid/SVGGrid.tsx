import type { SVGProps } from 'react';
import { animated, SpringConfig } from 'react-spring';

import { calculateTicksData } from './calculateTicksData';
import { defaultShapeRendering } from './constants';
import type { AxisScale, GridType, ScaleInput, TickDatum, Variable } from './types';
import { useGridTransitions } from './useGridTransitions';
import { useXYChartContext } from './useXYChartContext';

export interface SVGGridProps {
  /** Whether the stripes are for the independent or the dependent axis. */
  variable: Variable;
  /** Whether the stripes should animate. Optional. Defaults to `true`. */
  animate?: boolean;
  /** A react-spring configuration object for the animation. Optional. This should be a stable object. */
  springConfig?: SpringConfig;
  /** Whether the grid line for the zero value should be hidden. Optional. Defaults to `false`. */
  hideZero?: boolean;
  /** Whether the component should ignore any range padding applied to the axis. Optional. Defaults to `true`. */
  ignoreRangePadding?: boolean;
  /** A suggested count for the number of ticks to display. Optional. If not given then the scale's tick count value is applied. */
  tickCount?: number;
  /** If specified then the given values are used for ticks rather than using the scale’s automatic tick generator. Optional. */
  tickValues?: ScaleInput<AxisScale>[];
  /** Props to apply to the <g> element that wraps the grid. */
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
  /** Props to apply to each grid line. */
  lineProps?:
    | Omit<SVGProps<SVGLineElement>, 'ref' | 'x1' | 'y1' | 'x2' | 'y2'>
    | ((datum: TickDatum) => Omit<SVGProps<SVGLineElement>, 'ref' | 'x1' | 'y1' | 'x2' | 'y2'>);
}

/** Renders a series of parallel lines for the given axis (independent or dependent). */
export function SVGGrid({
  variable,
  springConfig,
  animate = true,
  groupProps,
  hideZero = false,
  ignoreRangePadding = true,
  tickCount,
  tickValues,
  lineProps
}: SVGGridProps) {
  const {
    scales,
    horizontal,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    renderingOffset,
    chartDimensions,
    theme
  } = useXYChartContext();

  const gridType: GridType =
    variable === 'independent' ? (horizontal ? 'row' : 'column') : horizontal ? 'column' : 'row';
  const gridTheme = theme?.grid?.[variable];
  const scale =
    variable === 'independent'
      ? scales.independent
      : scales.getDependentScale(variable === 'alternateDependent');
  const ticks = calculateTicksData({ scale, hideZero, tickCount, tickValues });
  const transitions = useGridTransitions({
    gridType,
    scale,
    chartDimensions,
    ignoreRangePadding,
    ticks,
    springConfig: springConfig ?? contextSpringConfig,
    animate: animate && contextAnimate,
    renderingOffset
  });
  return (
    <g data-testid={`grid-${variable}`} {...groupProps}>
      {transitions(({ opacity, x1, y1, x2, y2 }, datum) => {
        const { style, className, stroke, strokeWidth, strokeLinecap, strokeDasharray, ...restLineProps } =
          typeof lineProps === 'function' ? lineProps(datum) : lineProps ?? {};
        return (
          <animated.line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            role="presentation"
            aria-hidden
            style={{ ...gridTheme?.style, ...style, opacity }}
            className={`${gridTheme?.className ?? ''} ${className ?? ''}`}
            stroke={stroke ?? gridTheme?.stroke ?? 'currentColor'}
            strokeWidth={strokeWidth ?? gridTheme?.strokeWidth ?? 1}
            strokeLinecap={strokeLinecap ?? gridTheme?.strokeLinecap ?? 'square'}
            strokeDasharray={strokeDasharray ?? gridTheme?.strokeDasharray ?? undefined}
            shapeRendering={defaultShapeRendering}
            {...restLineProps}
          />
        );
      })}
    </g>
  );
}
