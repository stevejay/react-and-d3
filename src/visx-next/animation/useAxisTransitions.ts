import { useEffect, useRef } from 'react';
import { SpringConfig, useTransition } from 'react-spring';
import { isNil } from 'lodash-es';

import { getAxisDomainValueAsReactKey } from '../axis/getAxisDomainValueAsReactKey';
import { createGridGenerator } from '../generator';
import { isBandScale, ScaleInput } from '../scale';
import { GridScale } from '../types';

export function useAxisTransitions<Scale extends GridScale>(
  scale: Scale,
  ticks: ScaleInput<Scale>[],
  springConfig: SpringConfig | undefined,
  animate: boolean,
  offset: number = 0
) {
  const position = createGridGenerator(scale, offset);

  const previousPositionRef = useRef<typeof position | null>(null);
  useEffect(() => {
    previousPositionRef.current = position;
  });

  // Position animations do not look so good for non-update animations; only use
  // them for update animations.
  const scaleIsBandScale = isBandScale(scale);

  return useTransition<ScaleInput<Scale>, { opacity: number; translate: number }>(ticks, {
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
    keys: getAxisDomainValueAsReactKey,
    immediate: !animate
  });
}

// const tickTransitions = useTransition(tickValues, {
//   initial: (tickValue) => {
//     return { opacity: 1, [translate]: coerceNumber(tickPosition(tickValue)) ?? NaN + renderingOffset };
//   },
//   from: (tickValue) => {
//     const initialPosition = previousTickPosition ? coerceNumber(previousTickPosition(tickValue)) : null;
//     return !isNil(initialPosition) && isFinite(initialPosition)
//       ? { opacity: 0, [translate]: initialPosition + renderingOffset }
//       : { opacity: 0, [translate]: coerceNumber(tickPosition(tickValue)) ?? NaN + renderingOffset };
//   },
//   enter: (tickValue) => ({
//     opacity: 1,
//     [translate]: coerceNumber(tickPosition(tickValue)) ?? NaN + renderingOffset
//   }),
//   update: (tickValue) => ({
//     opacity: 1,
//     [translate]: coerceNumber(tickPosition(tickValue)) ?? NaN + renderingOffset
//   }),
//   leave: (tickValue) => {
//     const exitPosition = coerceNumber(tickPosition(tickValue)) ?? NaN;
//     return isFinite(exitPosition)
//       ? { opacity: 0, [translate]: exitPosition + renderingOffset }
//       : { opacity: 0 };
//   },
//   config: springConfig,
//   keys: (d) => {
//     console.log('d', d);
//     return d.toString();
//   }, // TODO fix
//   immediate: !animate
// });
