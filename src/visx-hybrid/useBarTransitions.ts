import { SpringConfig, useTransition } from 'react-spring';

import { createPolygonTransition } from './createPolygonTransition';
import type { IDatumEntry, PolygonTransitionsProps, ScaleSet } from './types';

export function useBarTransitions<Datum extends object>({
  dataEntry,
  scales,
  horizontal,
  renderingOffset,
  springConfig,
  animate,
  seriesIsLeaving = false
}: {
  dataEntry: IDatumEntry;
  scales: ScaleSet;
  horizontal: boolean;
  springConfig: Partial<SpringConfig>;
  animate: boolean;
  renderingOffset: number;
  /** Pass `true` if the entire series for the dataEntry is being removed. This will result in the bar not changing position while it fades out. */
  seriesIsLeaving?: boolean;
}) {
  const position = dataEntry.createDatumPositioner({ scales, horizontal, renderingOffset });
  return useTransition<Datum, PolygonTransitionsProps>(dataEntry.data, {
    initial: (datum) => ({ opacity: 1, ...createPolygonTransition(position(datum)) }),
    from: (datum) => ({ opacity: 0, ...createPolygonTransition(position(datum)) }),
    enter: (datum) => ({ opacity: 1, ...createPolygonTransition(position(datum)) }),
    update: (datum) =>
      seriesIsLeaving ? { opacity: 1 } : { opacity: 1, ...createPolygonTransition(position(datum)) },
    leave: () => ({ opacity: 0 }),
    config: springConfig,
    keys: dataEntry.keyAccessor,
    immediate: !animate
  });
}
