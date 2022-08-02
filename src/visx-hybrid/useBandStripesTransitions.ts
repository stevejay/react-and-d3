import { SpringConfig, useTransition } from 'react-spring';

import { coerceNumber } from './coerceNumber';
import { getScaleBandwidth } from './getScaleBandwidth';
import { getScaleStep } from './getScaleStep';
import { isBandScale } from './isBandScale';
import type { AxisScale, GridType, Margin, TickDatum } from './types';

export interface StripePositioningArgs {
  gridType: GridType;
  scale: AxisScale;
  rangePadding: number;
  margin: Margin;
  innerWidth: number;
  innerHeight: number;
  ticks: TickDatum[];
  animate: boolean;
  springConfig: SpringConfig | undefined;
  renderingOffset: number;
}

function createStripesPositioning({
  gridType,
  scale,
  rangePadding,
  margin,
  innerWidth,
  innerHeight,
  renderingOffset
}: StripePositioningArgs): (datum: TickDatum) => { x: number; y: number; width: number; height: number } {
  const step = getScaleStep(scale);
  const bandwidth = getScaleBandwidth(scale);
  const stripeOffset = (step - bandwidth) * 0.5;

  return (datum) => {
    if (gridType === 'row') {
      return {
        x: margin.left + rangePadding,
        y: (coerceNumber(scale(datum.value)) ?? 0) - stripeOffset + renderingOffset,
        width: innerWidth - rangePadding * 2,
        height: step
      };
    } else {
      return {
        x: (coerceNumber(scale(datum.value)) ?? 0) - stripeOffset,
        y: margin.top + rangePadding + renderingOffset,
        width: step,
        height: innerHeight - rangePadding * 2
      };
    }
  };
}

/** Generates the animations for stripes. It can only be used with a band scale. */
export function useBandStripesTransitions(args: StripePositioningArgs) {
  if (!isBandScale(args.scale)) {
    throw new Error('Must be used with a band scale');
  }
  const position = createStripesPositioning(args);
  const { ticks, springConfig, animate } = args;
  return useTransition<TickDatum, { opacity: number; x: number; y: number; width: number; height: number }>(
    ticks,
    {
      initial: (tickDatum) => ({ opacity: 1, ...position(tickDatum) }),
      from: (tickDatum) => ({ opacity: 0, ...position(tickDatum) }),
      enter: (tickDatum) => ({ opacity: 1, ...position(tickDatum) }),
      update: (tickDatum) => ({ opacity: 1, ...position(tickDatum) }),
      leave: () => ({ opacity: 0 }),
      config: springConfig,
      keys: (tickDatum) => tickDatum.index,
      immediate: !animate
    }
  );
}
