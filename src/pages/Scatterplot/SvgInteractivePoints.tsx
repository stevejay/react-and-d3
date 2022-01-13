import { ReactElement } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';

import { createCircleGenerator } from '@/generators/circleGenerator';
import type { AxisScale, PointDatum } from '@/types';
import { getDefaultRenderingOffset } from '@/utils/renderUtils';

export type SvgInteractivePointsProps = {
  data: PointDatum[];
  xScale: AxisScale<number>;
  yScale: AxisScale<number>;
  className?: string;
  offset?: number;
  // TODO change this to a scale:
  opacity?: number;
  datumAriaRoleDescription?: (datum: PointDatum) => string;
  datumAriaLabel?: (datum: PointDatum) => string;
  datumDescription?: (datum: PointDatum) => string;
};

export function SvgInteractivePoints({
  data,
  xScale,
  yScale,
  offset,
  className = '',
  opacity = 0.5,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription
}: SvgInteractivePointsProps): ReactElement | null {
  const renderingOffset = offset ?? getDefaultRenderingOffset();
  const circleGenerator = createCircleGenerator(xScale, yScale, renderingOffset);
  return (
    <g data-test-id="points-group" className={className} fill="currentColor" stroke="none">
      <AnimatePresence custom={circleGenerator} initial={false}>
        {data.map((d) => (
          <motion.circle
            key={`${d.x}_${d.y}`}
            r={20}
            data-test-id="point"
            className={className}
            custom={circleGenerator}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: () => ({
                opacity: 0,
                ...circleGenerator(d)
              }),
              animate: () => ({
                opacity,
                ...circleGenerator(d)
              }),
              exit: (nextCircleGenerator: typeof circleGenerator) => ({
                opacity: 0,
                ...nextCircleGenerator(d)
              })
            }}
            role="graphics-symbol"
            aria-roledescription={datumAriaRoleDescription?.(d)}
            aria-label={datumAriaLabel?.(d)}
          >
            {datumDescription && <desc>{datumDescription(d)}</desc>}
          </motion.circle>
        ))}
      </AnimatePresence>
    </g>
  );
}
