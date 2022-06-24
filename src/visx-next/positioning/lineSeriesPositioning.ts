import { CurveFactory, CurveFactoryLineOnly, curveLinear, line as d3Line } from 'd3-shape';

import { createScaledValueAccessor, ScaleInput } from '../scale';
import { PositionScale } from '../types';
import { isValidNumber } from '../types/typeguards/isValidNumber';

/**
 * This is a workaround for TypeScript not inferring the correct
 * method overload/signature for some d3 shape methods.
 */
function setNumberOrNumberAccessor<NumAccessor>(
  func: (d: number | NumAccessor) => void,
  value: number | NumAccessor
) {
  if (typeof value === 'number') func(value);
  else func(value);
}

export type AccessorForArrayItem<Datum, Output> = (d: Datum, index: number, data: Datum[]) => Output;

export type LinePathConfig<Datum> = {
  /** The defined accessor for the shape. The final line shape includes all points for which this function returns true. By default all points are defined. */
  defined?: AccessorForArrayItem<Datum, boolean>;
  /** Sets the curve factory (from @visx/curve or d3-curve) for the line generator. Defaults to curveLinear. */
  curve?: CurveFactory | CurveFactoryLineOnly;
  /** Sets the x0 accessor function, and sets x1 to null. */
  x?: number | AccessorForArrayItem<Datum, number>;
  /** Sets the y0 accessor function, and sets y1 to null. */
  y?: number | AccessorForArrayItem<Datum, number>;
};

export function line<Datum>({ x, y, defined, curve }: LinePathConfig<Datum> = {}) {
  const path = d3Line<Datum>();
  if (x) {
    setNumberOrNumberAccessor(path.x, x);
  }
  if (y) {
    setNumberOrNumberAccessor(path.y, y);
  }
  if (defined) {
    path.defined(defined);
  }
  if (curve) {
    path.curve(curve);
  }
  return path;
}

export function createLineSeriesPositioning<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>({
  xScale,
  yScale,
  xAccessor,
  yAccessor,
  horizontal,
  curve = curveLinear,
  renderingOffset = 0
}: {
  xScale: XScale;
  yScale: YScale;
  xAccessor: (datum: Datum) => ScaleInput<XScale>;
  yAccessor: (datum: Datum) => ScaleInput<YScale>;
  horizontal: boolean;
  curve?: CurveFactory | CurveFactoryLineOnly;
  renderingOffset?: number;
}) {
  const xScaleCopy = xScale.copy();
  const yScaleCopy = yScale.copy();

  const getScaledX = createScaledValueAccessor(xScaleCopy, xAccessor);
  const getScaledY = createScaledValueAccessor(yScaleCopy, yAccessor);

  const isDefined = (datum: Datum) =>
    isValidNumber(xScale(xAccessor(datum))) && isValidNumber(yScale(yAccessor(datum)));

  //   const xZeroPosition = xScaleCopy ? getScaleBaseline(xScaleCopy) : 0;
  //   const yZeroPosition = yScaleCopy ? getScaleBaseline(yScaleCopy) : 0;

  const path = line<Datum>({ x: getScaledX, y: getScaledY, defined: isDefined, curve });
  return path;

  //   return (datum: Datum) => {
  //     const x = getScaledX(datum);
  //     if (!isValidNumber(x)) {
  //       return null;
  //     }

  //     const y = getScaledY(datum);
  //     if (!isValidNumber(y)) {
  //       return null;
  //     }

  //     // const barLength = horizontal ? x - xZeroPosition : y - yZeroPosition;
  //     // if (!isValidNumber(barLength)) {
  //     //   return null;
  //     // }

  //     return {
  //       x: horizontal ? xZeroPosition + Math.min(0, barLength) : x + renderingOffset,
  //       y: horizontal ? y + renderingOffset : yZeroPosition + Math.min(0, barLength)
  //     };
  //   };
}
