import { findNearestDatumSingleDimension } from './findNearestDatumSingleDimension';
import { getScaleBandwidth } from './getScaleBandwidth';
import type { AxisScale, NearestDatumArgs, NearestDatumReturnType } from './types';

export function findNearestDatumY<Datum extends object>({
  independentScale: scale,
  independentAccessor: accessor,
  dependentScale: xScale,
  dependentAccessor: xAccessor,
  point,
  data
}: NearestDatumArgs<Datum>): NearestDatumReturnType<Datum> {
  if (!point) {
    return null;
  }

  const nearestDatum = findNearestDatumSingleDimension<AxisScale, Datum>({
    scale,
    accessor,
    scaledValue: point.y,
    data
  });

  const xScaleBandwidth = xScale ? getScaleBandwidth(xScale) : 0;
  const yScaleBandwidth = scale ? getScaleBandwidth(scale) : 0;

  return nearestDatum
    ? {
        datum: nearestDatum.datum,
        index: nearestDatum.index,
        distanceY: nearestDatum.distance,
        distanceX: Math.abs(Number(xScale(xAccessor(nearestDatum.datum))) - point.x),
        snapLeft: Number(xScale(xAccessor(nearestDatum.datum))) + xScaleBandwidth / 2 ?? 0,
        snapTop: Number(scale(accessor(nearestDatum.datum))) + yScaleBandwidth / 2 ?? 0
      }
    : null;
}
