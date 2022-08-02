import type { SeriesPoint } from 'd3-shape';

import { getStackValue } from '../combineBarStackData';
import { getFirstItem, getSecondItem } from '../getItem';
import { getScaleBandwidth } from '../scale';
import { PositionScale, StackDataWithSums } from '../types';
import { isValidNumber } from '../types/typeguards/isValidNumber';

export function createBarStackPositioning<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>(xScale: XScale, yScale: YScale, horizontal: boolean, _renderingOffset = 0) {
  type StackBar = SeriesPoint<StackDataWithSums<XScale, YScale, Datum>>;

  const xScaleCopy = xScale.copy();
  const yScaleCopy = yScale.copy();

  const barThickness = getScaleBandwidth(horizontal ? yScaleCopy : xScaleCopy);
  const halfBarThickness = barThickness * 0.5;

  let getWidth: (bar: StackBar) => number | undefined;
  let getHeight: (bar: StackBar) => number | undefined;
  let getX: (bar: StackBar) => number | undefined;
  let getY: (bar: StackBar) => number | undefined;

  if (horizontal) {
    getWidth = (bar) => (xScaleCopy(getSecondItem(bar)) ?? NaN) - (xScaleCopy(getFirstItem(bar)) ?? NaN);
    getHeight = () => barThickness;
    getX = (bar) => xScaleCopy(getFirstItem(bar));
    getY = (bar) =>
      'bandwidth' in yScaleCopy
        ? yScaleCopy(getStackValue(bar.data)) /* + renderingOffset */
        : Math.max((yScaleCopy(getStackValue(bar.data)) ?? NaN) - halfBarThickness) /* + renderingOffset */;
  } else {
    getWidth = () => barThickness;
    getHeight = (bar) => (yScaleCopy(getFirstItem(bar)) ?? NaN) - (yScaleCopy(getSecondItem(bar)) ?? NaN);
    getX = (bar) =>
      'bandwidth' in xScaleCopy
        ? xScaleCopy(getStackValue(bar.data)) /* + renderingOffset */
        : Math.max((xScaleCopy(getStackValue(bar.data)) ?? NaN) - halfBarThickness) /* + renderingOffset */;
    getY = (bar) => yScaleCopy(getSecondItem(bar));
  }

  return (value: SeriesPoint<StackDataWithSums<XScale, YScale, Datum>>, _dataKey: string) => {
    const barX = getX(value);
    if (!isValidNumber(barX)) {
      return null;
    }

    const barY = getY(value);
    if (!isValidNumber(barY)) {
      return null;
    }

    const barWidth = getWidth(value);
    if (!isValidNumber(barWidth)) {
      return null;
    }

    const barHeight = getHeight(value);
    if (!isValidNumber(barHeight)) {
      return null;
    }

    return {
      x: barX,
      y: barY,
      width: barWidth,
      height: barHeight
    };
  };
}
