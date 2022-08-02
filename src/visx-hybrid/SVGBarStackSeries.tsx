import type { SpringConfig } from 'react-spring';
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
  dataKeys: readonly string[];
  independentScale: IndependentScale;
  dependentScale: DependentScale;
  keyAccessor: (datum: Datum) => string;
  independentAccessor: (datum: Datum) => ScaleInput<IndependentScale>;
  dependentAccessor: (datum: Datum) => ScaleInput<DependentScale>;
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  /* A react-spring configuration object */
  springConfig: SpringConfig;
  colorAccessor?: (datum: StackDatum<AxisScale, AxisScale, Datum>, key: string) => string;
  colorScale: ScaleOrdinal<string, string, never>;
  // barClassName?: string;
  enableEvents?: boolean;
  // barProps?: PolygonProps | ((datum: Datum, index: number, dataKey: string) => PolygonProps);
  component?: (props: SVGBarProps<StackDatum<IndependentScale, DependentScale, Datum>>) => JSX.Element;
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
    renderingOffset
  });
  return (
    <>
      {transitions((springValues, datum, _, index) => (
        <BarComponent
          springValues={springValues}
          datum={datum}
          index={index}
          dataKey={dataKey}
          horizontal={horizontal}
          colorScale={colorScale}
          colorAccessor={colorAccessor}
        />
      ))}
    </>
  );
}
