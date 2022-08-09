import { isNil } from 'lodash-es';

import { coerceNumber } from './coerceNumber';
import { getScaleBandwidth } from './getScaleBandwidth';
import { useXYChartContext } from './useXYChartContext';

export interface SVGStackAnnotationProps<Datum extends object> {
  dataKey: string;
  datum: Datum;
}

// TODO remove.
export function SVGStackAnnotation<Datum extends object>({ dataKey, datum }: SVGStackAnnotationProps<Datum>) {
  const { horizontal, independentScale, dependentScale, dataEntries } = useXYChartContext();
  const dataEntry = dataEntries.find((entry) => entry.dataKey === dataKey);
  if (isNil(dataEntry)) {
    return null;
  }

  const { independentAccessor, dependentAccessor, data } = dataEntry;
  const matchingDatum = data.find((d) => dataEntry.underlyingDatumAccessor(d) === datum);
  if (isNil(matchingDatum)) {
    return null;
  }

  const independentCoord = coerceNumber(independentScale(independentAccessor(matchingDatum)));
  const dependentCoord = coerceNumber(dependentScale(dependentAccessor(matchingDatum)));
  if (isNil(independentCoord) || isNil(dependentCoord)) {
    return null;
  }

  const halfBandwidth = getScaleBandwidth(independentScale) * 0.5;
  const [x, y] = horizontal
    ? [dependentCoord, independentCoord + halfBandwidth]
    : [independentCoord + halfBandwidth, dependentCoord];

  return (
    <circle stroke="white" strokeWidth={2} fill="none" cx={x} cy={y} r={7} role="presentation" aria-hidden />
  );
}
