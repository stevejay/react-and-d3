import { useEffect, useRef } from 'react';
import { SpringConfig, useTransition } from 'react-spring';
import { isNil } from 'lodash-es';

import { getAxisDomainValueAsReactKey } from '../axis';
import { createGridGenerator } from '../generator';
import { isBandScale, ScaleInput } from '../scale';
import { GridScale } from '../types';

export function useGridTransitions<Scale extends GridScale>(
  scale: Scale,
  gridType: 'rows' | 'columns',
  ticks: ScaleInput<Scale>[],
  springConfig: SpringConfig,
  animate?: boolean,
  offset?: number
) {
  const position = createGridGenerator(scale, offset);

  const previousPositionRef = useRef<typeof position | null>(null);
  useEffect(() => {
    previousPositionRef.current = position;
  });

  const xOrY = gridType === 'rows' ? 'y' : 'x';
  // Position animations do not look so good for non-update animations; only use
  // them for update animations.
  const scaleIsBandScale = isBandScale(scale);

  return useTransition<ScaleInput<Scale>, { x?: number; y?: number; opacity: number }>(ticks, {
    initial: (tickValue) => ({ opacity: 1, [xOrY]: position(tickValue) }),
    from: (tickValue) => {
      if (scaleIsBandScale) {
        return { opacity: 0, [xOrY]: position(tickValue) };
      }
      const initialPosition = previousPositionRef.current ? previousPositionRef.current(tickValue) : null;
      return !isNil(initialPosition) && isFinite(initialPosition)
        ? { opacity: 0, [xOrY]: initialPosition }
        : { opacity: 0, [xOrY]: position(tickValue) };
    },
    enter: (tickValue) => ({ opacity: 1, [xOrY]: position(tickValue) }),
    update: (tickValue) => ({ opacity: 1, [xOrY]: position(tickValue) }),
    leave: (tickValue) => {
      if (scaleIsBandScale) {
        return { opacity: 0 };
      }
      const exitPosition = position(tickValue);
      return isFinite(exitPosition) ? { opacity: 0, [xOrY]: exitPosition } : { opacity: 0 };
    },
    config: springConfig,
    keys: getAxisDomainValueAsReactKey,
    immediate: !animate
  });
}
