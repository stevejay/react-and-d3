import { SpringConfig, useTransition } from 'react-spring';
import type { ScaleBand } from 'd3-scale';

import { createBarGroupSeriesPolygonPositioning } from './barPositioning';
import type { AxisScale, PolygonTransitionsProps, ScaleInput } from './types';

export function useBarGroupTransitions<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(args: {
  data: readonly Datum[];
  independentScale: IndependentScale;
  dependentScale: DependentScale;
  groupScale: ScaleBand<string>;
  keyAccessor: (datum: Datum) => string;
  independentAccessor: (datum: Datum) => ScaleInput<IndependentScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<DependentScale>;
  dataKey: string;
  dataKeys: readonly string[];
  horizontal: boolean;
  springConfig: Partial<SpringConfig>;
  animate: boolean;
  renderingOffset: number;
}) {
  const { data, keyAccessor, dataKey, dataKeys, springConfig, animate } = args;
  const position = createBarGroupSeriesPolygonPositioning(args);
  return useTransition<Datum, PolygonTransitionsProps>(data, {
    initial: (datum) => ({ opacity: 1, ...position(datum) }),
    from: (datum) => ({ opacity: 0, ...position(datum) }),
    enter: (datum) => ({ opacity: 1, ...position(datum) }),
    update: (datum) => (dataKeys.includes(dataKey) ? { opacity: 1, ...position(datum) } : { opacity: 1 }),
    leave: () => ({ opacity: 0 }),
    config: springConfig,
    keys: keyAccessor,
    immediate: !animate
  });
}
