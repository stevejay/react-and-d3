import { useEffect, useRef } from 'react';
import { SpringConfig, useTransition } from 'react-spring';
import { isNil } from 'lodash-es';

import { coerceNumber } from './coerceNumber';
import { getScaleBandwidth } from './getScaleBandwidth';
import { isBandScale } from './isBandScale';
import type { AxisScale, TickDatum } from './types';

function keyAccessor(tickValue: TickDatum) {
  return tickValue.value.toString();
}

function createTickPositioning(scale: AxisScale, offset: number): (datum: TickDatum) => number {
  const scaleCopy = scale.copy();
  let scaleOffset = Math.max(0, getScaleBandwidth(scaleCopy) - offset * 2) / 2;
  if ('round' in scale) {
    scaleOffset = Math.round(scaleOffset);
  }
  return (datum) => (coerceNumber(scaleCopy(datum.value)) ?? 0) + scaleOffset;
}

export function useAxisTransitions(
  scale: AxisScale,
  ticks: readonly TickDatum[],
  springConfig: SpringConfig | undefined,
  animate: boolean,
  renderingOffset: number
) {
  const position = createTickPositioning(scale, renderingOffset);

  const previousPositionRef = useRef<typeof position | null>(null);
  useEffect(() => {
    previousPositionRef.current = position;
  });

  // Position animations do not look so good for non-update animations; so only use
  // them for update animations.
  const scaleIsBandScale = isBandScale(scale);

  return useTransition<TickDatum, { opacity: number; translate: number }>(ticks, {
    initial: (tickValue) => ({ opacity: 1, translate: position(tickValue) + renderingOffset }),
    from: (tickValue) => {
      if (scaleIsBandScale) {
        return { opacity: 0, translate: position(tickValue) + renderingOffset };
      }
      const initialPosition = previousPositionRef.current ? previousPositionRef.current(tickValue) : null;
      return !isNil(initialPosition) && isFinite(initialPosition)
        ? { opacity: 0, translate: initialPosition + renderingOffset }
        : { opacity: 0, translate: position(tickValue) + renderingOffset };
    },
    enter: (tickValue) => ({ opacity: 1, translate: position(tickValue) + renderingOffset }),
    update: (tickValue) => ({ opacity: 1, translate: position(tickValue) + renderingOffset }),
    leave: (tickValue) => {
      if (scaleIsBandScale) {
        return { opacity: 0 };
      }
      const exitPosition = position(tickValue);
      return isFinite(exitPosition)
        ? { opacity: 0, translate: exitPosition + renderingOffset }
        : { opacity: 0 };
    },
    config: springConfig,
    keys: keyAccessor,
    immediate: !animate
  });
}
