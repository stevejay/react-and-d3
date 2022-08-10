import type { AxisScale } from '@visx/axis';
import { getFirstItem, getSecondItem } from '@visx/shape/lib/util/accessors';

import { findNearestDatumX } from './findNearestDatumX';
import { findNearestDatumY } from './findNearestDatumY';
import { getScaleBandwidth } from './getScaleBandwidth';
import { isDefined } from './isDefined';
import type { NearestDatumArgs, NearestDatumReturnType, StackDatum } from './types';

/**
 * This is a wrapper around findNearestDatumX/Y for BarStack, accounting for a
 * Bar's d0 and d1, not just d1 (which findNearestDatum uses). Additionally,
 * returns the BarSeries original `Datum`, not the `StackDatum` so
 * Tooltip typing is correct.
 */
export default function findNearestStackDatum<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(
  nearestDatumArgs: NearestDatumArgs<StackDatum<IndependentScale, DependentScale, Datum>>,
  originalData: readonly Datum[],
  horizontal?: boolean
): NearestDatumReturnType<Datum> | null {
  const { independentAccessor, dependentAccessor, independentScale, dependentScale, point } =
    nearestDatumArgs;
  if (!point) {
    return null;
  }

  // Get the nearest stack datum.
  const nearestDatumResult = (horizontal ? findNearestDatumY : findNearestDatumX)(nearestDatumArgs);
  if (!nearestDatumResult) {
    return null;
  }

  const originalDatum = isDefined(nearestDatumResult.index) ? originalData[nearestDatumResult.index] : null;
  if (!originalDatum) {
    return null;
  }

  const xScale = horizontal ? dependentScale : independentScale;
  const yScale = horizontal ? independentScale : dependentScale;
  const xAccessor = horizontal ? dependentAccessor : independentAccessor;
  const yAccessor = horizontal ? independentAccessor : dependentAccessor;

  return {
    index: nearestDatumResult.index,
    datum: originalDatum,
    distanceX: horizontal // if mouse is ON the stack series, set 0 distance
      ? point.x >= (xScale(getFirstItem(nearestDatumResult.datum)) ?? Infinity) &&
        point.x <= (xScale(getSecondItem(nearestDatumResult.datum)) ?? -Infinity)
        ? 0
        : nearestDatumResult.distanceX
      : nearestDatumResult.distanceX,
    distanceY: horizontal
      ? nearestDatumResult.distanceY // if mouse is ON the stack series, set 0 distance
      : point.y <= (yScale(getFirstItem(nearestDatumResult.datum)) ?? -Infinity) &&
        point.y >= (yScale(getSecondItem(nearestDatumResult.datum)) ?? Infinity)
      ? 0
      : nearestDatumResult.distanceY,
    snapLeft: Number(xScale(xAccessor(nearestDatumResult.datum))) + getScaleBandwidth(xScale) / 2 ?? 0,
    snapTop: Number(yScale(yAccessor(nearestDatumResult.datum))) + getScaleBandwidth(yScale) / 2 ?? 0
  };
}
