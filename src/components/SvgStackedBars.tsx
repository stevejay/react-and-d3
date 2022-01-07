import { ReactElement } from 'react';
import type { ScaleOrdinal } from 'd3-scale';
import { stack } from 'd3-shape';
import { AnimatePresence, m as motion } from 'framer-motion';

import { createStackedBarGenerator } from '@/generators/stackedBarGenerator';
import type { AxisScale, CategoryValueListDatum, ChartArea, ChartOrientation, DomainValue } from '@/types';
import { getAxisDomainAsReactKey } from '@/utils/axisUtils';
import { getDefaultRenderingOffset, toAnimatableRect } from '@/utils/renderUtils';

import { SvgGroup } from './SvgGroup';

export type SvgStackedBarsProps<CategoryT extends DomainValue> = {
  data: readonly CategoryValueListDatum<CategoryT, number>[];
  seriesKeys: readonly string[];
  colorScale: ScaleOrdinal<string, string, never>;
  chartArea: ChartArea;
  orientation: ChartOrientation;
  categoryScale: AxisScale<CategoryT>;
  valueScale: AxisScale<number>;
  className?: string;
  offset?: number;
  seriesAriaRoleDescription?: (series: string) => string;
  seriesAriaLabel?: (series: string) => string;
  seriesDescription?: (series: string) => string;
  datumAriaRoleDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumAriaLabel?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
};

export function SvgStackedBars<CategoryT extends DomainValue>({
  data,
  seriesKeys,
  categoryScale,
  valueScale,
  colorScale,
  orientation,
  chartArea,
  offset: offsetProp,
  className = '',
  seriesAriaRoleDescription,
  seriesAriaLabel,
  seriesDescription,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumDescription
}: SvgStackedBarsProps<CategoryT>): ReactElement | null {
  // Used to ensure crisp edges on low-resolution devices.
  const offset = offsetProp ?? getDefaultRenderingOffset();

  const stackSeries = stack<CategoryValueListDatum<CategoryT, number>, string>()
    .keys(seriesKeys)
    .value((d, key) => d.values[key]);

  const generator = createStackedBarGenerator(categoryScale, valueScale, orientation, offset);

  return (
    <SvgGroup
      className={className}
      translateX={chartArea.translateLeft}
      translateY={chartArea.translateTop}
      fill="currentColor"
      stroke="none"
    >
      {stackSeries(data).map((series) => {
        const seriesKey = series.key;
        return (
          <g
            key={seriesKey}
            fill={colorScale(seriesKey)}
            role="graphics-object"
            aria-roledescription={seriesAriaRoleDescription?.(seriesKey)}
            aria-label={seriesAriaLabel?.(seriesKey)}
          >
            {seriesDescription && <desc>{seriesDescription(seriesKey)}</desc>}
            <AnimatePresence custom={generator} initial={false}>
              {series.map((seriesPoint) => (
                <motion.rect
                  key={getAxisDomainAsReactKey(seriesPoint.data.category)}
                  className={className}
                  custom={generator}
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
                    exit: (nextGenerator: typeof generator) => ({
                      opacity: 0,
                      ...toAnimatableRect(nextGenerator(seriesPoint))
                    })
                  }}
                  role="graphics-symbol"
                  aria-roledescription={datumAriaRoleDescription?.(seriesPoint.data, seriesKey)}
                  aria-label={datumAriaLabel?.(seriesPoint.data, seriesKey)}
                >
                  {datumDescription && <desc>{datumDescription(seriesPoint.data, seriesKey)}</desc>}
                </motion.rect>
              ))}
            </AnimatePresence>
          </g>
        );
      })}
    </SvgGroup>
  );
}
