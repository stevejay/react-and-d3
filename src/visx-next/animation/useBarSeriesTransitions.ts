import { useEffect, useRef } from 'react';
import { SpringConfig, useTransition } from 'react-spring';
import { isNil } from 'lodash-es';

import { createBarSeriesPositioning } from '../positioning';
import { isBandScale, ScaleInput } from '../scale';
import { PositionScale } from '../types';

export function useBarSeriesTransitions<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>(
  data: readonly Datum[],
  xScale: XScale,
  yScale: YScale,
  xAccessor: (datum: Datum) => ScaleInput<XScale>,
  yAccessor: (datum: Datum) => ScaleInput<YScale>,
  // keyAccessor: (datum: Datum) => Key,
  horizontal: boolean,
  fallbackBandwidth: number,
  springConfig?: Partial<SpringConfig>,
  animate?: boolean,
  renderingOffset?: number
) {
  const position = createBarSeriesPositioning(
    xScale,
    yScale,
    xAccessor,
    yAccessor,
    horizontal,
    fallbackBandwidth,
    renderingOffset
  );

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
      keys: horizontal ? yAccessor : xAccessor,
      immediate: !animate
    }
  );
}
