import { ReactElement } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';
import { isNil } from 'lodash-es';

import type { AxisScale, CategoryValueDatum, ChartArea, ChartOrientation, DomainValue, Rect } from '@/types';
import { getAxisDomainAsReactKey } from '@/utils/axisUtils';
import { getDefaultOffset, toAnimatableRect } from '@/utils/renderUtils';

import { SvgGroup } from './SvgGroup';

// TODO extract
export function createBarDataGenerator<CategoryT extends DomainValue, ValueT extends DomainValue>(
  categoryScale: AxisScale<CategoryT>,
  valueScale: AxisScale<ValueT>,
  chartWidth: number,
  chartHeight: number,
  orientation: ChartOrientation,
  offset: number
) {
  const clonedCategoryScale = categoryScale.copy();
  const clonedValueScale = valueScale.copy();

  return (d: CategoryValueDatum<CategoryT, ValueT>, returnInteractionArea: boolean = false): Rect | null => {
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
        x: categoryValue + offset,
        width: Math.max(bandwidth, 0),
        y: returnInteractionArea ? offset : valueValue + offset,
        height: returnInteractionArea ? chartHeight : Math.max(chartHeight - valueValue, 0)
      };
    } else {
      return {
        x: 0 + offset,
        width: returnInteractionArea ? chartWidth : Math.max(valueValue, 0),
        y: categoryValue + offset,
        height: Math.max(bandwidth, 0)
      };
    }
  };
}

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
  datumAriaDescription?: (datum: CategoryValueDatum<CategoryT, ValueT>) => string;
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
  datumAriaDescription
}: SvgBarsProps<CategoryT, ValueT>): ReactElement | null {
  // Used to ensure crisp edges on low-resolution devices.
  const offset = offsetProp ?? getDefaultOffset();

  const generator = createBarDataGenerator(
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
                ...toAnimatableRect(generator(d))
              }),
              animate: () => ({
                opacity: 1,
                ...toAnimatableRect(generator(d))
              }),
              exit: (nextGenerator: typeof generator) => ({
                opacity: 0,
                ...toAnimatableRect(nextGenerator(d))
              })
            }}
            role="graphics-symbol"
            aria-roledescription={datumAriaRoleDescription?.(d)}
            aria-label={datumAriaLabel?.(d)}
          >
            {datumAriaDescription && <desc>{datumAriaDescription(d)}</desc>}
          </motion.rect>
        ))}
      </AnimatePresence>
    </SvgGroup>
  );
}
