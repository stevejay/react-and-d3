import { SpringConfig, useTransition } from 'react-spring';

import type { IDataEntry } from './types';

export function useSeriesTransitions(
  dataEntries: IDataEntry[],
  springConfig?: Partial<SpringConfig>,
  animate?: boolean
) {
  return useTransition<IDataEntry, { opacity: number }>(dataEntries, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: springConfig,
    keys: (dataEntry) => dataEntry.dataKey,
    immediate: !animate
  });
}
