import { SVGProps } from 'react';
import { animated, SpringConfig } from 'react-spring';

import { getTicksData } from './getTicksData';
import { isBandScale } from './isBandScale';
import type { AxisScale, ScaleInput, VariableType } from './types';
import { useDataContext } from './useDataContext';
import { useStripesTransitions } from './useStripesTransitions';

interface SVGBandStripesCoreProps {
  /** Whether the stripes are for the independent or the dependent axis. */
  variableType: VariableType;
  /** By default the odd-numbered stripes are rendered. Set this prop to `true` to render the even-numbered stripes instead. Optional. */
  even?: boolean;
  /** Whether the stripes should animate. Optional. Defaults to `true`. */
  animate?: boolean;
  /** A react-spring configuration object for the animation. Optional. This should be a stable object. */
  springConfig?: SpringConfig;
  /** Whether the component should ignore any range padding applied to the axis. Optional. Defaults to `true`. */
  ignoreRangePadding?: boolean;
  /** A suggested count for the number of ticks to display. Optional. If not given then the scale's tick count value is applied. */
  tickCount?: number;
  /** If specified then the given values are used for ticks rather than using the scale’s automatic tick generator. Optional. */
  tickValues?: ScaleInput<AxisScale>[];
  /** Props to apply to the <g> element that wraps the stripes. */
  groupProps?: Omit<SVGProps<SVGGElement>, 'ref'>;
}

export type SVGBandStripesProps = SVGBandStripesCoreProps &
  Omit<Omit<SVGProps<SVGRectElement>, 'ref' | 'x' | 'y' | 'width' | 'height'>, keyof SVGBandStripesCoreProps>;

/** Renders a series of stripes for the given axis (independent or dependent). It can only be used with a band scale. */
export function SVGBandStripes({
  variableType,
  springConfig,
  animate = true,
  groupProps,
  ignoreRangePadding = true,
  tickCount,
  tickValues,
  even,
  ...rectProps
}: SVGBandStripesProps) {
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

  const scale = variableType === 'independent' ? independentScale : dependentScale;
  if (!isBandScale(scale)) {
    throw new Error('The <SVGBandStripes> component can only be used with a band scale.');
  }

  const gridType =
    variableType === 'independent' ? (horizontal ? 'row' : 'column') : horizontal ? 'column' : 'row';
  const rangePadding = variableType === 'independent' ? dependentRangePadding : independentRangePadding;
  const ticks = getTicksData(scale, false, undefined, tickCount, tickValues);
  const transitions = useStripesTransitions({
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
  const { style, fill, className = '', ...restRectProps } = rectProps;

  return (
    <g data-testid={`stripes-${variableType}`} {...groupProps}>
      {transitions(({ opacity, x, y, width, height }, _, __, index) => {
        if (index % 2 === (even ? 0 : 1)) {
          return null;
        }
        return (
          <animated.rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{ ...theme?.stripes?.styles, ...style, opacity }}
            className={`${theme?.stripes?.className ?? ''} ${className}`}
            role="presentation"
            aria-hidden
            fill={fill ?? theme?.stripes?.fill ?? 'currentColor'}
            shapeRendering="crispEdges"
            {...restRectProps}
          />
        );
      })}
    </g>
  );
}
