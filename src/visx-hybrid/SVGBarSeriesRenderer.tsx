import type { SpringConfig } from 'react-spring';
import { ScaleOrdinal } from 'd3-scale';

import { SVGBar } from './SVGBar';
import type { AxisScale, IDataEntry, ScaleSet, SeriesProps, SVGBarComponent } from './types';
import { useBarTransitions } from './useBarTransitions';

export type SVGBarSeriesRendererProps<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
> = {
  dataEntry: IDataEntry;
  scales: ScaleSet;
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  springConfig: SpringConfig;
  colorAccessor: (datum: Datum, dataKey: string) => string;
  colorScale: ScaleOrdinal<string, string, never>;
  component?: SVGBarComponent<Datum>;
  seriesIsLeaving?: boolean;
} & Pick<
  SeriesProps<IndependentScale, DependentScale, Datum>,
  'onPointerMove' | 'onPointerOut' | 'onPointerUp' | 'onBlur' | 'onFocus' | 'enableEvents'
>;

export function SVGBarSeriesRenderer<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
>({
  dataEntry,
  scales,
  horizontal,
  renderingOffset,
  springConfig,
  animate,
  colorAccessor,
  colorScale,
  seriesIsLeaving = false,
  //   onBlur,
  //   onFocus,
  //   onPointerMove,
  //   onPointerOut,
  //   onPointerUp,
  component: BarComponent = SVGBar
}: SVGBarSeriesRendererProps<IndependentScale, DependentScale, Datum>) {
  const transitions = useBarTransitions<Datum>({
    dataEntry,
    scales,
    horizontal,
    renderingOffset,
    springConfig,
    animate,
    seriesIsLeaving
  });
  return (
    <>
      {transitions((springValues, datum, _, index) => (
        <BarComponent
          springValues={springValues}
          datum={dataEntry.getOriginalDatumFromRenderingDatum(datum)}
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
