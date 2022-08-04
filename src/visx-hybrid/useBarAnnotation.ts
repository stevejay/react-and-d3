import type { ScaleBand } from 'd3-scale';
import { isNil } from 'lodash-es';

import { coerceNumber } from './coerceNumber';
import { getScaleBandwidth } from './getScaleBandwidth';
import { getScaleBaseline } from './getScaleBaseline';
import { useDataContext } from './useDataContext';

export function useBarAnnotation<Datum extends object>(
  dataKey: string,
  datum: Datum,
  groupScale?: ScaleBand<string>
): { x: number; y: number } | null {
  const { horizontal, independentScale, dependentScale, dataEntries } = useDataContext();
  const dataEntry = dataEntries.find((entry) => entry.dataKey === dataKey);
  if (isNil(dataEntry)) {
    return null;
  }

  if (dataEntry.transformation === 'grouped' && !groupScale) {
    throw new Error('A grouped data entry needs a valid groupScale argument.');
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

  const withinGroupPosition = groupScale ? groupScale(dataKey) ?? 0 : 0;
  const bandwidth = groupScale ? getScaleBandwidth(groupScale) : getScaleBandwidth(independentScale);

  const dependentZeroCoord = getScaleBaseline(dependentScale);
  const isStackDatum = dataEntry.transformation === 'stacked';
  const independentCentreCoord = independentCoord + withinGroupPosition + bandwidth * 0.5;
  const dependentCentreCoord = isStackDatum ? dependentCoord : (dependentCoord + dependentZeroCoord) * 0.5;

  return horizontal
    ? { x: dependentCentreCoord, y: independentCentreCoord }
    : { x: independentCentreCoord, y: dependentCentreCoord };
}
