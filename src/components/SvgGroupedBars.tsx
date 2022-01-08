import { ReactElement } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';

import { createGroupedBarGenerator } from '@/generators/groupedBarGenerator';
import type { AxisScale, CategoryValueListDatum, ChartArea, ChartOrientation, DomainValue } from '@/types';
import { getAxisDomainAsReactKey } from '@/utils/axisUtils';
import { getDefaultRenderingOffset, toAnimatableRect } from '@/utils/renderUtils';

export type SvgGroupedBarsProps<CategoryT extends DomainValue> = {
  data: readonly CategoryValueListDatum<CategoryT, number>[];
  seriesKeys: readonly string[];
  seriesColor: (series: string, index: number) => string;
  chartArea: ChartArea;
  orientation: ChartOrientation;
  categoryScale: AxisScale<CategoryT>;
  seriesScale: AxisScale<string>;
  valueScale: AxisScale<number>;
  className?: string;
  offset?: number;
  categoryAriaRoleDescription?: (category: CategoryT) => string;
  categoryAriaLabel?: (category: CategoryT) => string;
  categoryDescription?: (category: CategoryT) => string;
  datumAriaRoleDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumAriaLabel?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
};

export function SvgGroupedBars<CategoryT extends DomainValue>({
  data,
  seriesKeys,
  seriesColor,
  categoryScale,
  seriesScale,
  valueScale,
  orientation,
  chartArea,
  offset,
  className = '',
  categoryAriaRoleDescription,
  categoryAriaLabel,
  categoryDescription,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription
}: SvgGroupedBarsProps<CategoryT>): ReactElement | null {
  const renderingOffset = offset ?? getDefaultRenderingOffset();
  const generator = createGroupedBarGenerator(
    seriesScale,
    valueScale,
    chartArea,
    orientation,
    renderingOffset
  );
  return (
    <g data-test-id="grouped-bars" className={className} fill="currentColor" stroke="none">
      <AnimatePresence initial={false}>
        {data.map((d) => (
          <motion.g
            key={getAxisDomainAsReactKey(d.category)}
            data-test-id="grouped-bar-category"
            role="graphics-object"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: () => ({
                opacity: 0,
                x: categoryScale(d.category)
              }),
              animate: () => ({
                opacity: 1,
                x: categoryScale(d.category)
              }),
              exit: () => ({
                opacity: 0
              })
            }}
            aria-roledescription={categoryAriaRoleDescription?.(d.category)}
            aria-label={categoryAriaLabel?.(d.category)}
          >
            {categoryDescription && <desc>{categoryDescription(d.category)}</desc>}
            <AnimatePresence initial={false}>
              {seriesKeys.map((seriesKey, index) => (
                <motion.rect
                  key={seriesKey}
                  data-test-id="bar"
                  className={className}
                  fill={seriesColor(seriesKey, index)}
                  role="graphics-symbol"
                  aria-roledescription={datumAriaRoleDescription?.(d, seriesKey)}
                  aria-label={datumAriaLabel?.(d, seriesKey)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={{
                    initial: () => ({
                      opacity: 0,
                      ...toAnimatableRect(generator(seriesKey, d.values[seriesKey]))
                    }),
                    animate: () => ({
                      opacity: 1,
                      ...toAnimatableRect(generator(seriesKey, d.values[seriesKey]))
                    }),
                    exit: () => ({
                      opacity: 0
                    })
                  }}
                >
                  {datumDescription && <desc>{datumDescription(d, seriesKey)}</desc>}
                </motion.rect>
              ))}
            </AnimatePresence>
          </motion.g>
        ))}
      </AnimatePresence>
    </g>
  );
}
