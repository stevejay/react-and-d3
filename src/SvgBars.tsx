import { FC, useEffect, useRef } from 'react';
import type { AxisDomain, AxisScale, ScaleOrdinal } from 'd3';
import { AnimatePresence, motion } from 'framer-motion';
import { isNil } from 'lodash-es';

import { getAxisDomainKey, getDefaultOffset } from './axisUtils';
import { SvgGroup } from './SvgGroup';
import { ChartOrientation } from './types';

export type Datum = {
  category: AxisDomain;
  value: AxisDomain;
};

function createRectDataGenerator(
  categoryScale: AxisScale<AxisDomain>,
  valueScale: AxisScale<AxisDomain>,
  chartWidth: number,
  chartHeight: number,
  orientation: ChartOrientation,
  offset: number
) {
  const clonedCategoryScale = categoryScale.copy();
  const clonedValueScale = valueScale.copy();

  return (d: Datum, isEnterOrExit: boolean) => {
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

export type SvgBarsProps = {
  data: Datum[];
  translateX: number;
  translateY: number;
  chartWidth: number;
  chartHeight: number;
  orientation: ChartOrientation;
  categoryScale: AxisScale<AxisDomain>;
  valueScale: AxisScale<AxisDomain>;
  colorScale: ScaleOrdinal<AxisDomain, string>;
  offset?: number;
};

export const SvgBars: FC<SvgBarsProps> = ({
  data,
  translateX,
  translateY,
  chartWidth,
  chartHeight,
  categoryScale,
  valueScale,
  colorScale,
  orientation,
  offset: offsetProp
}) => {
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
    <SvgGroup translateX={translateX} translateY={translateY} fill="currentColor" stroke="none">
      <AnimatePresence custom={generator}>
        {data.map((d) => (
          <motion.rect
            key={getAxisDomainKey(d.category)}
            fill="currentColor"
            className={colorScale(d.category)}
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
};
