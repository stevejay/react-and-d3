import { AxisScale } from '@visx/axis';
import { getFirstItem, getSecondItem } from '@visx/shape/lib/util/accessors';

import { findNearestDatumX } from './findNearestDatumX';
import { findNearestDatumY } from './findNearestDatumY';
import { getScaleBandwidth } from './getScaleBandwidth';
import { NearestDatumArgs, StackDatum } from './types';

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
  seriesData: readonly Datum[],
  horizontal?: boolean
) {
  const { independentAccessor, dependentAccessor, independentScale, dependentScale, point } =
    nearestDatumArgs;

  if (!point) {
    return null;
  }

  const datum = (horizontal ? findNearestDatumY : findNearestDatumX)(nearestDatumArgs);
  const seriesDatum = datum?.index == null ? null : seriesData[datum.index];

  const xScale = horizontal ? dependentScale : independentScale;
  const yScale = horizontal ? independentScale : dependentScale;
  const xAccessor = horizontal ? dependentAccessor : independentAccessor;
  const yAccessor = horizontal ? independentAccessor : dependentAccessor;

  return datum && seriesDatum
    ? {
        index: datum.index,
        datum: seriesDatum,
        distanceX: horizontal // if mouse is ON the stack series, set 0 distance
          ? point.x >= (xScale(getFirstItem(datum.datum)) ?? Infinity) &&
            point.x <= (xScale(getSecondItem(datum.datum)) ?? -Infinity)
            ? 0
            : datum.distanceX
          : datum.distanceX,
        distanceY: horizontal
          ? datum.distanceY // if mouse is ON the stack series, set 0 distance
          : point.y <= (yScale(getFirstItem(datum.datum)) ?? -Infinity) &&
            point.y >= (yScale(getSecondItem(datum.datum)) ?? Infinity)
          ? 0
          : datum.distanceY,

        stackDatum: datum.datum, // Added by me

        snapLeft: Number(xScale(xAccessor(datum.datum))) + getScaleBandwidth(xScale) / 2 ?? 0,
        snapTop: Number(yScale(yAccessor(datum.datum))) + getScaleBandwidth(yScale) / 2 ?? 0
      }
    : null;
}
