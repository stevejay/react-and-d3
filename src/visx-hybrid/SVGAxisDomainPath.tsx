import type { SVGProps } from 'react';
import { animated, SpringConfig, useSpring } from 'react-spring';

import { createAxisDomainPath } from './createAxisDomainPath';
import type { AxisOrientation, AxisScaleOutput } from './types';

export type SVGAxisDomainPathProps = {
  orientation: AxisOrientation;
  outerTickLength: number;
  renderingOffset: number;
  range: AxisScaleOutput[];
  tickSign: number;
  springConfig?: SpringConfig;
  animate: boolean;
} & Omit<SVGProps<SVGPathElement>, 'ref'>;

/**
 * An axis domain path, rendered as an animated SVG <path> element.
 */
export function SVGAxisDomainPath({
  orientation,
  outerTickLength,
  renderingOffset,
  range,
  tickSign,
  springConfig,
  animate,
  className = '',
  stroke = 'currentColor',
  strokeLinecap = 'square',
  shapeRendering = 'crispEdges',
  ...rest
}: SVGAxisDomainPathProps) {
  const points = createAxisDomainPath(orientation, outerTickLength, range, tickSign, renderingOffset);
  const animations = useSpring<{ d: string }>({
    to: {
      d: `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y} L ${points[2].x},${points[2].y} L ${points[3].x},${points[3].y}`
    },
    config: springConfig,
    immediate: !animate
  });
  return (
    <animated.path
      data-testid="domain-path"
      fill="none"
      stroke={stroke}
      strokeLinecap={strokeLinecap}
      shapeRendering={shapeRendering}
      role="presentation"
      aria-hidden
      className={className}
      {...animations}
      {...rest}
    />
  );
}
