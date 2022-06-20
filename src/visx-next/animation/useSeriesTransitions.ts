import { SpringConfig, useTransition } from 'react-spring';

import { DataRegistryEntry, PositionScale } from '../types';

export function useSeriesTransitions<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>(data: DataRegistryEntry<XScale, YScale, Datum>[], springConfig?: Partial<SpringConfig>, animate?: boolean) {
  return useTransition<DataRegistryEntry<XScale, YScale, Datum>, { opacity: number }>(data, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: springConfig,
    keys: (d) => d.key,
    immediate: !animate
  });
}
