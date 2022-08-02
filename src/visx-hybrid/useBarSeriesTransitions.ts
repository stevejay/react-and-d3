import { SpringConfig, useTransition } from 'react-spring';

import { createBarSeriesPolygonPositioning } from './barPositioning';
import type { AxisScale, PolygonTransitionsProps, ScaleInput } from './types';

export function useBarSeriesTransitions<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(args: {
  data: readonly Datum[];
  independentScale: IndependentScale;
  dependentScale: DependentScale;
  keyAccessor: (datum: Datum) => string;
  independentAccessor: (datum: Datum) => ScaleInput<IndependentScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<DependentScale>;
  horizontal: boolean;
  springConfig: Partial<SpringConfig>;
  animate: boolean;
  renderingOffset: number;
}) {
  const { data, keyAccessor, springConfig, animate } = args;
  const position = createBarSeriesPolygonPositioning(args);
  return useTransition<Datum, PolygonTransitionsProps>(data, {
    initial: (datum) => ({ opacity: 1, ...position(datum) }),
    from: (datum) => ({ opacity: 0, ...position(datum) }),
    enter: (datum) => ({ opacity: 1, ...position(datum) }),
    update: (datum) => ({ opacity: 1, ...position(datum) }),
    leave: () => ({ opacity: 0 }),
    config: springConfig,
    keys: keyAccessor,
    immediate: !animate
  });
}
