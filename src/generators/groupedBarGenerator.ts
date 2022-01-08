import { isNil } from 'lodash-es';

import type { AxisScale, ChartArea, ChartOrientation, DomainValue, Rect } from '@/types';

export function createGroupedBarGenerator<CategoryT extends DomainValue>(
  seriesScale: AxisScale<string>,
  valueScale: AxisScale<number>,
  chartArea: ChartArea,
  orientation: ChartOrientation,
  offset: number
) {
  const clonedSeriesScale = seriesScale.copy();
  const clonedValueScale = valueScale.copy();

  return (seriesKey: string, value: number): Rect | null => {
    const seriesValue = clonedSeriesScale(seriesKey);
    const valueValue = clonedValueScale(value);
    const bandwidth = clonedSeriesScale.bandwidth?.();

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
      return {
        x: offset,
        y: seriesValue + offset,
        width: Math.max(valueValue, 0),
        height: Math.max(bandwidth, 0)
      };
    }
  };
}
