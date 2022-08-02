import type { SVGProps } from 'react';
import { animated, SpringConfig, useSpring } from 'react-spring';

import { defaultShapeRendering } from './constants';
import { getCoordinatesForAxisLine } from './getCoordinatesForAxisLine';
import type { AxisOrientation, AxisScaleOutput, PathStyles } from './types';

interface SVGAxisPathOwnProps {
  axisOrientation: AxisOrientation;
  outerTickLength: number;
  renderingOffset: number;
  range: AxisScaleOutput[];
  springConfig?: SpringConfig;
  animate: boolean;
  pathStyles?: PathStyles;
}

export type SVGAxisPathProps = SVGAxisPathOwnProps &
  Omit<Omit<SVGProps<SVGPathElement>, 'ref' | 'd'>, keyof SVGAxisPathOwnProps>;

/**
 * An axis domain path, rendered as an animated SVG <path> element.
 */
export function SVGAxisPath({
  axisOrientation,
  outerTickLength,
  renderingOffset,
  range,
  springConfig,
  animate,
  pathStyles,
  ...pathProps
}: SVGAxisPathProps) {
  const tickSign = axisOrientation === 'left' || axisOrientation === 'top' ? -1 : 1;
  const points = getCoordinatesForAxisLine({
    axisOrientation,
    outerTickLength,
    range,
    tickSign,
    renderingOffset
  });
  const animations = useSpring<{ d: string }>({
    to: {
      d: `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y} L ${points[2].x},${points[2].y} L ${points[3].x},${points[3].y}`
    },
    config: springConfig,
    immediate: !animate
  });
  const { style, className, stroke, strokeWidth, strokeLinecap, strokeDasharray, ...restPathProps } =
    pathProps;
  return (
    <animated.path
      data-testid={`axis-${axisOrientation}-domain-path`}
      role="presentation"
      aria-hidden
      fill="none"
      className={`${pathStyles?.className ?? ''} ${className ?? ''}`}
      style={{ ...pathStyles?.style, ...style }}
      stroke={stroke ?? pathStyles?.stroke ?? 'currentColor'}
      strokeWidth={strokeWidth ?? pathStyles?.strokeWidth ?? 1}
      strokeLinecap={strokeLinecap ?? pathStyles?.strokeLinecap ?? 'square'}
      strokeDasharray={strokeDasharray ?? pathStyles?.strokeDasharray ?? undefined}
      shapeRendering={defaultShapeRendering}
      {...animations}
      {...restPathProps}
    />
  );
}
