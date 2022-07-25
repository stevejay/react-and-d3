import { useEffect, useRef } from 'react';
import { SpringConfig, useTransition } from 'react-spring';
import { coerceNumber } from '@visx/scale';
import { isNil } from 'lodash-es';

import { getScaleBandwidth, isBandScale } from '@/visx-next/scale';
import { AxisScale, GridScale } from '@/visx-next/types';

import { TickDatum } from './types';

function keyAccessor(tickValue: TickDatum) {
  return tickValue.value.toString(); // Should this be tickValue.label ?
}

function createTickPositioning<Scale extends GridScale>(
  scale: Scale,
  offset: number
): (d: TickDatum) => number {
  const scaleCopy = scale.copy();
  let scaleOffset = Math.max(0, getScaleBandwidth(scaleCopy) - offset * 2) / 2;

  // Broaden type before using 'round' in s as typeguard.
  const s = scale as AxisScale;
  if ('round' in s) {
    scaleOffset = Math.round(scaleOffset);
  }

  // offset + getScaleBandwidth(scaleCopy) / 2;
  return (d) => (coerceNumber(scaleCopy(d.value)) ?? 0) + scaleOffset;
}

export function useAxisTransitions<Scale extends GridScale>(
  scale: Scale,
  ticks: TickDatum[],
  springConfig: SpringConfig | undefined,
  animate: boolean,
  offset = 0
) {
  const position = createTickPositioning(scale, offset);

  const previousPositionRef = useRef<typeof position | null>(null);
  useEffect(() => {
    previousPositionRef.current = position;
  });

  // Position animations do not look so good for non-update animations; only use
  // them for update animations.
  const scaleIsBandScale = isBandScale(scale);

  return useTransition<TickDatum, { opacity: number; translate: number }>(ticks, {
    initial: (tickValue) => ({ opacity: 1, translate: position(tickValue) + offset }),
    from: (tickValue) => {
      if (scaleIsBandScale) {
        return { opacity: 0, translate: position(tickValue) + offset };
      }
      const initialPosition = previousPositionRef.current ? previousPositionRef.current(tickValue) : null;
      return !isNil(initialPosition) && isFinite(initialPosition)
        ? { opacity: 0, translate: initialPosition + offset }
        : { opacity: 0, translate: position(tickValue) + offset };
    },
    enter: (tickValue) => ({ opacity: 1, translate: position(tickValue) + offset }),
    update: (tickValue) => ({ opacity: 1, translate: position(tickValue) + offset }),
    leave: (tickValue) => {
      if (scaleIsBandScale) {
        return { opacity: 0 };
      }
      const exitPosition = position(tickValue);
      return isFinite(exitPosition) ? { opacity: 0, translate: exitPosition + offset } : { opacity: 0 };
    },
    config: springConfig,
    keys: keyAccessor,
    immediate: !animate
  });
}
