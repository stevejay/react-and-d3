import { SVGProps } from 'react';
import { animated, SpringConfig, useSpring } from 'react-spring';

import { AxisOrientation } from '@/types';
import { createAxisDomainPathData } from '@/utils/axisUtils';

export interface SvgAxisDomainPathProps {
  orientation: AxisOrientation;
  tickSize: number;
  renderingOffset: number;
  range: number[];
  k: number;
  className?: string;
  domainProps?: Omit<SVGProps<SVGPathElement>, 'ref'>;
  springConfig: SpringConfig;
  animate: boolean;
}

export function SvgAxisDomainPath({
  orientation,
  tickSize,
  renderingOffset,
  range,
  k,
  domainProps,
  springConfig,
  className = '',
  animate
}: SvgAxisDomainPathProps) {
  // The pixel position to start drawing the axis domain line at.
  let range0 = +range[0] + renderingOffset;

  // The pixel position to finish drawing the axis domain line at.
  let range1 = +range[range.length - 1] + renderingOffset;

  const animations = useSpring({
    to: {
      d: createAxisDomainPathData(orientation, tickSize, renderingOffset, range0, range1, k)
    },
    config: springConfig,
    immediate: !animate
  });

  return (
    <animated.path
      data-test-id="domain-path"
      fill="none"
      stroke="currentColor"
      role="presentation"
      d={animations.d}
      className={className}
      {...domainProps}
    />
  );
}
