import { SpringConfig, useTransition } from 'react-spring';

import type { IDatumEntry } from './types';

export function useSeriesTransitions(
  dataEntries: IDatumEntry[],
  springConfig?: Partial<SpringConfig>,
  animate?: boolean
) {
  return useTransition<IDatumEntry, { opacity: number }>(dataEntries, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: springConfig,
    keys: (dataEntry) => dataEntry.dataKey,
    immediate: !animate
  });
}
