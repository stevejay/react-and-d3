import type { ReactNode } from 'react';
import type { SpringConfig } from 'react-spring';

import type { AxisScale, IDataEntry, RenderAnimatedBarProps, ScaleSet, SeriesProps } from './types';
import { useBarTransitions } from './useBarTransitions';

export type SVGBarSeriesRendererProps<
  IndependentScale extends AxisScale,
  DependentScale extends AxisScale,
  Datum extends object
> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataEntry: IDataEntry<Datum, any>;
  scales: ScaleSet;
  horizontal: boolean;
  renderingOffset: number;
  animate: boolean;
  springConfig: SpringConfig;
  colorAccessor: (datum: Datum, dataKey: string) => string;
  // colorScale: ScaleOrdinal<string, string, never>;
  // component?: SVGBarComponent<Datum>;
  renderBar: (props: RenderAnimatedBarProps<Datum>) => ReactNode;
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
  // colorScale,
  seriesIsLeaving = false,
  //   onBlur,
  //   onFocus,
  //   onPointerMove,
  //   onPointerOut,
  //   onPointerUp,
  renderBar
}: SVGBarSeriesRendererProps<IndependentScale, DependentScale, Datum>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transitions = useBarTransitions<Datum, any>({
    dataEntry,
    scales,
    horizontal,
    renderingOffset,
    springConfig,
    animate,
    seriesIsLeaving
  });
  const fallbackColor = scales.color?.(dataEntry.dataKey) ?? 'currentColor';
  return (
    <>
      {transitions((springValues, datum, _, index) => {
        const dataKey = dataEntry.dataKey;
        const originalDatum = dataEntry.getOriginalDatumFromRenderingDatum(datum);
        const color = colorAccessor?.(originalDatum, dataKey) ?? fallbackColor;
        return renderBar({ springValues, datum: originalDatum, index, dataKey, horizontal, color });
      })}

      {/* {transitions((springValues, datum, _, index) => (
        <BarComponent
          springValues={springValues}
          datum={dataEntry.getOriginalDatumFromRenderingDatum(datum)}
          index={index}
          dataKey={dataEntry.dataKey}
          horizontal={horizontal}
          colorScale={colorScale}
          colorAccessor={colorAccessor}
        />
      ))} */}
    </>
  );
}
