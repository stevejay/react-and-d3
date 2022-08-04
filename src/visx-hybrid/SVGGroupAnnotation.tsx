import { useMemo } from 'react';
import { scaleBand } from '@visx/scale';
import { isNil } from 'lodash-es';

import { coerceNumber } from './coerceNumber';
import { getScaleBandwidth } from './getScaleBandwidth';
import { getScaleBaseline } from './getScaleBaseline';
import { useDataContext } from './useDataContext';

export interface SVGGroupAnnotationProps<Datum extends object> {
  dataKey: string;
  datum: Datum;
  dataKeys: readonly string[];
  /** Comparator function to sort `dataKeys` within a bar group. By default the DOM rendering order of `BarGroup`s `children` is used. Must be a stable function. */
  sort?: (dataKeyA: string, dataKeyB: string) => number;
  /** Group band scale padding, [0, 1] where 0 = no padding, 1 = no bar. */
  padding?: number;
}

export function SVGGroupAnnotation<Datum extends object>({
  dataKey,
  datum,
  sort,
  dataKeys,
  padding
}: SVGGroupAnnotationProps<Datum>) {
  const { horizontal, independentScale, dependentScale, dataEntries } = useDataContext();

  const groupScale = useMemo(
    () =>
      scaleBand<string>({
        domain: (sort ? [...dataKeys].sort(sort) : dataKeys) as string[],
        range: [0, getScaleBandwidth(independentScale)],
        padding
      }),
    [sort, dataKeys, independentScale, padding]
  );

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

  const withinGroupPosition = groupScale(dataKey) ?? 0;
  const dependentZeroCoord = getScaleBaseline(dependentScale);
  const halfBandwidth = getScaleBandwidth(groupScale) * 0.5;
  const independentCentreCoord = independentCoord + withinGroupPosition + halfBandwidth;
  const dependentCentreCoord = (dependentCoord + dependentZeroCoord) * 0.5;

  const [x, y] = horizontal
    ? [dependentCentreCoord, independentCentreCoord]
    : [independentCentreCoord, dependentCentreCoord];

  return (
    <circle stroke="white" strokeWidth={2} fill="none" cx={x} cy={y} r={7} role="presentation" aria-hidden />
  );
}
