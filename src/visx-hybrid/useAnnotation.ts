import { isNil } from 'lodash-es';

import { coerceNumber } from './coerceNumber';
import { getScaleBandwidth } from './getScaleBandwidth';
import { getScaleBaseline } from './getScaleBaseline';
import { useDataContext } from './useDataContext';

export function useAnnotation<Datum extends object>(
  dataKey: string,
  datum: Datum
): { x: number; y: number } | null {
  const { horizontal, independentScale, dependentScale, dataEntries } = useDataContext();
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
  const dependentZeroCoord = getScaleBaseline(dependentScale);
  const isStackDatum = dataEntry.transformation === 'stacked';
  const independentCentreCoord = independentCoord + halfBandwidth;
  const dependentCentreCoord = isStackDatum ? dependentCoord : (dependentCoord + dependentZeroCoord) * 0.5;

  return horizontal
    ? { x: dependentCentreCoord, y: independentCentreCoord }
    : { x: independentCentreCoord, y: dependentCentreCoord };
}
