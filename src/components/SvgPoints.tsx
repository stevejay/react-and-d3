import { ReactElement } from 'react';

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
  animate = true
}: SvgPointsProps<DatumT>): ReactElement | null {
  const renderingOffset = offset ?? getDefaultRenderingOffset();
  const circleGenerator = createCircleGenerator(xScale, yScale, renderingOffset);

  return (
    <g data-test-id="points-group" className={pointsGroupClassName} fill="currentColor" stroke="none">
      {data.map((d, index) => (
        <circle
          key={index}
          data-test-id="point"
          r={typeof pointRadius === 'number' ? pointRadius : pointRadius(d)}
          className={typeof pointClassName === 'string' ? pointClassName : pointClassName(d)}
          {...circleGenerator(d)}
          role="graphics-symbol"
          aria-roledescription={datumAriaRoleDescription?.(d)}
          aria-label={datumAriaLabel?.(d)}
        >
          {datumDescription && <desc>{datumDescription(d)}</desc>}
        </circle>
      ))}
    </g>
  );

  //   return (
  //     <g data-test-id="points-group" className={pointsGroupClassName}>
  //       <AnimatePresence custom={circleGenerator} initial={false}>
  //         {data.map((d, index) => (
  //           <motion.circle
  //             key={index}
  //             data-test-id="point"
  //             r={typeof pointRadius === 'number' ? pointRadius : pointRadius(d)}
  //             className={typeof pointClassName === 'string' ? pointClassName : pointClassName(d)}
  //             custom={circleGenerator}
  //             transition={animate ? undefined : noAnimations}
  //             initial="initial"
  //             animate="animate"
  //             exit="exit"
  //             variants={{
  //               initial: () => ({
  //                 opacity: 0,
  //                 ...circleGenerator(d)
  //               }),
  //               animate: () => ({
  //                 opacity: 1,
  //                 ...circleGenerator(d)
  //               }),
  //               exit: (nextCircleGenerator: typeof circleGenerator) => ({
  //                 opacity: 0,
  //                 ...nextCircleGenerator(d)
  //               })
  //             }}
  //             role="graphics-symbol"
  //             aria-roledescription={datumAriaRoleDescription?.(d)}
  //             aria-label={datumAriaLabel?.(d)}
  //           >
  //             {datumDescription && <desc>{datumDescription(d)}</desc>}
  //           </motion.circle>
  //         ))}
  //       </AnimatePresence>
  //     </g>
  //   );
}
