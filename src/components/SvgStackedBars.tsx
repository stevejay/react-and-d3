import { ReactElement } from 'react';
import { stack } from 'd3-shape';
import { AnimatePresence, m as motion } from 'framer-motion';

import { createStackedBarGenerator } from '@/generators/stackedBarGenerator';
import type { AxisScale, CategoryValueListDatum, ChartOrientation, DomainValue } from '@/types';
import { getAxisDomainAsReactKey } from '@/utils/axisUtils';
import { getDefaultRenderingOffset, toAnimatableRect } from '@/utils/renderUtils';

export type SvgStackedBarsProps<CategoryT extends DomainValue> = {
  data: readonly CategoryValueListDatum<CategoryT, number>[];
  seriesKeys: readonly string[];
  seriesColor: (series: string, index: number) => string;
  orientation: ChartOrientation;
  categoryScale: AxisScale<CategoryT>;
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

export function SvgStackedBars<CategoryT extends DomainValue>({
  data,
  seriesKeys,
  seriesColor,
  categoryScale,
  valueScale,
  orientation,
  offset,
  className = '',
  categoryAriaRoleDescription,
  categoryAriaLabel,
  categoryDescription,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription
}: SvgStackedBarsProps<CategoryT>): ReactElement | null {
  // Used to ensure crisp edges on low-resolution devices.
  const renderingOffset = offset ?? getDefaultRenderingOffset();
  const stackSeries = stack<CategoryValueListDatum<CategoryT, number>, string>()
    .keys(seriesKeys)
    .value((d, key) => d.values[key]);
  const stackSeriesData = stackSeries(data);
  const generator = createStackedBarGenerator(categoryScale, valueScale, orientation, renderingOffset);
  const translateAxis = orientation === 'vertical' ? 'x' : 'y';
  return (
    <g
      role="presentation"
      data-test-id="stacked-bars-group"
      className={className}
      fill="currentColor"
      stroke="none"
    >
      <AnimatePresence initial={false}>
        {data.map((d, datumIndex) => (
          <motion.g
            key={getAxisDomainAsReactKey(d.category)}
            data-test-id="category-group"
            role="graphics-object"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: () => ({
                opacity: 0,
                [translateAxis]: categoryScale(d.category)
              }),
              animate: () => ({
                opacity: 1,
                [translateAxis]: categoryScale(d.category)
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
              {stackSeriesData
                .map((series) => ({
                  seriesPoint: series[datumIndex],
                  seriesKey: series.key
                }))
                .map(({ seriesPoint, seriesKey }, index) => (
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
                        ...toAnimatableRect(generator(seriesPoint))
                      }),
                      animate: () => ({
                        opacity: 1,
                        ...toAnimatableRect(generator(seriesPoint))
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
