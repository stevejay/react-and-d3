import { SpringConfig, useTransition } from 'react-spring';

import { createGlyphTransition } from './createGlyphTransition';
import type { GlyphTransition, IDatumEntry, ScaleSet } from './types';

export function useGlyphTransitions<Datum extends object>({
  dataEntry,
  scales,
  horizontal,
  renderingOffset,
  springConfig,
  animate,
  seriesIsLeaving = false,
  getRadius
}: {
  dataEntry: IDatumEntry;
  scales: ScaleSet;
  horizontal: boolean;
  springConfig: Partial<SpringConfig>;
  animate: boolean;
  renderingOffset: number;
  /** Pass `true` if the entire series for the dataEntry is being removed. This will result in the bar not changing position while it fades out. */
  seriesIsLeaving?: boolean;
  getRadius: (datum: Datum) => number;
}) {
  const renderingDataWithRadii = dataEntry
    .getRenderingData()
    .map((datum) => ({ datum, radius: getRadius(datum) }));
  const position = dataEntry.createElementPositionerForRenderingData({ scales, horizontal, renderingOffset });
  return useTransition<{ datum: Datum; radius: number }, GlyphTransition>(renderingDataWithRadii, {
    initial: ({ datum, radius }) => ({ opacity: 1, ...createGlyphTransition(position(datum)), r: radius }),
    from: ({ datum, radius }) => ({ opacity: 0, ...createGlyphTransition(position(datum)), r: radius }),
    enter: ({ datum, radius }) => ({ opacity: 1, ...createGlyphTransition(position(datum)), r: radius }),
    update: ({ datum, radius }) =>
      seriesIsLeaving ? { opacity: 1 } : { opacity: 1, ...createGlyphTransition(position(datum)), r: radius },
    leave: ({ radius }) => ({ opacity: 0, r: radius }),
    config: springConfig,
    keys: ({ datum }) => dataEntry.keyAccessorForRenderingData(datum),
    immediate: !animate
  });
}
