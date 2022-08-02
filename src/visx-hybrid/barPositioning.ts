import type { ScaleBand } from 'd3-scale';

import { coerceNumber } from './coerceNumber';
import { getFirstItem, getSecondItem } from './getItem';
import { getScaleBandwidth } from './getScaleBandwidth';
import { getScaleBaseline } from './getScaleBaseline';
import { getStackValue } from './getStackValue';
import { isValidNumber } from './isValidNumber';
import type { AxisScale, PolygonTransitionsProps, ScaleInput, StackDatum } from './types';

export function createBarStackSeriesPolygonPositioning<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>({
  independentScale,
  dependentScale,
  horizontal,
  renderingOffset
}: {
  independentScale: IndependentScale;
  dependentScale: DependentScale;
  horizontal: boolean;
  renderingOffset: number;
}) {
  type StackDatumType = StackDatum<IndependentScale, DependentScale, Datum>;

  const independentScaleCopy = independentScale.copy();
  const dependentScaleCopy = dependentScale.copy();

  return createPolygonPositionCallback({
    getIndependentCoord: (d: StackDatumType) => coerceNumber(independentScaleCopy(getStackValue(d.data))),
    getFirstDependentCoord: (d: StackDatumType) => coerceNumber(dependentScaleCopy(getFirstItem(d))),
    getSecondDependentCoord: (d: StackDatumType) => coerceNumber(dependentScaleCopy(getSecondItem(d))),
    horizontal,
    bandwidth: getScaleBandwidth(independentScaleCopy),
    renderingOffset
  });
}

export function createBarGroupSeriesPolygonPositioning<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>({
  dataKey,
  independentScale,
  dependentScale,
  independentAccessor,
  dependentAccessor,
  groupScale,
  horizontal,
  renderingOffset
}: {
  dataKey: string;
  independentScale: IndependentScale;
  dependentScale: DependentScale;
  independentAccessor: (datum: Datum) => ScaleInput<IndependentScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<DependentScale>;
  groupScale: ScaleBand<string>;
  horizontal: boolean;
  renderingOffset: number;
}) {
  const independentScaleCopy = independentScale.copy();
  const dependentScaleCopy = dependentScale.copy();

  const groupScaleCopy = groupScale.copy();
  const withinGroupPosition = groupScaleCopy(dataKey) ?? 0;
  const dependentZeroCoord = getScaleBaseline(dependentScaleCopy);

  return createPolygonPositionCallback({
    getIndependentCoord: (d: Datum) =>
      (coerceNumber(independentScaleCopy(independentAccessor(d))) ?? 0) + withinGroupPosition,
    getFirstDependentCoord: () => dependentZeroCoord,
    getSecondDependentCoord: (d: Datum) => coerceNumber(dependentScaleCopy(dependentAccessor(d))),
    horizontal,
    bandwidth: getScaleBandwidth(groupScaleCopy),
    renderingOffset
  });
}

// Defines polygons such that it animates correctly through zero when
// transitioning from positive to negative, or vice versa.
export function createBarSeriesPolygonPositioning<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>({
  independentScale,
  dependentScale,
  independentAccessor,
  dependentAccessor,
  horizontal,
  renderingOffset
}: {
  independentScale: IndependentScale;
  dependentScale: DependentScale;
  independentAccessor: (datum: Datum) => ScaleInput<IndependentScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<DependentScale>;
  horizontal: boolean;
  renderingOffset: number;
}) {
  const independentScaleCopy = independentScale.copy();
  const dependentScaleCopy = dependentScale.copy();

  const dependentZeroCoord = getScaleBaseline(dependentScaleCopy);

  return createPolygonPositionCallback({
    getIndependentCoord: (d: Datum) => coerceNumber(independentScaleCopy(independentAccessor(d))),
    getFirstDependentCoord: () => dependentZeroCoord,
    getSecondDependentCoord: (d: Datum) => coerceNumber(dependentScaleCopy(dependentAccessor(d))),
    horizontal,
    bandwidth: getScaleBandwidth(independentScaleCopy),
    renderingOffset
  });
}

function createPolygonPositionCallback<Datum extends object>({
  getIndependentCoord,
  getFirstDependentCoord,
  getSecondDependentCoord,
  horizontal,
  bandwidth,
  renderingOffset
}: {
  getIndependentCoord: (d: Datum) => number | undefined;
  getFirstDependentCoord: (d: Datum) => number | undefined;
  getSecondDependentCoord: (d: Datum) => number | undefined;
  horizontal: boolean;
  bandwidth: number;
  renderingOffset: number;
}): (datum: Datum) => Omit<PolygonTransitionsProps, 'opacity'> | null {
  return (datum: Datum) => {
    // Start coord of the bar on the independent axis.
    const independentRangeValue = getIndependentCoord(datum);
    if (!isValidNumber(independentRangeValue)) {
      // console.log('failed independentRangeValue', datum, getIndependentCoord);
      return null;
    }

    // Coord of the bar's origin value on the dependent axis.
    const firstDependentRangeValue = getFirstDependentCoord(datum);
    if (!isValidNumber(firstDependentRangeValue)) {
      return null;
    }

    // Coord of the bar's value on the dependent axis.
    const secondDependentRangeValue = getSecondDependentCoord(datum);
    if (!isValidNumber(secondDependentRangeValue)) {
      return null;
    }

    // Length of the bar relative to the coord of zero (or equivalent) on the dependent axis.
    const barLengthWithSign = secondDependentRangeValue - firstDependentRangeValue;
    if (!isValidNumber(barLengthWithSign)) {
      return null;
    }

    const independentOrigin = independentRangeValue + renderingOffset;
    const dependentOrigin = firstDependentRangeValue + Math.min(0, barLengthWithSign);
    const independentSideLength = bandwidth;
    const dependentSideLength = Math.abs(barLengthWithSign);

    let x1 = horizontal ? dependentOrigin : independentOrigin;
    let y1 = horizontal ? independentOrigin : dependentOrigin;
    const width = horizontal ? dependentSideLength : independentSideLength;
    const height = horizontal ? independentSideLength : dependentSideLength;
    let x2 = x1 + width;
    let y2 = y1 + height;

    if (horizontal) {
      if (barLengthWithSign >= 0) {
        [x1, x2] = [x2, x1];
      }
    } else {
      if (barLengthWithSign > 0) {
        [y1, y2] = [y2, y1];
      }
    }

    return { x1, y1, x2, y2, width, height, points: `${x1},${y1} ${x2},${y1} ${x2},${y2} ${x1},${y2}` };
  };
}
