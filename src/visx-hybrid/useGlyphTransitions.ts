import { SpringConfig, useTransition } from 'react-spring';

import { createBarPositionerForRenderingData } from './createBarPositionerForRenderingData';
import { createGlyphTransition } from './createGlyphTransition';
import type { GlyphTransition, IDataEntry, ScaleSet } from './types';

export function useGlyphTransitions<Datum extends object, RenderingDatum extends object>({
  dataEntry,
  scales,
  horizontal,
  springConfig,
  animate,
  glyphSize
}: {
  dataEntry: IDataEntry<Datum, RenderingDatum>;
  scales: ScaleSet;
  horizontal: boolean;
  springConfig: Partial<SpringConfig>;
  animate: boolean;
  renderingOffset: number;
  glyphSize: number | ((datum: RenderingDatum, dataKey: string) => number);
}) {
  const renderingDataWithRadii = dataEntry.getRenderingData().map((datum) => ({
    datum,
    size: typeof glyphSize === 'function' ? glyphSize(datum, dataEntry.dataKey) : glyphSize
  }));
  const position = createBarPositionerForRenderingData(scales, dataEntry, horizontal);
  return useTransition<{ datum: RenderingDatum; size: number }, GlyphTransition>(renderingDataWithRadii, {
    initial: ({ datum, size }) => ({ opacity: 1, ...createGlyphTransition(position(datum)), size }),
    from: ({ datum, size }) => ({ opacity: 0, ...createGlyphTransition(position(datum)), size }),
    enter: ({ datum, size }) => ({ opacity: 1, ...createGlyphTransition(position(datum)), size }),
    update: ({ datum, size }) => ({ opacity: 1, ...createGlyphTransition(position(datum)), size }),
    leave: ({ size }) => ({ opacity: 0, size }),
    config: springConfig,
    keys: ({ datum }) => dataEntry.keyAccessor(dataEntry.getOriginalDatumFromRenderingDatum(datum)),
    immediate: !animate
  });
}
