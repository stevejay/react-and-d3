import { isNil } from 'lodash-es';

import { AxisScale, ChartArea, ChartOrientation, DomainValue, Rect } from '@/types';

export function createGroupedBarGenerator<CategoryT extends DomainValue>(
  seriesScale: AxisScale<string>,
  valueScale: AxisScale<number>,
  chartArea: ChartArea,
  orientation: ChartOrientation,
  renderingOffset: number
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
        x: seriesValue + renderingOffset,
        y: valueValue + renderingOffset,
        width: Math.max(bandwidth, 0),
        height: Math.max(chartArea.height - valueValue, 0)
      };
    } else {
      return {
        x: renderingOffset,
        y: seriesValue + renderingOffset,
        width: Math.max(valueValue, 0),
        height: Math.max(bandwidth, 0)
      };
    }
  };
}
