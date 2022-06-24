import { SpringConfig, useTransition } from 'react-spring';
import { CurveFactory, CurveFactoryLineOnly } from 'd3-shape';

import { createLineSeriesPositioning } from '../positioning';
import { ScaleInput } from '../scale';
import { PositionScale } from '../types';

export function useLineSeriesTransitions<
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
  curve?: CurveFactory | CurveFactoryLineOnly,
  springConfig?: Partial<SpringConfig>,
  animate?: boolean,
  renderingOffset?: number
) {
  const path = createLineSeriesPositioning({
    xScale,
    yScale,
    xAccessor,
    yAccessor,
    horizontal,
    curve,
    renderingOffset
  });
  return useTransition<string, { d: string; opacity: number }>(path(data) ?? '', {
    initial: (datum) => ({ opacity: 1, d: datum }),
    from: (datum) => ({ opacity: 0, d: datum }),
    enter: (datum) => ({ opacity: 1, d: datum }),
    update: (datum) => ({ opacity: 1, d: datum }),
    leave: () => ({ opacity: 0 }),
    config: springConfig,
    keys: (d) => d,
    immediate: !animate
  });
}
