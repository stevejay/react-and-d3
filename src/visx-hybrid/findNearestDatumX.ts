import { findNearestDatumSingleDimension } from './findNearestDatumSingleDimension';
import { getScaleBandwidth } from './getScaleBandwidth';
import type { AxisScale, NearestDatumArgs, NearestDatumReturnType } from './types';

export function findNearestDatumX<Datum extends object>({
  independentScale: scale,
  independentAccessor: accessor,
  dependentScale: yScale,
  dependentAccessor: yAccessor,
  point,
  data
}: NearestDatumArgs<Datum>): NearestDatumReturnType<Datum> {
  if (!point) {
    return null;
  }

  const nearestDatum = findNearestDatumSingleDimension<AxisScale, Datum>({
    scale,
    accessor,
    scaledValue: point.x,
    data
  });

  const xScaleBandwidth = scale ? getScaleBandwidth(scale) : 0;
  const yScaleBandwidth = yScale ? getScaleBandwidth(yScale) : 0;

  return nearestDatum
    ? {
        datum: nearestDatum.datum,
        index: nearestDatum.index,
        distanceX: nearestDatum.distance,
        distanceY: Math.abs(Number(yScale(yAccessor(nearestDatum.datum))) - point.y),
        snapLeft: Number(scale(accessor(nearestDatum.datum))) + xScaleBandwidth / 2 ?? 0,
        snapTop: Number(yScale(yAccessor(nearestDatum.datum))) + yScaleBandwidth / 2 ?? 0
      }
    : null;
}
