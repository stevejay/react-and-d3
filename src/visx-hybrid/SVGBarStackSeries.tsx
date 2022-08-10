import { SpringConfig } from 'react-spring';
import type { ScaleOrdinal } from 'd3-scale';

import { SVGSimpleBar } from './SVGSimpleBar';
import type { AxisScale, IDatumEntry, ScaleSet, SeriesProps, SVGBarProps } from './types';
import { useBarTransitions } from './useBarTransitions';

export type SVGBarStackSeriesProps<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
> = {
  dataKey: string;
  dataEntry: IDatumEntry;
  scales: ScaleSet;
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  springConfig: SpringConfig;
  colorAccessor?: (datum: Datum, key: string) => string;
  colorScale: ScaleOrdinal<string, string, never>;
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
  dataEntry,
  scales,
  horizontal,
  renderingOffset,
  springConfig,
  animate,
  colorAccessor,
  colorScale,
  //   onBlur,
  //   onFocus,
  //   onPointerMove,
  //   onPointerOut,
  //   onPointerUp,
  component: BarComponent = SVGSimpleBar
}: SVGBarStackSeriesProps<IndependentScale, DependentScale, Datum>) {
  const transitions = useBarTransitions({
    dataEntry,
    scales,
    horizontal,
    renderingOffset,
    springConfig,
    animate
  });
  return (
    <>
      {transitions((springValues, datum, _, index) => (
        <BarComponent
          springValues={springValues}
          datum={datum as Datum}
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
