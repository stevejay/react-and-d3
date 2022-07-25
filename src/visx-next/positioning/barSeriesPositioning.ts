import { createScaledValueAccessor, getScaleBandwidth, getScaleBaseline, ScaleInput } from '../scale';
import { PositionScale } from '../types';
import { isValidNumber } from '../types/typeguards/isValidNumber';

// import { GridScale } from '../types';

// export function getScaleBandwidth<Output>(scale: D3Scale<Output, any, any>) {
//   return 'bandwidth' in scale ? scale.bandwidth() : 0;
// }

export function createBarSeriesPositioning<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>(
  xScale: XScale,
  yScale: YScale,
  xAccessor: (datum: Datum) => ScaleInput<XScale>,
  yAccessor: (datum: Datum) => ScaleInput<YScale>,
  horizontal: boolean,
  renderingOffset = 0
) {
  const xScaleCopy = xScale.copy();
  const yScaleCopy = yScale.copy();

  const getScaledX = createScaledValueAccessor(xScaleCopy, xAccessor);
  const getScaledY = createScaledValueAccessor(yScaleCopy, yAccessor);

  const barThickness = getScaleBandwidth(horizontal ? yScaleCopy : xScaleCopy);

  const xOffset = horizontal ? 0 : -barThickness * 0.5;
  const yOffset = horizontal ? -barThickness * 0.5 : 0;

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

    const x1 = horizontal ? xZeroPosition + Math.min(0, barLength) : x + renderingOffset;
    const y1 = horizontal ? y + renderingOffset : yZeroPosition + Math.min(0, barLength);
    const width = horizontal ? Math.abs(barLength) : barThickness;
    const height = horizontal ? barThickness : Math.abs(barLength);

    return {
      x: x1,
      y: y1,
      x2: x1 + width,
      y2: y1 + height,
      width,
      height
    };
  };
}
