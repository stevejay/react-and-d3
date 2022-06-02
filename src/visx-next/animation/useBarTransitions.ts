import { Key, useEffect, useRef } from 'react';
import { SpringConfig, useTransition } from 'react-spring';
import { isNil } from 'lodash-es';

import { AxisScale } from '../axis';
import { createBarGenerator } from '../generator';
import { isBandScale, ScaleInput } from '../scale';

export function useBarTransitions<XScale extends AxisScale, YScale extends AxisScale, Datum extends object>(
  data: readonly Datum[],
  xScale: XScale,
  yScale: YScale,
  xAccessor: (datum: Datum) => ScaleInput<XScale>,
  yAccessor: (datum: Datum) => ScaleInput<YScale>,
  keyAccessor: (datum: Datum) => Key,
  horizontal: boolean,
  fallbackBandwidth: number,
  springConfig: SpringConfig,
  animate?: boolean,
  offset?: number
) {
  const position = createBarGenerator(xScale, yScale, xAccessor, yAccessor, horizontal, fallbackBandwidth);

  const previousPositionRef = useRef<typeof position | null>(null);
  useEffect(() => {
    previousPositionRef.current = position;
  });

  const scaleIsBandScale = isBandScale(horizontal ? yScale : xScale);

  return useTransition<Datum, { x: number; y: number; width: number; height: number; opacity: number }>(
    data,
    {
      initial: (datum) => ({ opacity: 1, ...position(datum) }),
      from: (datum) => {
        if (scaleIsBandScale) {
          return { opacity: 0, ...position(datum) };
        }
        const initialPosition = previousPositionRef.current ? previousPositionRef.current(datum) : null;
        return !isNil(initialPosition)
          ? { opacity: 0, ...initialPosition }
          : { opacity: 0, ...position(datum) };
      },
      enter: (datum) => ({ opacity: 1, ...position(datum) }),
      update: (datum) => ({ opacity: 1, ...position(datum) }),
      leave: (datum) => {
        if (scaleIsBandScale) {
          return { opacity: 0 };
        }
        const exitPosition = position(datum);
        return !isNil(exitPosition) ? { opacity: 0, ...position(datum) } : { opacity: 0 };
      },
      config: springConfig,
      keys: keyAccessor,
      immediate: !animate
    }
  );
}
