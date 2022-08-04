import { animated, SpringConfig } from 'react-spring';

import type { AxisScale, StackDatum } from './types';
import { useBarStackTransitions } from './useBarStackTransitions';

export type SVGBarStackLabelsProps<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
> = {
  dataKey: string;
  data: readonly StackDatum<IndependentScale, DependentScale, Datum>[];
  independentScale: IndependentScale;
  dependentScale: DependentScale;
  keyAccessor: (datum: Datum) => string;
  underlyingDatumAccessor: (datum: StackDatum<IndependentScale, DependentScale, Datum>) => Datum;
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  /* A react-spring configuration object */
  springConfig: SpringConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependentAccessor: (datum: Datum) => any; // FiX ANY
};

export function SVGBarStackLabels<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>({
  data,
  independentScale,
  dependentScale,
  keyAccessor,
  horizontal,
  renderingOffset,
  springConfig,
  animate,
  dependentAccessor,
  underlyingDatumAccessor
}: SVGBarStackLabelsProps<IndependentScale, DependentScale, Datum>) {
  const transitions = useBarStackTransitions({
    data,
    independentScale,
    dependentScale,
    keyAccessor,
    horizontal,
    springConfig,
    animate,
    renderingOffset,
    underlyingDatumAccessor
  });

  return (
    <>
      {transitions(({ cx, cy, opacity }, datum) => {
        const value = dependentAccessor(datum.data.__datum__);
        if (value === 0) {
          return null;
        }
        return (
          <animated.text
            // x={horizontal ? x1 : cx}
            // y={horizontal ? cy : y1}
            x={cx}
            y={cy}
            fill="white"
            style={{ opacity }}
            textAnchor="middle"
            // dy={10}
          >
            {value}
          </animated.text>
        );
      })}
    </>
  );
}
