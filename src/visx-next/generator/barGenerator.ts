import { AxisScale } from '../axis';
import { createScaledValueAccessor, getScaleBandwidth, getScaleBaseline, ScaleInput } from '../scale';
import { isValidNumber } from '../types/typeguards/isValidNumber';

export function createBarGenerator<XScale extends AxisScale, YScale extends AxisScale, Datum extends object>(
  xScale: XScale,
  yScale: YScale,
  xAccessor: (datum: Datum) => ScaleInput<XScale>,
  yAccessor: (datum: Datum) => ScaleInput<YScale>,
  horizontal: boolean,
  fallbackBandwidth: number,
  offset?: number // TODO how does this relate??
) {
  const xScaleCopy = xScale.copy();
  const yScaleCopy = yScale.copy();

  const getScaledX = createScaledValueAccessor(xScaleCopy, xAccessor);
  const getScaledY = createScaledValueAccessor(yScaleCopy, yAccessor);

  const scaleBandwidth = getScaleBandwidth(horizontal ? yScaleCopy : xScaleCopy);
  const barThickness = scaleBandwidth || fallbackBandwidth;

  const xOffset = horizontal ? 0 : -barThickness / 2;
  const yOffset = horizontal ? -barThickness / 2 : 0;

  const xZeroPosition = xScaleCopy ? getScaleBaseline(xScaleCopy) : 0;
  const yZeroPosition = yScaleCopy ? getScaleBaseline(yScaleCopy) : 0;

  return (datum: Datum) => {
    const x = getScaledX(datum) + xOffset;
    if (!isValidNumber(x)) {
      return null;
    }

    const y = getScaledY(datum) + yOffset;
    if (!isValidNumber(y)) {
      return null;
    }

    const barLength = horizontal ? x - xZeroPosition : y - yZeroPosition;
    if (!isValidNumber(barLength)) {
      return null;
    }

    return {
      x: horizontal ? xZeroPosition + Math.min(0, barLength) : x,
      y: horizontal ? y : yZeroPosition + Math.min(0, barLength),
      width: horizontal ? Math.abs(barLength) : barThickness,
      height: horizontal ? barThickness : Math.abs(barLength)
    };
  };
}
