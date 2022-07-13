import { SpringConfig, useTransition } from 'react-spring';
import { SeriesPoint } from 'd3-shape';

import { createBarStackPositioning } from '../positioning';
import { ScaleInput } from '../scale';
import { CombinedStackData, PositionScale } from '../types';

export function useBarStackTransitions<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>(
  data: readonly SeriesPoint<CombinedStackData<XScale, YScale, Datum>>[],
  dataKeys: readonly string[],
  xScale: XScale,
  yScale: YScale,
  dataKey: string,
  keyAccessor: (d: Datum) => string,
  xAccessor: (d: SeriesPoint<CombinedStackData<XScale, YScale, Datum>>) => ScaleInput<XScale>,
  yAccessor: (d: SeriesPoint<CombinedStackData<XScale, YScale, Datum>>) => ScaleInput<YScale>,
  horizontal: boolean,
  springConfig?: Partial<SpringConfig>,
  animate?: boolean,
  renderingOffset?: number
) {
  const position = createBarStackPositioning(xScale, yScale, horizontal, renderingOffset);

  return useTransition<
    SeriesPoint<CombinedStackData<XScale, YScale, Datum>>,
    { x: number; y: number; width: number; height: number; opacity: number }
  >(data, {
    initial: (datum) => ({ opacity: 1, ...position(datum, dataKey) }),
    from: (datum) => ({ opacity: 0, ...position(datum, dataKey) }),
    enter: (datum) => ({ opacity: 1, ...position(datum, dataKey) }),
    // update: (datum) => ({ opacity: 1, ...position(datum, dataKey) }),
    update: (datum) =>
      dataKeys.includes(dataKey) ? { opacity: 1, ...position(datum, dataKey) } : { opacity: 1 },
    leave: () => ({ opacity: 0 }),
    config: springConfig,
    keys: (datum) => keyAccessor(datum.data.__datum__), // `${(horizontal ? yAccessor : xAccessor)?.(datum)}`,
    immediate: !animate
  });
}
