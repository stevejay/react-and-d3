import { SpringConfig, useTransition } from 'react-spring';

import { createBarStackSeriesPolygonPositioning } from './barPositioning';
import type { AxisScale, PolygonTransitionsProps, StackDatum } from './types';

export function useBarStackTransitions<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>(args: {
  data: readonly StackDatum<IndependentScale, DependentScale, Datum>[];
  independentScale: IndependentScale;
  dependentScale: DependentScale;
  keyAccessor: (datum: Datum) => string;
  horizontal: boolean;
  springConfig: Partial<SpringConfig>;
  animate: boolean;
  renderingOffset: number;
  underlyingDatumAccessor: (datum: StackDatum<IndependentScale, DependentScale, Datum>) => Datum;
}) {
  const { data, keyAccessor, springConfig, animate, underlyingDatumAccessor } = args;
  const position = createBarStackSeriesPolygonPositioning(args);
  return useTransition<StackDatum<IndependentScale, DependentScale, Datum>, PolygonTransitionsProps>(data, {
    initial: (datum) => ({ opacity: 1, ...position(datum) }),
    from: (datum) => ({ opacity: 0, ...position(datum) }),
    enter: (datum) => ({ opacity: 1, ...position(datum) }),
    update: (datum) => ({ opacity: 1, ...position(datum) }),
    leave: () => ({ opacity: 0 }),
    config: springConfig,
    keys: (datum) => keyAccessor(underlyingDatumAccessor(datum)),
    immediate: !animate
  });
}
