import type { ScaleBand } from 'd3-scale';

import { coerceNumber } from './coerceNumber';
import { findNearestDatumX } from './findNearestDatumX';
import { findNearestDatumY } from './findNearestDatumY';
import { NearestDatumArgs, NearestDatumReturnType } from './types';

/**
 * This is a wrapper around findNearestDatumX/Y for BarGroup, accounting for a
 * Bar's group scale offset (which findNearestOriginalDatum does not).
 */
export function findNearestGroupDatum<Datum extends object>(
  nearestDatumArgs: NearestDatumArgs<Datum>,
  groupScale: ScaleBand<string>,
  horizontal?: boolean
): NearestDatumReturnType<Datum> {
  const { dataKey, independentAccessor, dependentAccessor, independentScale, dependentScale, point } =
    nearestDatumArgs;
  if (!point) {
    return null;
  }

  const datum = (horizontal ? findNearestDatumY : findNearestDatumX)(nearestDatumArgs);
  if (!datum) {
    return null;
  }

  const groupPosition = independentScale(independentAccessor(datum.datum));
  const barGroupOffset = groupScale(dataKey);
  const barStart = (coerceNumber(groupPosition) ?? Infinity) + (barGroupOffset ?? Infinity);
  const barWidth = groupScale.step();
  const barEnd = barStart + barWidth;
  const barMiddle = (barStart + barEnd) * 0.5;

  if (horizontal) {
    const cursorIsOnBar = point.y >= barStart && point.y <= barEnd;
    return {
      ...datum,
      distanceX: 0, // we want all group bars to have same X distance so only Y distance matters
      distanceY: cursorIsOnBar ? 0 : Math.abs(point.y - barMiddle),
      snapLeft: coerceNumber(dependentScale(dependentAccessor(datum.datum))) ?? 0,
      snapTop: barMiddle
    };
  } else {
    const cursorIsOnBar = point.x >= barStart && point.x <= barEnd;
    return {
      ...datum,
      distanceY: 0, // we want all group bars to have same Y distance so only X distance matters
      distanceX: cursorIsOnBar ? 0 : Math.abs(point.x - barMiddle),
      snapLeft: barMiddle,
      snapTop: coerceNumber(dependentScale(dependentAccessor(datum.datum))) ?? 0
    };
  }
}
