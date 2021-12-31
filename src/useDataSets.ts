import { useState } from 'react';

export function useDataSets<Datum>(dataSets: readonly Datum[][]): readonly [Datum[], () => void] {
  const [dataIndex, setDataIndex] = useState(0);
  const cycleDataIndex = () => setDataIndex((i) => (i === dataSets.length - 1 ? 0 : i + 1));
  const data = dataSets[dataIndex];
  return [data, cycleDataIndex];
}
