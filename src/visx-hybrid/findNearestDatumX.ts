import { coerceNumber } from './coerceNumber';
import { findNearestDatumSingleDimension } from './findNearestDatumSingleDimension';
import { getScaleBandwidth } from './getScaleBandwidth';
import type { AxisScale, NearestDatumArgs, NearestDatumReturnType } from './types';

export function findNearestDatumX<Datum extends object>({
  independentScale,
  independentAccessor,
  dependentScale,
  dependentAccessor,
  point,
  data
}: NearestDatumArgs<Datum>): NearestDatumReturnType<Datum> {
  if (!point) {
    return null;
  }

  const nearestDatum = findNearestDatumSingleDimension<AxisScale, Datum>({
    scale: independentScale,
    accessor: independentAccessor,
    scaledValue: point.x,
    data
  });

  const independentBandwidth = getScaleBandwidth(independentScale);
  const dependentBandwidth = getScaleBandwidth(dependentScale);

  if (!nearestDatum) {
    return null;
  }

  const x = coerceNumber(independentScale(independentAccessor(nearestDatum.datum)) ?? 0);
  const y = coerceNumber(dependentScale(dependentAccessor(nearestDatum.datum)) ?? 0);

  return {
    datum: nearestDatum.datum,
    index: nearestDatum.index,
    distanceX: nearestDatum.distance,
    distanceY: Math.abs(y - point.y),
    snapLeft: x + independentBandwidth * 0.5 ?? 0,
    snapTop: y + dependentBandwidth * 0.5 ?? 0
  };
}
