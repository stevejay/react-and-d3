import { coerceNumber } from './coerceNumber';
import { findNearestDatumSingleDimension } from './findNearestDatumSingleDimension';
import { getScaleBandwidth } from './getScaleBandwidth';
import type { AxisScale, NearestDatumArgs, NearestDatumReturnType } from './types';

export function findNearestDatumY<Datum extends object>({
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
    scaledValue: point.y,
    data
  });

  const independentBandwidth = getScaleBandwidth(independentScale);
  const dependentBandwidth = getScaleBandwidth(dependentScale);

  if (!nearestDatum) {
    return null;
  }

  const x = coerceNumber(dependentScale(dependentAccessor(nearestDatum.datum)) ?? 0);
  const y = coerceNumber(independentScale(independentAccessor(nearestDatum.datum)) ?? 0);

  return {
    datum: nearestDatum.datum,
    index: nearestDatum.index,
    distanceY: nearestDatum.distance,
    distanceX: Math.abs(x - point.x),
    snapLeft: x + dependentBandwidth * 0.5 ?? 0,
    snapTop: y + independentBandwidth * 0.5 ?? 0
  };
}
