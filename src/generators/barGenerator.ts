import { isNil } from 'lodash-es';

import type { AxisScale, CategoryValueDatum, ChartOrientation, DomainValue, Rect } from '@/types';

export function createBarGenerator<CategoryT extends DomainValue, ValueT extends DomainValue>(
  categoryScale: AxisScale<CategoryT>,
  valueScale: AxisScale<ValueT>,
  chartWidth: number,
  chartHeight: number,
  orientation: ChartOrientation,
  offset: number = 0
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
