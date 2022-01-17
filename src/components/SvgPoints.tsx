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
    initial: (datum) => ({ opacity: 1, ...circleGenerator(datum) }),
    from: (datum) => ({ opacity: 0, ...circleGenerator(datum) }),
    enter: (datum) => ({ opacity: 1, ...circleGenerator(datum) }),
    update: (datum) => ({ opacity: 1, ...circleGenerator(datum) }),
    leave: { opacity: 0 },
    config: springConfig,
    immediate: !animate
  });

  return (
    <g data-test-id="points-group" className={pointsGroupClassName} fill="currentColor" stroke="none">
      {transitions((styles, datum) => (
        <animated.circle
          data-test-id="point"
          r={typeof pointRadius === 'number' ? pointRadius : pointRadius(datum)}
          className={typeof pointClassName === 'string' ? pointClassName : pointClassName(datum)}
          role="graphics-symbol"
          aria-roledescription={datumAriaRoleDescription?.(datum)}
          aria-label={datumAriaLabel?.(datum)}
          style={styles}
        >
          {datumDescription && <desc>{datumDescription(datum)}</desc>}
        </animated.circle>
      ))}
    </g>
  );
}
