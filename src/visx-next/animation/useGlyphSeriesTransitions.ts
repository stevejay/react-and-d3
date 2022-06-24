import { useEffect, useRef } from 'react';
import { SpringConfig, useTransition } from 'react-spring';
import { isNil } from 'lodash-es';

import { createGlyphSeriesPositioning } from '../positioning';
import { isBandScale, ScaleInput } from '../scale';
import { PositionScale } from '../types';

export function useGlyphSeriesTransitions<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>(
  data: readonly Datum[],
  xScale: XScale,
  yScale: YScale,
  xAccessor: (datum: Datum) => ScaleInput<XScale>,
  yAccessor: (datum: Datum) => ScaleInput<YScale>,
  horizontal: boolean,
  size: number | ((d: Datum) => number),
  springConfig?: Partial<SpringConfig>,
  animate?: boolean,
  renderingOffset?: number
) {
  const position = createGlyphSeriesPositioning(
    xScale,
    yScale,
    xAccessor,
    yAccessor,
    horizontal,
    size,
    renderingOffset
  );

  const previousPositionRef = useRef<typeof position | null>(null);
  useEffect(() => {
    previousPositionRef.current = position;
  });

  const includesBandScale = isBandScale(xScale) || isBandScale(yScale);

  return useTransition<Datum, { x: number; y: number; size: number; opacity: number }>(data, {
    initial: (datum) => ({ opacity: 1, ...position(datum) }),
    from: (datum) => {
      if (includesBandScale) {
        return { opacity: 0, ...position(datum) };
      }
      const initialPosition = previousPositionRef.current ? previousPositionRef.current(datum) : null;
      return !isNil(initialPosition) &&
        isFinite(initialPosition.x) &&
        isFinite(initialPosition.y) &&
        isFinite(initialPosition.size)
        ? { opacity: 0, ...initialPosition }
        : { opacity: 0, ...position(datum) };
    },
    enter: (datum) => ({ opacity: 1, ...position(datum) }),
    update: (datum) => ({ opacity: 1, ...position(datum) }),
    leave: (tickValue) => {
      if (includesBandScale) {
        return { opacity: 0 };
      }
      const exitPosition = position(tickValue);
      return !isNil(exitPosition) &&
        isFinite(exitPosition.x) &&
        isFinite(exitPosition.y) &&
        isFinite(exitPosition.size)
        ? { opacity: 0, ...exitPosition }
        : { opacity: 0 };
    },
    config: springConfig,
    keys: horizontal ? yAccessor : xAccessor,
    immediate: !animate
  });
}
