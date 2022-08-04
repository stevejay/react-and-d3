import { isNil } from 'lodash-es';

import { coerceNumber } from './coerceNumber';
import { getScaleBandwidth } from './getScaleBandwidth';
// import type { AxisScale, ScaleInput } from './types';
import { useDataContext } from './useDataContext';

export interface SVGAnnotationProps<
  // IndependentScale extends AxisScale,
  // DependentScale extends AxisScale,
  Datum extends object
> {
  dataKey: string;
  datum: Datum;
  // keyAccessor: (datum: Datum, dataKey?: string) => string;
}

export function SVGAnnotation<
  // IndependentScale extends AxisScale,
  // DependentScale extends AxisScale,
  Datum extends object
>({
  dataKey,
  datum
}: // keyAccessor,
SVGAnnotationProps<Datum>) {
  const { horizontal, independentScale, dependentScale, dataEntries } = useDataContext();
  const dataEntry = dataEntries.find((entry) => entry.dataKey === dataKey);
  if (isNil(dataEntry)) {
    return null;
  }
  const { independentAccessor, dependentAccessor, data } = dataEntry;
  const stackDatum = data.find((d) => d.data.__datum__ === datum);
  if (isNil(stackDatum)) {
    return null;
  }

  const independentCoord = coerceNumber(independentScale(independentAccessor(stackDatum)));
  const dependentCoord = coerceNumber(dependentScale(dependentAccessor(stackDatum)));
  if (isNil(independentCoord) || isNil(dependentCoord)) {
    return null;
  }

  const halfBandwidth = getScaleBandwidth(independentScale) * 0.5;
  const [x, y] = horizontal
    ? [dependentCoord, independentCoord + halfBandwidth]
    : [independentCoord + halfBandwidth, dependentCoord];

  return <circle fill="white" cx={x} cy={y} r={7} role="presentation" aria-hidden />;
}
