import { SeriesPoint } from 'd3-shape';
import { isNil } from 'lodash-es';

import { AxisScale, CategoryValueListDatum, ChartOrientation, DomainValue, Rect } from '@/types';

export function createStackedBarGenerator<CategoryT extends DomainValue>(
  categoryScale: AxisScale<CategoryT>,
  valueScale: AxisScale<number>,
  orientation: ChartOrientation,
  renderingOffset: number
) {
  const clonedCategoryScale = categoryScale.copy();
  const clonedValueScale = valueScale.copy();

  return (seriesPoint: SeriesPoint<CategoryValueListDatum<CategoryT, number>>): Rect | null => {
    // const categoryValue = clonedCategoryScale(seriesPoint.data.category);
    const value0Value = clonedValueScale(seriesPoint[0]);
    const value1Value = clonedValueScale(seriesPoint[1]);
    const bandwidth = clonedCategoryScale.bandwidth?.();

    if (
      //   isNil(categoryValue) ||
      isNil(value0Value) ||
      isNil(value1Value) ||
      isNil(bandwidth) ||
      // !isFinite(categoryValue) ||
      !isFinite(value0Value) ||
      !isFinite(value1Value) ||
      !isFinite(bandwidth)
    ) {
      return null;
    }

    if (orientation === 'vertical') {
      return {
        x: /*categoryValue +*/ renderingOffset,
        y: value1Value + renderingOffset,
        width: Math.max(bandwidth, 0),
        height: Math.max(value0Value - value1Value, 0)
      };
    } else {
      return {
        x: value0Value + renderingOffset,
        y: /*categoryValue +*/ renderingOffset,
        width: Math.max(value1Value - value0Value, 0),
        height: Math.max(bandwidth, 0)
      };
    }
  };
}
