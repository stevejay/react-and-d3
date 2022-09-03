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

  if (!nearestDatum) {
    return null;
  }

  const x = Number(independentScale(independentAccessor(nearestDatum.datum)));
  const y = Number(dependentScale(dependentAccessor(nearestDatum.datum)));
  const independentBandwidth = getScaleBandwidth(independentScale);
  const dependentBandwidth = getScaleBandwidth(dependentScale);

  return {
    datum: nearestDatum.datum,
    index: nearestDatum.index,
    distanceX: nearestDatum.distance,
    distanceY: Math.abs(y - point.y),
    snapLeft: x + independentBandwidth * 0.5 ?? 0,
    snapTop: y + dependentBandwidth * 0.5 ?? 0
  };
}
