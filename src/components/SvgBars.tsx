import { ReactElement, useEffect, useRef } from 'react';
import type { AxisDomain, AxisScale } from 'd3';
import { AnimatePresence, motion } from 'framer-motion';
import { isNil } from 'lodash-es';

import type { CategoryValueDatum, ChartOrientation } from '@/types';
import { getAxisDomainAsReactKey, getDefaultOffset } from '@/utils/axisUtils';

import { SvgGroup } from './SvgGroup';

function createRectDataGenerator<CategoryT extends AxisDomain, ValueT extends AxisDomain>(
  categoryScale: AxisScale<CategoryT>,
  valueScale: AxisScale<ValueT>,
  chartWidth: number,
  chartHeight: number,
  orientation: ChartOrientation,
  offset: number
) {
  const clonedCategoryScale = categoryScale.copy();
  const clonedValueScale = valueScale.copy();

  return (d: CategoryValueDatum<CategoryT, ValueT>, animateFromOrToZero: boolean) => {
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
        width: Math.max(bandwidth, 0),
        attrY: animateFromOrToZero ? chartHeight : valueValue + offset,
        height: animateFromOrToZero ? 0 : Math.max(chartHeight - valueValue, 0)
      };
    } else {
      return {
        attrY: categoryValue + offset,
        height: Math.max(bandwidth, 0),
        attrX: 0,
        width: animateFromOrToZero ? 0 : Math.max(valueValue, 0)
      };
    }
  };
}

export type SvgBarsProps<CategoryT extends AxisDomain, ValueT extends AxisDomain> = {
  data: CategoryValueDatum<CategoryT, ValueT>[];
  translateX: number;
  translateY: number;
  chartWidth: number;
  chartHeight: number;
  orientation: ChartOrientation;
  categoryScale: AxisScale<CategoryT>;
  valueScale: AxisScale<ValueT>;
  className?: string;
  offset?: number;
  datumAriaRoleDescription?: (datum: CategoryValueDatum<CategoryT, ValueT>) => string;
  datumAriaLabel?: (datum: CategoryValueDatum<CategoryT, ValueT>) => string;
  datumAriaDescription?: (datum: CategoryValueDatum<CategoryT, ValueT>) => string;
};

export function SvgBars<CategoryT extends AxisDomain, ValueT extends AxisDomain>({
  data,
  translateX,
  translateY,
  chartWidth,
  chartHeight,
  categoryScale,
  valueScale,
  orientation,
  offset: offsetProp,
  className = '',
  datumAriaRoleDescription,
  datumAriaLabel,
  datumAriaDescription
}: SvgBarsProps<CategoryT, ValueT>): ReactElement<any, any> | null {
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
            shapeRendering="crispEdges"
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
