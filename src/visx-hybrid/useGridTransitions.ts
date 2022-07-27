import { useEffect, useRef } from 'react';
import { SpringConfig, useTransition } from 'react-spring';
import { coerceNumber } from '@visx/scale';
import { isNil } from 'lodash-es';

import { getScaleBandwidth, isBandScale } from '@/visx-next/scale';
import { AxisScale, GridScale, Margin } from '@/visx-next/types';

import { GridType, TickDatum } from './types';

function keyAccessor(tick: TickDatum) {
  return tick.value.toString(); // Should this be tick.label ?
}

function createGridPositioning<Scale extends GridScale>(
  gridType: GridType,
  scale: Scale,
  rangePadding: number,
  margin: Margin,
  innerWidth: number,
  innerHeight: number,
  offset: number
): (d: TickDatum) => { x1: number; y1: number; x2: number; y2: number } {
  const scaleCopy = scale.copy();
  let scaleOffset = Math.max(0, getScaleBandwidth(scaleCopy) - offset * 2) / 2;

  // Broaden type before using 'round' in s as typeguard.
  const s = scale as AxisScale;
  if ('round' in s) {
    scaleOffset = Math.round(scaleOffset);
  }

  return (d) => {
    if (gridType === 'row') {
      const y = (coerceNumber(scaleCopy(d.value)) ?? 0) + scaleOffset;
      return {
        x1: margin.left + rangePadding,
        y1: y,
        x2: margin.left + innerWidth - rangePadding,
        y2: y
      };
    }

    const x = (coerceNumber(scaleCopy(d.value)) ?? 0) + scaleOffset;
    return {
      x1: x,
      y1: margin.top + rangePadding,
      x2: x,
      y2: margin.top + innerHeight - rangePadding
    };
  };

  // offset + getScaleBandwidth(scaleCopy) / 2;
  // return (d) => (coerceNumber(scaleCopy(d.value)) ?? 0) + scaleOffset;
}

export function useGridTransitions<Scale extends GridScale>(
  gridType: GridType,
  scale: Scale,
  rangePadding: number,
  margin: Margin,
  innerWidth: number,
  innerHeight: number,
  ticks: TickDatum[],
  springConfig: SpringConfig | undefined,
  animate: boolean,
  renderingOffset = 0
) {
  const position = createGridPositioning(
    gridType,
    scale,
    rangePadding,
    margin,
    innerWidth,
    innerHeight,
    renderingOffset
  );

  const previousPositionRef = useRef<typeof position | null>(null);
  useEffect(() => {
    previousPositionRef.current = position;
  });

  // Position animations do not look so good for non-update animations; only use
  // them for update animations.
  const scaleIsBandScale = isBandScale(scale);

  return useTransition<TickDatum, { opacity: number; x1: number; y1: number; x2: number; y2: number }>(
    ticks,
    {
      initial: (tick) => ({ opacity: 1, ...position(tick) }),
      from: (tick) => {
        if (scaleIsBandScale) {
          return { opacity: 0, ...position(tick) };
        }
        const initialPosition = previousPositionRef.current ? previousPositionRef.current(tick) : null;
        return !isNil(initialPosition) &&
          isFinite(initialPosition.x1) &&
          isFinite(initialPosition.x2) &&
          isFinite(initialPosition.y1) &&
          isFinite(initialPosition.y1)
          ? { opacity: 0, ...initialPosition }
          : { opacity: 0, ...position(tick) };
      },
      enter: (tick) => ({ opacity: 1, ...position(tick) }),
      update: (tick) => ({ opacity: 1, ...position(tick) }),
      leave: (tick) => {
        if (scaleIsBandScale) {
          return { opacity: 0 };
        }
        const exitPosition = position(tick);
        return isFinite(exitPosition.x1) &&
          isFinite(exitPosition.x2) &&
          isFinite(exitPosition.y1) &&
          isFinite(exitPosition.y2)
          ? { opacity: 0, ...exitPosition }
          : { opacity: 0 };
      },
      config: springConfig,
      keys: keyAccessor,
      immediate: !animate
    }
  );
}
