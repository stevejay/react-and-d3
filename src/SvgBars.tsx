import { ReactElement, useEffect, useRef } from 'react';
import type { AxisDomain, AxisScale } from 'd3';
import { AnimatePresence, motion } from 'framer-motion';
import { isNil } from 'lodash-es';

import { getAxisDomainKey, getDefaultOffset } from './axisUtils';
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

  return (d: Datum<CategoryDomain, ValueDomain>, isEnterOrExit: boolean) => {
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
        width: bandwidth - offset * 2,
        attrY: isEnterOrExit ? chartHeight : valueValue + offset,
        height: isEnterOrExit ? 0 : chartHeight - valueValue - offset * 2
      };
    } else {
      return {
        attrY: categoryValue + offset,
        height: bandwidth - offset * 2,
        attrX: 0,
        width: isEnterOrExit ? 0 : valueValue - offset * 2
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
      <AnimatePresence custom={generator}>
        {data.map((d) => (
          <motion.rect
            key={getAxisDomainKey(d.category)}
            fill="currentColor"
            className={className}
            custom={generator}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: () => ({
                opacity: 0,
                ...generator(d, true)
              }),
              animate: () => ({
                opacity: 1,
                ...generator(d, false)
              }),
              exit: (nextGenerator: typeof generator) => ({
                opacity: 0,
                ...nextGenerator(d, true)
              })
            }}
          />
        ))}
      </AnimatePresence>
    </SvgGroup>
  );
}
