import {
  createScaledValueAccessor,
  getScaleBandwidth,
  getScaleBaseline,
  ScaleInput
} from '@/visx-next/scale';
import { PositionScale } from '@/visx-next/types';
import { isValidNumber } from '@/visx-next/types/typeguards/isValidNumber';

// Defines polygons such that it animates correctly through zero when
// transitioning from positive to negative, or vice versa.
export function createBarSeriesPolygonPositioning<
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
    const xRaw = getScaledX(datum) + xOffset;
    if (!isValidNumber(xRaw)) {
      return null;
    }

    const yRaw = getScaledY(datum) + yOffset;
    if (!isValidNumber(yRaw)) {
      return null;
    }

    const barLength = horizontal ? xRaw - xZeroPosition : yRaw - yZeroPosition;
    if (!isValidNumber(barLength)) {
      return null;
    }

    const x = horizontal ? xZeroPosition + Math.min(0, barLength) : xRaw + renderingOffset;
    const y = horizontal ? yRaw + renderingOffset : yZeroPosition + Math.min(0, barLength);
    const width = horizontal ? Math.abs(barLength) : barThickness;
    const height = horizontal ? barThickness : Math.abs(barLength);

    // Default values are for bar that is horizontal & negative:
    let x1 = x;
    let y1 = y;
    let x2 = x + width;
    let y2 = y + height;

    if (horizontal) {
      if (barLength >= 0) {
        // positive
        x1 = x + width;
        y1 = y;
        x2 = x;
        y2 = y + height;
      }
    } else {
      // vertical
      if (barLength > 0) {
        // negative
        x1 = x;
        y1 = y + height;
        x2 = x + width;
        y2 = y;
      } else {
        // positive
        x1 = x;
        y1 = y;
        x2 = x + width;
        y2 = y + height;
      }
    }

    return { x1, y1, x2, y2, width, height, points: `${x1},${y1} ${x2},${y1} ${x2},${y2} ${x1},${y2}` };
  };
}
