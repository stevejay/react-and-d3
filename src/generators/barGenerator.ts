import { isNil } from 'lodash-es';

import type { AxisScale, CategoryValueDatum, ChartArea, ChartOrientation, DomainValue, Rect } from '@/types';

export function createBarGenerator<CategoryT extends DomainValue, ValueT extends DomainValue>(
  categoryScale: AxisScale<CategoryT>,
  valueScale: AxisScale<ValueT>,
  chartArea: ChartArea,
  orientation: ChartOrientation,
  offset: number = 0
) {
  const clonedCategoryScale = categoryScale.copy();
  const clonedValueScale = valueScale.copy();

  return (d: CategoryValueDatum<CategoryT, ValueT>): Rect | null => {
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
        y: valueValue + offset,
        height: Math.max(chartArea.height - valueValue, 0)
      };
    } else {
      return {
        x: 0 + offset,
        width: Math.max(valueValue, 0),
        y: categoryValue + offset,
        height: Math.max(bandwidth, 0)
      };
    }
  };
}
