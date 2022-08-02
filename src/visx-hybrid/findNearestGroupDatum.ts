// import { ScaleTypeToD3Scale } from '@visx/scale';
import type { ScaleBand } from 'd3-scale';

import { coerceNumber } from './coerceNumber';
import { findNearestDatumX } from './findNearestDatumX';
import { findNearestDatumY } from './findNearestDatumY';
import { NearestDatumArgs, NearestDatumReturnType } from './types';

/**
 * This is a wrapper around findNearestDatumX/Y for BarGroup, accounting for a
 * Bar's group scale offset (which findNearestDatum does not).
 */
export function findNearestGroupDatum<Datum extends object>(
  nearestDatumArgs: NearestDatumArgs<Datum>,
  groupScale: ScaleBand<string>, // ScaleTypeToD3Scale<string, string>['band'],
  horizontal?: boolean
): NearestDatumReturnType<Datum> {
  const { dataKey, independentAccessor, dependentAccessor, independentScale, dependentScale, point } =
    nearestDatumArgs;
  const datum = (horizontal ? findNearestDatumY : findNearestDatumX)(nearestDatumArgs);

  if (!datum || !point) {
    return null;
  }

  const barGroupOffset = groupScale(dataKey);
  const barWidth = groupScale.step();

  if (horizontal) {
    const groupPosition = independentScale(independentAccessor(datum.datum));
    const barStart = (coerceNumber(groupPosition) ?? Infinity) + (barGroupOffset ?? Infinity);
    const barEnd = barStart + barWidth;
    const barMiddle = (barStart + barEnd) / 2;
    const cursorIsOnBar = point.y >= barStart && point.y <= barEnd;
    return {
      ...datum,
      distanceX: 0, // we want all group bars to have same X distance so only Y distance matters
      distanceY: cursorIsOnBar ? 0 : Math.abs(point.y - barMiddle),

      snapLeft: coerceNumber(dependentScale(dependentAccessor(datum.datum))) ?? 0,
      snapTop: barMiddle
    };
  }

  // vertical
  const groupPosition = independentScale(independentAccessor(datum.datum));
  const barStart = (coerceNumber(groupPosition) ?? Infinity) + (barGroupOffset ?? Infinity);
  const barEnd = barStart + barWidth;
  const barMiddle = (barStart + barEnd) / 2;
  const cursorIsOnBar = point.x >= barStart && point.x <= barEnd;
  return {
    ...datum,
    distanceY: 0, // we want all group bars to have same Y distance so only X distance matters
    distanceX: cursorIsOnBar ? 0 : Math.abs(point.x - barMiddle),

    snapLeft: barMiddle,
    snapTop: coerceNumber(dependentScale(dependentAccessor(datum.datum))) ?? 0
  };
}
