import { ReactElement } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';

import { createBarGenerator } from '@/generators/barGenerator';
import type { AxisScale, CategoryValueDatum, ChartArea, ChartOrientation, DomainValue } from '@/types';
import { getAxisDomainAsReactKey } from '@/utils/axisUtils';
import { getDefaultRenderingOffset, toAnimatableRect } from '@/utils/renderUtils';

import { SvgGroup } from './SvgGroup';

export type SvgBarsProps<CategoryT extends DomainValue, ValueT extends DomainValue> = {
  data: CategoryValueDatum<CategoryT, ValueT>[];
  chartArea: ChartArea;
  orientation: ChartOrientation;
  categoryScale: AxisScale<CategoryT>;
  valueScale: AxisScale<ValueT>;
  className?: string;
  offset?: number;
  datumAriaRoleDescription?: (datum: CategoryValueDatum<CategoryT, ValueT>) => string;
  datumAriaLabel?: (datum: CategoryValueDatum<CategoryT, ValueT>) => string;
  datumDescription?: (datum: CategoryValueDatum<CategoryT, ValueT>) => string;
};

export function SvgBars<CategoryT extends DomainValue, ValueT extends DomainValue>({
  data,
  chartArea,
  categoryScale,
  valueScale,
  orientation,
  offset: offsetProp,
  className = '',
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription
}: SvgBarsProps<CategoryT, ValueT>): ReactElement | null {
  // Used to ensure crisp edges on low-resolution devices.
  const offset = offsetProp ?? getDefaultRenderingOffset();

  const barGenerator = createBarGenerator(
    categoryScale,
    valueScale,
    chartArea.width,
    chartArea.height,
    orientation,
    offset
  );

  return (
    <SvgGroup
      className={className}
      translateX={chartArea.translateLeft}
      translateY={chartArea.translateTop}
      fill="currentColor"
      stroke="none"
    >
      <AnimatePresence custom={barGenerator} initial={false}>
        {data.map((d) => (
          <motion.rect
            key={getAxisDomainAsReactKey(d.category)}
            fill="currentColor"
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
    </SvgGroup>
  );
}
