import { useRef } from 'react';
import { SpringConfig, useTransition } from 'react-spring';
import { isNil } from 'lodash-es';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

import { createTickPositioning } from '../positioning';
import { isBandScale } from '../scale';
import { GridScale, TickDatum } from '../types';

function keyAccessor(tickValue: TickDatum) {
  return tickValue.value.toString();
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
  useIsomorphicLayoutEffect(() => {
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
    keys: keyAccessor, //(tickValue) => tickValue.toString(),
    immediate: !animate
  });
}
