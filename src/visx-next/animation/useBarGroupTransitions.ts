import { SpringConfig, useTransition } from 'react-spring';
import { ScaleBand } from 'd3-scale';

import { createBarGroupPositioning } from '../positioning';
import { ScaleInput } from '../scale';
import { PositionScale } from '../types';

export function useBarGroupTransitions<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>(
  data: readonly Datum[],
  xScale: XScale,
  yScale: YScale,
  groupScale: ScaleBand<string>,
  keyAccessor: (datum: Datum) => string,
  xAccessor: (datum: Datum) => ScaleInput<XScale>,
  yAccessor: (datum: Datum) => ScaleInput<YScale>,
  dataKey: string,
  dataKeys: readonly string[],
  horizontal: boolean,
  springConfig?: Partial<SpringConfig>,
  animate?: boolean,
  renderingOffset?: number
) {
  const position = createBarGroupPositioning(
    dataKey,
    xScale,
    yScale,
    xAccessor,
    yAccessor,
    groupScale,
    horizontal,
    renderingOffset
  );
  return useTransition<Datum, { x: number; y: number; width: number; height: number; opacity: number }>(
    data,
    {
      initial: (datum) => ({ opacity: 1, ...position(datum) }),
      from: (datum) => ({ opacity: 0, ...position(datum) }),
      enter: (datum) => ({ opacity: 1, ...position(datum) }),
      update: (datum) => (dataKeys.includes(dataKey) ? { opacity: 1, ...position(datum) } : { opacity: 1 }),
      leave: () => ({ opacity: 0 }),
      config: springConfig,
      keys: keyAccessor, // (datum) => `${dataKey}-${(horizontal ? yAccessor : xAccessor)?.(datum)}`,
      immediate: !animate
    }
  );
}
