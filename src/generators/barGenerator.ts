import { isNil } from 'lodash-es';

import { AxisScale, CategoryValueDatum, ChartOrientation, DomainValue, Rect } from '@/types';

// Value type for the CategoryValueDatum must be number.
export function createBarGenerator<CategoryT extends DomainValue>(
  categoryScale: AxisScale<CategoryT>,
  valueScale: AxisScale<number>,
  orientation: ChartOrientation,
  renderingOffset: number = 0
) {
  const clonedCategoryScale = categoryScale.copy();
  const clonedValueScale = valueScale.copy();

  return (datum: CategoryValueDatum<CategoryT, number>): Rect | null => {
    const categoryValue = clonedCategoryScale(datum.category);
    const valueValue = clonedValueScale(datum.value);
    const zeroValue = clonedValueScale(0);
    const bandwidth = clonedCategoryScale.bandwidth?.();

    if (
      isNil(categoryValue) ||
      isNil(valueValue) ||
      isNil(zeroValue) ||
      isNil(bandwidth) ||
      !isFinite(categoryValue) ||
      !isFinite(valueValue) ||
      !isFinite(zeroValue) ||
      !isFinite(bandwidth)
    ) {
      return null;
    }

    if (orientation === 'vertical') {
      return {
        x: categoryValue + renderingOffset,
        width: Math.max(bandwidth, 0),

        y: datum.value > 0 ? valueValue + renderingOffset : zeroValue + renderingOffset,
        height: Math.max(datum.value > 0 ? zeroValue - valueValue : valueValue - zeroValue, 0)
      };
    } else {
      return {
        x: datum.value > 0 ? zeroValue + renderingOffset : valueValue + renderingOffset,
        width: Math.max(datum.value > 0 ? valueValue - zeroValue : zeroValue - valueValue, 0),

        y: categoryValue + renderingOffset,
        height: Math.max(bandwidth, 0)
      };
    }
  };
}
