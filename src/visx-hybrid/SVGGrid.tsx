import type { SVGProps } from 'react';
import { animated, SpringConfig } from 'react-spring';

import { getTicksData } from './getTicksData';
import type { AxisScale, GridType, ScaleInput, VariableType } from './types';
import { useDataContext } from './useDataContext';
import { useGridTransitions } from './useGridTransitions';

interface SVGGridCoreProps {
  /** Whether the stripes are for the independent or the dependent axis. */
  variableType: VariableType;
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
  /** Props to apply to the <g> element that wraps the stripes. */
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
}

export type SVGGridProps = SVGGridCoreProps &
  Omit<Omit<SVGProps<SVGLineElement>, 'ref' | 'x1' | 'y1' | 'x2' | 'y2'>, keyof SVGGridCoreProps>;

/** Renders a series of parallel lines for the given axis (independent or dependent). */
export function SVGGrid({
  variableType,
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
    variableType === 'independent' ? (horizontal ? 'row' : 'column') : horizontal ? 'column' : 'row';
  const scale = variableType === 'independent' ? independentScale : dependentScale;
  const rangePadding = variableType === 'independent' ? dependentRangePadding : independentRangePadding;
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

  const {
    style,
    className = '',
    stroke,
    strokeWidth,
    strokeLinecap,
    strokeDasharray,
    ...restLineProps
  } = lineProps;

  const lineStroke = stroke ?? theme?.grid?.stroke ?? 'currentColor';
  const lineStrokeWidth = strokeWidth ?? theme?.grid?.strokeWidth ?? 1;
  const lineStrokeLinecap = strokeLinecap ?? theme?.grid?.strokeLinecap ?? 'square';
  const lineStrokeDasharray = strokeDasharray ?? theme?.grid?.strokeDasharray ?? undefined;

  return (
    <g data-testid={`grid-${variableType}`} {...groupProps}>
      {transitions(({ opacity, x1, y1, x2, y2 }) => (
        <animated.line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          style={{ ...theme?.grid?.styles, ...style, opacity }}
          className={`${theme?.grid?.className ?? ''} ${className}`}
          role="presentation"
          aria-hidden
          stroke={lineStroke}
          strokeWidth={lineStrokeWidth}
          strokeLinecap={lineStrokeLinecap}
          strokeDasharray={lineStrokeDasharray}
          shapeRendering="crispEdges"
          {...restLineProps}
        />
      ))}
    </g>
  );
}
