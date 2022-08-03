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

  if (!nearestDatum) {
    return null;
  }

  const x = Number(dependentScale(dependentAccessor(nearestDatum.datum)));
  const y = Number(independentScale(independentAccessor(nearestDatum.datum)));
  const independentBandwidth = getScaleBandwidth(independentScale);
  const dependentBandwidth = getScaleBandwidth(dependentScale);

  return {
    datum: nearestDatum.datum,
    index: nearestDatum.index,
    distanceY: nearestDatum.distance,
    distanceX: Math.abs(x - point.x),
    snapLeft: x + dependentBandwidth * 0.5 ?? 0,
    snapTop: y + independentBandwidth * 0.5 ?? 0
  };
}
