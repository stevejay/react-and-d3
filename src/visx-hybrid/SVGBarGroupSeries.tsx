import type { SpringConfig } from 'react-spring';
import { ScaleOrdinal } from 'd3-scale';

import { SVGSimpleBar } from './SVGSimpleBar';
import type { AxisScale, IDatumEntry, ScaleSet, SeriesProps, SVGBarProps } from './types';
import { useBarTransitions } from './useBarTransitions';

export type SVGBarGroupSeriesProps<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
> = {
  dataEntry: IDatumEntry;
  scales: ScaleSet;
  groupDataKeys: readonly string[];
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  springConfig: SpringConfig;
  colorAccessor: (datum: Datum, dataKey: string) => string;
  colorScale: ScaleOrdinal<string, string, never>;
  component?: (props: SVGBarProps<Datum>) => JSX.Element;
} & Pick<
  SeriesProps<IndependentScale, DependentScale, Datum>,
  'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onBlur' | 'onFocus' | 'enableEvents'
>;

export function SVGBarGroupSeries<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>({
  dataEntry,
  groupDataKeys,
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
}: SVGBarGroupSeriesProps<IndependentScale, DependentScale, Datum>) {
  const transitions = useBarTransitions<Datum>({
    dataEntry,
    scales,
    horizontal,
    renderingOffset,
    springConfig,
    animate,
    seriesIsLeaving: !groupDataKeys.includes(dataEntry.dataKey)
  });
  return (
    <>
      {transitions((springValues, datum, _, index) => (
        <BarComponent
          springValues={springValues}
          datum={datum}
          index={index}
          dataKey={dataEntry.dataKey}
          horizontal={horizontal}
          colorScale={colorScale}
          colorAccessor={colorAccessor}
        />
      ))}
    </>
  );
}
