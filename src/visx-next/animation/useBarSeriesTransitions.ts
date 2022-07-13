import { SpringConfig, useTransition } from 'react-spring';

import { createBarSeriesPositioning } from '../positioning';
import { ScaleInput } from '../scale';
import { PositionScale } from '../types';

export function useBarSeriesTransitions<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>(
  data: readonly Datum[],
  xScale: XScale,
  yScale: YScale,
  keyAccessor: (datum: Datum) => string,
  xAccessor: (datum: Datum) => ScaleInput<XScale>,
  yAccessor: (datum: Datum) => ScaleInput<YScale>,
  horizontal: boolean,
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
    renderingOffset
  );
  return useTransition<Datum, { x: number; y: number; width: number; height: number; opacity: number }>(
    data,
    {
      initial: (datum) => ({ opacity: 1, ...position(datum) }),
      from: (datum) => ({ opacity: 0, ...position(datum) }),
      enter: (datum) => ({ opacity: 1, ...position(datum) }),
      update: (datum) => ({ opacity: 1, ...position(datum) }),
      leave: () => ({ opacity: 0 }),
      config: springConfig,
      keys: keyAccessor, // ? keyAccessor : horizontal ? yAccessor : xAccessor,
      immediate: !animate
    }
  );
}
