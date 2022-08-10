import { SpringConfig, useTransition } from 'react-spring';

import type { IDataEntry } from './types';

export function useSeriesTransitions<Datum extends object, RenderingDatum extends object>(
  dataEntries: IDataEntry<Datum, RenderingDatum>[],
  springConfig?: Partial<SpringConfig>,
  animate?: boolean
) {
  return useTransition<IDataEntry<Datum, RenderingDatum>, { opacity: number }>(dataEntries, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: springConfig,
    keys: (dataEntry) => dataEntry.dataKey,
    immediate: !animate
  });
}
