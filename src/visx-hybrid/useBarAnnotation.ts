import { isNil } from 'lodash-es';

import { useXYChartContext } from './useXYChartContext';

export function useBarAnnotation<Datum extends object>(
  dataKey: string,
  datum: Datum
): { x: number; y: number } | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { horizontal, scales, renderingOffset, dataEntryStore } = useXYChartContext<Datum, any>();
  const dataEntry = dataEntryStore.tryGetByDataKey(dataKey);
  if (isNil(dataEntry)) {
    return null;
  }
  const position = dataEntry.getPositionForOriginalDatum({ datum, scales, horizontal, renderingOffset });
  if (isNil(position)) {
    return null;
  }
  return {
    x: position.baselineX + (position.datumX - position.baselineX) * 0.5,
    y: position.baselineY + (position.datumY - position.baselineY) * 0.5
  };
}
