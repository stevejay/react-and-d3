import { createScaledValueAccessor, getScaleBaseline, ScaleInput } from '../scale';
import { PositionScale } from '../types';
import { isValidNumber } from '../types/typeguards/isValidNumber';

export function createGlyphSeriesPositioning<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>(
  xScale: XScale,
  yScale: YScale,
  xAccessor: (datum: Datum) => ScaleInput<XScale>,
  yAccessor: (datum: Datum) => ScaleInput<YScale>,
  horizontal: boolean,
  size: number | ((d: Datum) => number),
  renderingOffset: number = 0
) {
  const xScaleCopy = xScale.copy();
  const yScaleCopy = yScale.copy();

  const getScaledX = createScaledValueAccessor(xScaleCopy, xAccessor);
  const getScaledY = createScaledValueAccessor(yScaleCopy, yAccessor);

  const xZeroPosition = xScaleCopy ? getScaleBaseline(xScaleCopy) : 0;
  const yZeroPosition = yScaleCopy ? getScaleBaseline(yScaleCopy) : 0;

  return (datum: Datum) => {
    const x = getScaledX(datum);
    if (!isValidNumber(x)) {
      return null;
    }

    const y = getScaledY(datum);
    if (!isValidNumber(y)) {
      return null;
    }

    const barLength = horizontal ? x - xZeroPosition : y - yZeroPosition;
    if (!isValidNumber(barLength)) {
      return null;
    }

    return {
      x: horizontal ? xZeroPosition + Math.min(0, barLength) : x + renderingOffset,
      y: horizontal ? y + renderingOffset : yZeroPosition + Math.min(0, barLength),
      size: typeof size === 'function' ? size(datum) : size
    };
  };
}
