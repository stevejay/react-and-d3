import { ReactElement, useEffect, useRef } from 'react';
import type { AxisDomain, AxisScale } from 'd3';
import { AnimatePresence, motion } from 'framer-motion';
import { isNil } from 'lodash-es';

import { getAxisDomainAsReactKey, getDefaultOffset } from './axisUtils';
import { SvgGroup } from './SvgGroup';
import { ChartOrientation } from './types';

export type Datum<CategoryDomain extends AxisDomain, ValueDomain extends AxisDomain> = {
  category: CategoryDomain;
  value: ValueDomain;
};

function createRectDataGenerator<CategoryDomain extends AxisDomain, ValueDomain extends AxisDomain>(
  categoryScale: AxisScale<CategoryDomain>,
  valueScale: AxisScale<ValueDomain>,
  chartWidth: number,
  chartHeight: number,
  orientation: ChartOrientation,
  offset: number
) {
  const clonedCategoryScale = categoryScale.copy();
  const clonedValueScale = valueScale.copy();

  return (d: Datum<CategoryDomain, ValueDomain>, animateFromOrToZero: boolean) => {
    const categoryValue = clonedCategoryScale(d.category);
    const valueValue = clonedValueScale(d.value);
    const bandwidth = clonedCategoryScale.bandwidth?.();

    if (
      isNil(categoryValue) ||
      isNil(valueValue) ||
      isNil(bandwidth) ||
      !isFinite(categoryValue) ||
      !isFinite(valueValue) ||
      !isFinite(bandwidth)
    ) {
      return null;
    }

    if (orientation === 'vertical') {
      return {
        attrX: categoryValue + offset,
        width: Math.max(bandwidth - offset * 2, 0),
        attrY: animateFromOrToZero ? chartHeight : valueValue + offset,
        height: animateFromOrToZero ? 0 : Math.max(chartHeight - valueValue - offset * 2, 0)
      };
    } else {
      return {
        attrY: categoryValue + offset,
        height: Math.max(bandwidth - offset * 2, 0),
        attrX: 0,
        width: animateFromOrToZero ? 0 : Math.max(valueValue - offset * 2, 0)
      };
    }
  };
}

export type SvgBarsProps<CategoryDomain extends AxisDomain, ValueDomain extends AxisDomain> = {
  data: Datum<CategoryDomain, ValueDomain>[];
  translateX: number;
  translateY: number;
  chartWidth: number;
  chartHeight: number;
  orientation: ChartOrientation;
  categoryScale: AxisScale<CategoryDomain>;
  valueScale: AxisScale<ValueDomain>;
  className?: string;
  offset?: number;
};

export function SvgBars<CategoryDomain extends AxisDomain, ValueDomain extends AxisDomain>({
  data,
  translateX,
  translateY,
  chartWidth,
  chartHeight,
  categoryScale,
  valueScale,
  orientation,
  offset: offsetProp,
  className = ''
}: SvgBarsProps<CategoryDomain, ValueDomain>): ReactElement<any, any> | null {
  // Used to ensure crisp edges on low-resolution devices.
  const offset = offsetProp ?? getDefaultOffset();

  const generator = createRectDataGenerator(
    categoryScale,
    valueScale,
    chartWidth,
    chartHeight,
    orientation,
    offset
  );

  const previousGeneratorRef = useRef<typeof generator | null>(null);

  // Always run.
  useEffect(() => {
    previousGeneratorRef.current = generator;
  });

  return (
    <SvgGroup
      className={className}
      translateX={translateX}
      translateY={translateY}
      fill="currentColor"
      stroke="none"
    >
      <AnimatePresence custom={generator} initial={false}>
        {data.map((d) => (
          <motion.rect
            key={getAxisDomainAsReactKey(d.category)}
            fill="currentColor"
            className={className}
            custom={generator}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: () => ({
                opacity: 0,
                ...generator(d, false)
              }),
              animate: () => ({
                opacity: 1,
                ...generator(d, false)
              }),
              exit: (nextGenerator: typeof generator) => ({
                opacity: 0,
                ...nextGenerator(d, false)
              })
            }}
          />
        ))}
      </AnimatePresence>
    </SvgGroup>
  );
}
