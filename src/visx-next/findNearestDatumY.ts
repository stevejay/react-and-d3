import { AxisScale } from '@visx/axis';

import { findNearestDatumSingleDimension } from './findNearestDatumSingleDimension';
import { getScaleBandwidth } from './scale';
import { NearestDatumArgs, NearestDatumReturnType } from './types';

export function findNearestDatumY<XScale extends AxisScale, YScale extends AxisScale, Datum extends object>({
  yScale: scale,
  yAccessor: accessor,
  xScale,
  xAccessor,
  point,
  data
}: NearestDatumArgs<XScale, YScale, Datum>): NearestDatumReturnType<Datum> {
  if (!point) return null;

  const nearestDatum = findNearestDatumSingleDimension<YScale, Datum>({
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
