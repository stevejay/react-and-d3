import type { SVGProps } from 'react';
import { animated, SpringConfig } from 'react-spring';

import { defaultShapeRendering } from './constants';
import { getTicksData } from './getTicksData';
import type { AxisScale, GridType, ScaleInput, Variable } from './types';
import { useDataContext } from './useDataContext';
import { useGridTransitions } from './useGridTransitions';

interface SVGGridOwnProps {
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
}

export type SVGGridProps = SVGGridOwnProps &
  Omit<Omit<SVGProps<SVGLineElement>, 'ref' | 'x1' | 'y1' | 'x2' | 'y2'>, keyof SVGGridOwnProps>;

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
  ...lineProps
}: SVGGridProps) {
  const {
    independentScale,
    dependentScale,
    independentRangePadding,
    dependentRangePadding,
    horizontal,
    springConfig: contextSpringConfig,
    animate: contextAnimate,
    renderingOffset,
    margin,
    innerWidth,
    innerHeight,
    theme
  } = useDataContext();

  const gridType: GridType =
    variable === 'independent' ? (horizontal ? 'row' : 'column') : horizontal ? 'column' : 'row';
  const gridTheme = theme?.grid?.[variable];
  const scale = variable === 'independent' ? independentScale : dependentScale;
  const rangePadding = variable === 'independent' ? dependentRangePadding : independentRangePadding;
  const ticks = getTicksData(scale, hideZero, undefined, tickCount, tickValues);
  const transitions = useGridTransitions({
    gridType,
    scale,
    rangePadding: ignoreRangePadding ? 0 : rangePadding,
    margin,
    innerWidth,
    innerHeight,
    ticks,
    springConfig: springConfig ?? contextSpringConfig,
    animate: animate && contextAnimate,
    renderingOffset
  });
  const { style, className, stroke, strokeWidth, strokeLinecap, strokeDasharray, ...restLineProps } =
    lineProps;
  return (
    <g data-testid={`grid-${variable}`} {...groupProps}>
      {transitions(({ opacity, x1, y1, x2, y2 }) => (
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
      ))}
    </g>
  );
}
