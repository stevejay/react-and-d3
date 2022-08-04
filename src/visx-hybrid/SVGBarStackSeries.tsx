import { SpringConfig } from 'react-spring';
import type { ScaleOrdinal } from 'd3-scale';

import { SVGSimpleBar } from './SVGSimpleBar';
import type { AxisScale, ScaleInput, SeriesProps, StackDatum, SVGBarProps } from './types';
import { useBarStackTransitions } from './useBarStackTransitions';

export type SVGBarStackSeriesProps<
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
  independentAccessor: (datum: Datum) => ScaleInput<IndependentScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<DependentScale>;
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  /* A react-spring configuration object */
  springConfig: SpringConfig;
  colorAccessor?: (datum: Datum, key: string) => string;
  colorScale: ScaleOrdinal<string, string, never>;
  enableEvents?: boolean;
  component?: (props: SVGBarProps<Datum>) => JSX.Element;
} & Pick<
  SeriesProps<IndependentScale, DependentScale, Datum>,
  'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onBlur' | 'onFocus' | 'enableEvents'
>;

export function SVGBarStackSeries<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>({
  dataKey,
  data,
  independentScale,
  dependentScale,
  underlyingDatumAccessor,
  keyAccessor,
  horizontal,
  renderingOffset,
  springConfig,
  animate,
  colorAccessor,
  colorScale,
  // barProps = {},
  //   onBlur,
  //   onFocus,
  //   onPointerMove,
  //   onPointerOut,
  //   onPointerUp,
  // enableEvents = true,
  component: BarComponent = SVGSimpleBar
}: SVGBarStackSeriesProps<IndependentScale, DependentScale, Datum>) {
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
      {transitions((springValues, datum, _, index) => (
        <BarComponent
          springValues={springValues}
          datum={underlyingDatumAccessor(datum)}
          index={index}
          dataKey={dataKey}
          horizontal={horizontal}
          colorScale={colorScale}
          colorAccessor={colorAccessor}
        />
      ))}
      {/* {transitions(({ cx, cy, x1, y1, opacity }, datum, _, index) => (
        <animated.text
          x={horizontal ? x1 : cx}
          y={horizontal ? cy : y1}
          fill="white"
          style={{ opacity }}
          textAnchor={horizontal ? 'start' : 'middle'}
          dy={20}
        >
          Hello t
        </animated.text>
      ))} */}
    </>
  );
}
