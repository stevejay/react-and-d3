import { ReactElement } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';

import { createBarGenerator } from '@/generators/barGenerator';
import type { AxisScale, CategoryValueDatum, ChartOrientation, DomainValue } from '@/types';
import { getAxisDomainAsReactKey } from '@/utils/axisUtils';
import { getDefaultRenderingOffset, toAnimatableRect } from '@/utils/renderUtils';

export type SvgBarsProps<CategoryT extends DomainValue> = {
  data: CategoryValueDatum<CategoryT, number>[];
  orientation: ChartOrientation;
  categoryScale: AxisScale<CategoryT>;
  valueScale: AxisScale<number>;
  className?: string;
  offset?: number;
  datumAriaRoleDescription?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  datumAriaLabel?: (datum: CategoryValueDatum<CategoryT, number>) => string;
  datumDescription?: (datum: CategoryValueDatum<CategoryT, number>) => string;
};

export function SvgBars<CategoryT extends DomainValue>({
  data,
  categoryScale,
  valueScale,
  orientation,
  offset,
  className = '',
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription
}: SvgBarsProps<CategoryT>): ReactElement | null {
  const renderingOffset = offset ?? getDefaultRenderingOffset();
  const barGenerator = createBarGenerator(categoryScale, valueScale, orientation, renderingOffset);
  return (
    <g data-test-id="bars-group" className={className} fill="currentColor" stroke="none">
      <AnimatePresence custom={barGenerator} initial={false}>
        {data.map((d) => (
          <motion.rect
            key={getAxisDomainAsReactKey(d.category)}
            data-test-id="bar"
            className={className}
            custom={barGenerator}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: () => ({
                opacity: 0,
                ...toAnimatableRect(barGenerator(d))
              }),
              animate: () => ({
                opacity: 1,
                ...toAnimatableRect(barGenerator(d))
              }),
              exit: (nextBarGenerator: typeof barGenerator) => ({
                opacity: 0,
                ...toAnimatableRect(nextBarGenerator(d))
              })
            }}
            role="graphics-symbol"
            aria-roledescription={datumAriaRoleDescription?.(d)}
            aria-label={datumAriaLabel?.(d)}
          >
            {datumDescription && <desc>{datumDescription(d)}</desc>}
          </motion.rect>
        ))}
      </AnimatePresence>
    </g>
  );
}
