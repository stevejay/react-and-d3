import { SpringConfig, useTransition } from 'react-spring';

import type { AxisScale, DataEntry } from './types';

export function useSeriesTransitions<IndependentScale extends AxisScale, DependentScale extends AxisScale>(
  data: DataEntry<IndependentScale, DependentScale>[],
  springConfig?: Partial<SpringConfig>,
  animate?: boolean
) {
  return useTransition<DataEntry<IndependentScale, DependentScale>, { opacity: number }>(data, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: springConfig,
    keys: (d) => d.dataKey,
    immediate: !animate
  });
}
