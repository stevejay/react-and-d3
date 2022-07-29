import { useEffect, useRef } from 'react';
import { SpringConfig, useTransition } from 'react-spring';
import { isNil } from 'lodash-es';

import { coerceNumber } from './coerceNumber';
import { getScaleBandwidth } from './getScaleBandwidth';
import { isBandScale } from './isBandScale';
import type { AxisScale, GridType, Margin, TickDatum } from './types';

export interface GridPositioningArgs {
  gridType: GridType;
  scale: AxisScale;
  rangePadding: number;
  margin: Margin;
  innerWidth: number;
  innerHeight: number;
  ticks: TickDatum[];
  springConfig: SpringConfig | undefined;
  animate: boolean;
  renderingOffset: number;
}

function createGridPositioning({
  gridType,
  scale,
  rangePadding,
  margin,
  innerWidth,
  innerHeight,
  renderingOffset
}: GridPositioningArgs): (tickDatum: TickDatum) => { x1: number; y1: number; x2: number; y2: number } {
  const scaleCopy = scale.copy();
  let scaleOffset = Math.max(0, getScaleBandwidth(scaleCopy) - renderingOffset * 2) / 2;

  // Broaden type before using 'round' in s as typeguard.
  const s = scaleCopy as AxisScale;
  if ('round' in s) {
    scaleOffset = Math.round(scaleOffset);
  }

  return (tickDatum) => {
    if (gridType === 'row') {
      const y = (coerceNumber(scaleCopy(tickDatum.value)) ?? 0) + scaleOffset;
      return {
        x1: margin.left + rangePadding,
        y1: y,
        x2: margin.left + innerWidth - rangePadding,
        y2: y
      };
    } else {
      const x = (coerceNumber(scaleCopy(tickDatum.value)) ?? 0) + scaleOffset;
      return {
        x1: x,
        y1: margin.top + rangePadding,
        x2: x,
        y2: margin.top + innerHeight - rangePadding
      };
    }
  };
}

/** Generates the animations for a grid. */
export function useGridTransitions(args: GridPositioningArgs) {
  const position = createGridPositioning(args);
  const { ticks, scale, springConfig, animate } = args;

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
      initial: (tickDatum) => ({ opacity: 1, ...position(tickDatum) }),
      from: (tickDatum) => {
        if (scaleIsBandScale) {
          return { opacity: 0, ...position(tickDatum) };
        }
        const initialPosition = previousPositionRef.current ? previousPositionRef.current(tickDatum) : null;
        return !isNil(initialPosition) &&
          isFinite(initialPosition.x1) &&
          isFinite(initialPosition.x2) &&
          isFinite(initialPosition.y1) &&
          isFinite(initialPosition.y1)
          ? { opacity: 0, ...initialPosition }
          : { opacity: 0, ...position(tickDatum) };
      },
      enter: (tickDatum) => ({ opacity: 1, ...position(tickDatum) }),
      update: (tickDatum) => ({ opacity: 1, ...position(tickDatum) }),
      leave: (tickDatum) => {
        if (scaleIsBandScale) {
          return { opacity: 0 };
        }
        const exitPosition = position(tickDatum);
        return isFinite(exitPosition.x1) &&
          isFinite(exitPosition.x2) &&
          isFinite(exitPosition.y1) &&
          isFinite(exitPosition.y2)
          ? { opacity: 0, ...exitPosition }
          : { opacity: 0 };
      },
      config: springConfig,
      keys: (tickDatum) => tickDatum.value,
      immediate: !animate
    }
  );
}
