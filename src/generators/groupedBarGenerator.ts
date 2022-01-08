import { isNil } from 'lodash-es';

import type { AxisScale, ChartArea, ChartOrientation, DomainValue, Rect } from '@/types';

export function createGroupedBarGenerator<CategoryT extends DomainValue>(
  seriesScale: AxisScale<string>,
  valueScale: AxisScale<number>,
  chartArea: ChartArea,
  orientation: ChartOrientation,
  offset: number
) {
  //   const clonedCategoryScale = categoryScale.copy();
  const clonedSeriesScale = seriesScale.copy();
  const clonedValueScale = valueScale.copy();

  return (seriesKey: string, value: number): Rect | null => {
    // const categoryValue = clonedCategoryScale(seriesPoint.data.category);
    const seriesValue = clonedSeriesScale(seriesKey);
    const valueValue = clonedValueScale(value);
    const bandwidth = clonedSeriesScale.bandwidth?.();

    // .attr("x", function(d) { return x1(d.key); }) < seriesValue
    // .attr("y", function(d) { return y(d.value); }) < valueValue
    // .attr("width", x1.bandwidth())
    // .attr("height", function(d) { return height - y(d.value); })

    if (
      isNil(seriesValue) ||
      isNil(valueValue) ||
      isNil(bandwidth) ||
      !isFinite(seriesValue) ||
      !isFinite(valueValue) ||
      !isFinite(bandwidth)
    ) {
      return null;
    }

    if (orientation === 'vertical') {
      return {
        x: seriesValue + offset,
        y: valueValue + offset,
        width: Math.max(bandwidth, 0),
        height: Math.max(chartArea.height - valueValue, 0)
      };
    } else {
      throw new Error('not implemented');
      //   return {
      //     x: value0Value + offset,
      //     y: categoryValue + offset,
      //     width: Math.max(value1Value - value0Value, 0),
      //     height: Math.max(bandwidth, 0)
      //   };
    }
  };
}
