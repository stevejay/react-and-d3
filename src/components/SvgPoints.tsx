import { ReactElement } from 'react';
import { animated, SpringConfig, useTransition } from '@react-spring/web';

import { createCircleGenerator } from '@/generators/circleGenerator';
import type { AxisScale, PointDatum } from '@/types';
import { getDefaultRenderingOffset } from '@/utils/renderUtils';

export type SvgPointsProps<DatumT> = {
  data: PointDatum<DatumT>[];
  xScale: AxisScale<number>;
  yScale: AxisScale<number>;
  pointsGroupClassName?: string;
  offset?: number;
  datumAriaRoleDescription?: (datum: PointDatum<DatumT>) => string;
  datumAriaLabel?: (datum: PointDatum<DatumT>) => string;
  datumDescription?: (datum: PointDatum<DatumT>) => string;
  pointRadius: ((datum: PointDatum<DatumT>) => number) | number;
  pointClassName: ((datum: PointDatum<DatumT>) => string) | string;
  animate?: boolean;
  springConfig: SpringConfig;
};

export function SvgPoints<DatumT>({
  data,
  xScale,
  yScale,
  offset,
  pointsGroupClassName = '',
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription,
  pointRadius,
  pointClassName,
  animate = true,
  springConfig
}: SvgPointsProps<DatumT>): ReactElement | null {
  const renderingOffset = offset ?? getDefaultRenderingOffset();
  const circleGenerator = createCircleGenerator(xScale, yScale, renderingOffset);

  // TODO I'm not sure what keys should be for this.
  // At the moment it is the object itself.
  const transitions = useTransition(data, {
    initial: (d) => ({ opacity: 1, ...circleGenerator(d) }),
    from: (d) => ({ opacity: 0, ...circleGenerator(d) }),
    enter: (d) => ({ opacity: 1, ...circleGenerator(d) }),
    update: (d) => ({ opacity: 1, ...circleGenerator(d) }),
    leave: { opacity: 0 },
    config: springConfig,
    immediate: !animate
  });

  return (
    <g data-test-id="points-group" className={pointsGroupClassName} fill="currentColor" stroke="none">
      {transitions((styles, d) => (
        <animated.circle
          data-test-id="point"
          r={typeof pointRadius === 'number' ? pointRadius : pointRadius(d)}
          className={typeof pointClassName === 'string' ? pointClassName : pointClassName(d)}
          role="graphics-symbol"
          aria-roledescription={datumAriaRoleDescription?.(d)}
          aria-label={datumAriaLabel?.(d)}
          style={styles}
        >
          {datumDescription && <desc>{datumDescription(d)}</desc>}
        </animated.circle>
      ))}
    </g>
  );
}
