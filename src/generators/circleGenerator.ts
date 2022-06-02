import { isNil } from 'lodash-es';

import { AxisScale, PointDatum } from '@/types';

export function createCircleGenerator<DatumT>(
  xScale: AxisScale<number>,
  yScale: AxisScale<number>,
  renderingOffset: number = 0
) {
  const clonedXScale = xScale.copy();
  const clonedYScale = yScale.copy();

  return (datum: PointDatum<DatumT>): { cx: number; cy: number } | null => {
    const xValue = clonedXScale(datum.x);
    const yValue = clonedYScale(datum.y);

    if (isNil(xValue) || isNil(yValue) || !isFinite(xValue) || !isFinite(yValue)) {
      return null;
    }

    return {
      cx: xValue + renderingOffset,
      cy: yValue + renderingOffset
    };
  };
}
