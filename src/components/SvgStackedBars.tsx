import { ReactElement } from 'react';
import type { ScaleOrdinal } from 'd3-scale';
import type { SeriesPoint } from 'd3-shape';
import { stack } from 'd3-shape';
import { AnimatePresence, m as motion } from 'framer-motion';
import { isNil } from 'lodash-es';

import type { AxisScale, CategoryValueListDatum, ChartOrientation, DomainValue, Rect } from '@/types';
import { getAxisDomainAsReactKey } from '@/utils/axisUtils';
import { getDefaultOffset, toAnimatableRect } from '@/utils/renderUtils';

import { SvgGroup } from './SvgGroup';

// TODO extract
export function createStackedBarGenerator<CategoryT extends DomainValue>(
  categoryScale: AxisScale<CategoryT>,
  valueScale: AxisScale<number>,
  chartWidth: number,
  chartHeight: number,
  orientation: ChartOrientation,
  offset: number
) {
  const clonedCategoryScale = categoryScale.copy();
  const clonedValueScale = valueScale.copy();

  return (seriesPoint: SeriesPoint<CategoryValueListDatum<CategoryT, number>>): Rect | null => {
    const categoryValue = clonedCategoryScale(seriesPoint.data.category);
    const value0Value = clonedValueScale(seriesPoint[0]);
    const value1Value = clonedValueScale(seriesPoint[1]); // TODO fix
    const bandwidth = clonedCategoryScale.bandwidth?.();

    if (
      isNil(categoryValue) ||
      isNil(value0Value) ||
      isNil(value1Value) ||
      isNil(bandwidth) ||
      !isFinite(categoryValue) ||
      !isFinite(value0Value) ||
      !isFinite(value1Value) ||
      !isFinite(bandwidth)
    ) {
      return null;
    }

    if (orientation === 'vertical') {
      return {
        x: categoryValue + offset,
        y: value1Value + offset,
        width: Math.max(bandwidth, 0),
        height: Math.max(value0Value - value1Value, 0)
      };
    } else {
      return {
        x: value0Value + offset,
        y: categoryValue + offset,
        width: Math.max(value1Value - value0Value, 0),
        height: Math.max(bandwidth, 0)
      };
    }
  };
}

export type SvgStackedBarsProps<CategoryT extends DomainValue> = {
  data: readonly CategoryValueListDatum<CategoryT, number>[];
  subCategories: readonly string[];
  colorScale: ScaleOrdinal<string, string, never>;
  translateX: number;
  translateY: number;
  chartWidth: number;
  chartHeight: number;
  orientation: ChartOrientation;
  categoryScale: AxisScale<CategoryT>;
  valueScale: AxisScale<number>;
  className?: string;
  offset?: number;
  seriesAriaRoleDescription?: (series: string) => string;
  seriesAriaLabel?: (series: string) => string;
  seriesAriaDescription?: (series: string) => string;
  datumAriaRoleDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumAriaLabel?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
  datumAriaDescription?: (datum: CategoryValueListDatum<CategoryT, number>, series: string) => string;
};

export function SvgStackedBars<CategoryT extends DomainValue>({
  data,
  subCategories,
  translateX,
  translateY,
  chartWidth,
  chartHeight,
  categoryScale,
  valueScale,
  colorScale,
  orientation,
  offset: offsetProp,
  className = '',
  seriesAriaRoleDescription,
  seriesAriaLabel,
  seriesAriaDescription,
  datumAriaRoleDescription,
  datumAriaLabel,
  datumAriaDescription
}: SvgStackedBarsProps<CategoryT>): ReactElement | null {
  // Used to ensure crisp edges on low-resolution devices.
  const offset = offsetProp ?? getDefaultOffset();

  const stackGenerator = stack<CategoryValueListDatum<CategoryT, number>, string>()
    .keys(subCategories)
    .value((d, key) => d.values[key]);

  const generator = createStackedBarGenerator(
    categoryScale,
    valueScale,
    chartWidth,
    chartHeight,
    orientation,
    offset
  );

  return (
    <SvgGroup
      className={className}
      translateX={translateX}
      translateY={translateY}
      fill="currentColor"
      stroke="none"
    >
      {/* <AnimatePresence initial={false}> */}
      {stackGenerator(data).map((series) => {
        const seriesKey = series.key;
        return (
          <g
            key={seriesKey}
            fill={colorScale(seriesKey)}
            role="graphics-object"
            aria-roledescription={seriesAriaRoleDescription?.(seriesKey)}
            aria-label={seriesAriaLabel?.(seriesKey)}
          >
            {seriesAriaDescription && <desc>{seriesAriaDescription(seriesKey)}</desc>}
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
                  // shapeRendering="crispEdges"
                  role="graphics-symbol"
                  aria-roledescription={datumAriaRoleDescription?.(seriesPoint.data, seriesKey)}
                  aria-label={datumAriaLabel?.(seriesPoint.data, seriesKey)}
                >
                  {datumAriaDescription && <desc>{datumAriaDescription(seriesPoint.data, seriesKey)}</desc>}
                </motion.rect>
              ))}
            </AnimatePresence>
          </g>
        );
      })}
      {/* </AnimatePresence> */}

      {/* <AnimatePresence custom={generator} initial={false}>
        {stackGenerator(data).map((series) => {
          const seriesKey = series.key;
          return series.map((seriesPoint) => (
            <motion.rect
              key={`${getAxisDomainAsReactKey(seriesPoint.data.category)}_${seriesKey}`}
              fill={colorScale(seriesKey)}
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
              // shapeRendering="crispEdges"
              role="graphics-symbol"
              aria-roledescription={datumAriaRoleDescription?.(seriesPoint.data)}
              aria-label={datumAriaLabel?.(seriesPoint.data)}
            >
              {datumAriaDescription && <desc>{datumAriaDescription(seriesPoint.data)}</desc>}
            </motion.rect>
          ));
        })}
      </AnimatePresence> */}
    </SvgGroup>
  );
}
