import { isNil } from 'lodash-es';

import { useXYChartContext } from './useXYChartContext';

export function usePointAnnotation<Datum extends object>(
  dataKey: string,
  datum: Datum
): { x: number; y: number } | null {
  const { horizontal, scales, renderingOffset, dataEntryStore } = useXYChartContext<Datum>();
  const dataEntry = dataEntryStore.tryGetByDataKey(dataKey);
  if (isNil(dataEntry)) {
    return null;
  }
  const position = dataEntry.getPositionFromOriginalDatum({ datum, scales, horizontal, renderingOffset });
  if (isNil(position)) {
    return null;
  }
  return { x: position.pointX, y: position.pointY };
}
