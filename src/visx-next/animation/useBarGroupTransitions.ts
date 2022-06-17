import { useEffect, useRef } from 'react';
import { SpringConfig, useTransition } from 'react-spring';
import { ScaleBand } from 'd3-scale';
import { isNil } from 'lodash-es';

import { DataRegistry } from '../DataRegistry';
import { createBarGroupPositioning } from '../positioning';
import { isBandScale } from '../scale';
import { PositionScale } from '../types';

export function useBarGroupTransitions<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>(
  data: readonly Datum[],
  xScale: XScale,
  yScale: YScale,
  groupScale: ScaleBand<string>,
  dataKey: string,
  dataRegistry: Omit<DataRegistry<XScale, YScale, Datum>, 'registry' | 'registryKeys'>,
  // keyAccessor: (datum: Datum) => Key,
  horizontal: boolean,
  //   fallbackBandwidth: number,
  springConfig?: Partial<SpringConfig>,
  animate?: boolean,
  renderingOffset?: number
) {
  const position = createBarGroupPositioning(
    xScale,
    yScale,
    groupScale,
    dataRegistry,
    horizontal,
    renderingOffset
  );

  const previousPositionRef = useRef<typeof position | null>(null);
  useEffect(() => {
    previousPositionRef.current = position;
  });

  const scaleIsBandScale = isBandScale(horizontal ? yScale : xScale);
  const { xAccessor, yAccessor } = dataRegistry.get(dataKey); // TODO not sure about this.

  return useTransition<Datum, { x: number; y: number; width: number; height: number; opacity: number }>(
    data,
    {
      initial: (datum) => ({ opacity: 1, ...position(datum, dataKey) }),
      from: (datum) => {
        if (scaleIsBandScale) {
          return { opacity: 0, ...position(datum, dataKey) };
        }
        const initialPosition = previousPositionRef.current
          ? previousPositionRef.current(datum, dataKey)
          : null;
        return !isNil(initialPosition)
          ? { opacity: 0, ...initialPosition }
          : { opacity: 0, ...position(datum, dataKey) };
      },
      enter: (datum) => ({ opacity: 1, ...position(datum, dataKey) }),
      update: (datum) => ({ opacity: 1, ...position(datum, dataKey) }),
      leave: (datum) => {
        if (scaleIsBandScale) {
          return { opacity: 0 };
        }
        const exitPosition = position(datum, dataKey);
        return !isNil(exitPosition) ? { opacity: 0, ...position(datum, dataKey) } : { opacity: 0 };
      },
      config: springConfig,
      keys: (datum) => `${dataKey}-${(horizontal ? yAccessor : xAccessor)?.(datum)}`,
      immediate: !animate
    }
  );
}
